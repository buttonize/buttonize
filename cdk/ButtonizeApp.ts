import { ResolutionTypeHint, Stack } from 'aws-cdk-lib'
import { Effect, Policy, PolicyStatement, Role } from 'aws-cdk-lib/aws-iam'
import { Construct } from 'constructs'

import { AppCustomResource } from './custom-resources/AppCustomResource.js'
import { PageCustomResource } from './custom-resources/PageCustomResource.js'
import { ExecutionRole } from './types.js'
import {
	ActionIntent,
	ActionIntentProps,
	translateActionIntentIntoPropsAndIam
} from './utils/action-intent/index.js'
import { IComponent } from './utils/Component.js'
import { ButtonizeAccountPrincipal } from './utils/const.js'
import {
	getApiKeyFromContext,
	getExternalIdFromContext,
	getRoleExternalId,
	getStageFromContext,
	getTagsFromContext
} from './utils/utils.js'

export interface ButtonizeAppProps {
	name?: string
	tags?: string[]
	description?: string
	apiKey?: string
	stage?: string
	executionRole?: ExecutionRole
}

export interface ButtonizeAppPageProps {
	initialState?: {
		[id: string]: ActionIntent
	}
	title?: string
	subtitle?: string
	body: IComponent[]
}

export class ButtonizeApp extends Construct {
	protected name: string
	protected pages: Record<string, ButtonizeAppPageProps> = {}
	protected appCustomResource: AppCustomResource
	protected apiKey: string

	readonly executionRole: ExecutionRole

	constructor(scope: Construct, id: string, props: ButtonizeAppProps = {}) {
		super(scope, id)

		const contextApiKey = getApiKeyFromContext(this)
		const contextExternalId = getExternalIdFromContext(this)
		const contextStage = getStageFromContext(this)
		const contextTags = getTagsFromContext(this)

		if (
			typeof contextApiKey === 'undefined' &&
			typeof props.apiKey === 'undefined'
		) {
			throw new Error(
				`Buttonize API Key has not been defined. Please make sure to call Buttonize.init(...) in the beginning of your Stack definition or supply it as "apiKey" property during creation of "${id}" Buttonize App.`
			)
		}

		if (
			typeof contextExternalId === 'undefined' &&
			typeof props.executionRole === 'undefined'
		) {
			throw new Error(
				`Buttonize IAM Role External ID has not been defined. Please make sure to call Buttonize.init(...) in the beginning of your Stack definition or supply it as "executionRole" property during creation of "${id}" Buttonize App.`
			)
		}

		const stage = props.stage ?? contextStage ?? 'production'
		if (stage.length === 0) {
			throw new Error('Buttonize Stage value must have at least one character.')
		}

		this.name = props.name ?? `${Stack.of(this).stackName} ${id}`
		this.apiKey = props.apiKey ?? (contextApiKey as string)

		this.executionRole =
			props.executionRole ??
			new Role(this, 'ExecutionRole', {
				description: `Execution role for "${this.name}" Buttonize App`,
				assumedBy: ButtonizeAccountPrincipal,
				externalIds: [contextExternalId as string]
			})

		if (this.executionRole instanceof Role) {
			this.executionRole.assumeRolePolicy?.addStatements(
				new PolicyStatement({
					effect: Effect.ALLOW,
					principals: [ButtonizeAccountPrincipal],
					actions: ['sts:SetSourceIdentity', 'sts:TagSession'] // For customer's CloudTrail auditing
				})
			)
		}

		this.appCustomResource = new AppCustomResource(this, 'ButtonizeApp', {
			apiKey: this.apiKey,
			name: this.name,
			stage: stage,
			tags: Array.from(
				// To make sure there are no duplicates among tags
				new Set([...(props.tags ?? []), ...(contextTags ?? [])])
			)
				// make sure tags are not empty
				.filter((tag) => tag.length > 0),
			description: props.description ?? '',
			executionRole: {
				roleArn: this.executionRole.roleArn,
				externalId:
					this.executionRole instanceof Role
						? getRoleExternalId(this.executionRole)
						: this.executionRole.externalId
			}
		})
	}

	page(id: string, props: ButtonizeAppPageProps): ButtonizeApp {
		const { initialState, initialStateIamStatements } =
			typeof props.initialState !== 'undefined'
				? Object.entries(props.initialState).reduce<{
						initialState: {
							[id: string]: ActionIntentProps
						}
						initialStateIamStatements: PolicyStatement[]
					}>(
						(acc, [id, actionIntent]) => {
							const { action, iamStatements } =
								translateActionIntentIntoPropsAndIam(actionIntent)

							return {
								initialState: {
									...acc.initialState,
									[id]: action
								},
								initialStateIamStatements: [
									...acc.initialStateIamStatements,
									...iamStatements
								]
							}
						},
						{
							initialState: {},
							initialStateIamStatements: []
						}
					)
				: { initialState: undefined, initialStateIamStatements: [] }

		new PageCustomResource(this, `ButtonizePage${id}`, {
			apiKey: this.apiKey,
			pageIdName: id,
			appId: this.appCustomResource.getAtt('AppId', ResolutionTypeHint.STRING),
			body: props.body.map((component) => component.serializeComponent()),
			isFirstPage: Object.keys(this.pages).length === 0,
			initialState: initialState,
			title: props.title,
			subtitle: props.subtitle
		}).addDependency(this.appCustomResource)

		const statements = props.body.reduce<PolicyStatement[]>(
			(acc, component) => [...acc, ...component.resolveIamStatements()],
			[...initialStateIamStatements]
		)

		if (statements.length > 0 && this.executionRole instanceof Role) {
			this.executionRole.attachInlinePolicy(
				new Policy(this, `ButtonizePagePolicy${id}`, {
					statements: statements
				})
			)
		}

		this.pages[id] = props
		return this
	}
}
