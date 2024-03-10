import { ResolutionTypeHint, Stack } from 'aws-cdk-lib'
import { Effect, Policy, PolicyStatement, Role } from 'aws-cdk-lib/aws-iam'
import { Construct } from 'constructs'

import { AppCustomResource } from './custom-resources/AppCustomResource.js'
import { ExternalIdCustomResource } from './custom-resources/ExternalIdCustomResource.js'
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
	/**
	 * Name of the app. Users can search for the app by it's name.
	 *
	 * @default Stack name and `id` of the `ButtonizeApp` construct
	 * @example Discount code generator
	 */
	name?: string

	/**
	 * Tags of the app. Tags can be used for filtering the list of apps
	 * and for setting up an advanced permissions system
	 * to allow groups of users access only to apps with certain tags.
	 *
	 * @default [] Empty array
	 * @example ['support', 'discounts', 'l1-access']
	 */
	tags?: string[]

	/**
	 * Tags of the app. Tags can be used for filtering the list of apps
	 * and for setting up an advanced permissions system
	 * to allow groups of users access only to apps with certain tags.
	 *
	 * @default '' Empty string
	 * @example Tool to give support team ability to generate special discount codes for demanding customers.
	 */
	description?: string

	/**
	 * Stage of the app. Stage can be used for filtering the list of apps.
	 * People often use with AWS CDK ephemeral/feature deployments.
	 * Using stages allows users to for example filter out only relevant
	 * production/staging apps.
	 *
	 * @default 'production'
	 */
	stage?: string

	/**
	 * **Use this approach only if you really need to.**
	 * In most of the cases you should use `Buttonize.init` instead.
	 *
	 * API Key used for deploying the app.
	 *
	 * @default The global API key set via `Buttonize.init(this, { apiKey: '...' })`
	 */
	apiKey?: string

	/**
	 * **Use this approach only if you really need to.**
	 * In most of the cases you should not need to use this.
	 *
	 * Custom execution role used for invoking AWS actions.
	 *
	 * @default Buttonize creates it's own role with all necessary permissions. Least privilege principle is obeyed.
	 */
	executionRole?: ExecutionRole
}

export interface ButtonizeAppPageProps {
	/**
	 * The actions to be invoked once the page loads.
	 * The result from the action is stored under the appropriate key in the runtime state.
	 * It can be used for example to pre-fetch data for `Input.select` options
	 * or simply to be displayed with `Display.text` etc.
	 *
	 * @default {} No actions
	 * @example
	 *
	 * ```ts
	 * {
	 *   availableShippingMethods: Action.aws.lambda.invoke(fetchShippingMethodsLambda)
	 * }
	 * ```
	 */
	initialState?: {
		[id: string]: ActionIntent
	}

	/**
	 * Title of the page. To give users context on what they can do on the page.
	 *
	 * @default The `name` of the app.
	 * @example Generate discount code
	 */
	title?: string

	/**
	 * Subtitle of the page. Can serve as a description or instructions for the page.
	 *
	 * @default The `description` of the app.
	 * @example You can select the percentage amount for the discount and click the "Generate the discount" button.
	 */
	subtitle?: string

	/**
	 * The components to be displayed on the page.
	 *
	 * The components are rendered in the same order as defined in the array.
	 *
	 * @example
	 *
	 * ```ts
	 * [
	 *   Display.heading('Generate discount code for customer'),
	 *   Input.select({
	 *     id: 'discount',
	 *     label: 'Discount value',
	 *     options: [
	 *       { label: '30%', value: 30 },
	 *       { label: '60%', value: 60 }
	 *     ]
	 *   }),
	 *   Input.button({
	 *     label: 'Generate discount',
	 *     onClick: Action.aws.lambda.invoke(
	 *       discountGenerator,
	 *       { Payload: { discountValue: '{{discount}}' } },
	 *       { id: 'discountGenerator' }
	 *     ),
	 *     onClickFinished: Action.buttonize.app.changePage('DonePage')
	 *   })
	 * ]
	 * ```
	 */
	body: IComponent[]
}

/**
 * The Buttonize App which can be deployed and used on {@link https://app.buttonize.io}
 *
 * @example
 *
 * ```ts
 * const discountGenerator = new NodejsFunction(this, 'DiscountGenerator', {
 *   entry: path.join(__dirname, 'discountGenerator.ts')
 * })
 *
 * new ButtonizeApp(this, 'DemoApp', {
 *   name: 'Discount code generator',
 *   description:
 *     'Select the discount amount and you will get the discount code on the next page.'
 * })
 * .page('InputPage', {
 *   body: [
 *     Display.heading('Generate discount code for customer'),
 *     Input.select({
 *       id: 'discount',
 *       label: 'Discount value',
 *       options: [
 *         { label: '30%', value: 30 },
 *         { label: '60%', value: 60 }
 *       ]
 *     }),
 *     Input.button({
 *       label: 'Generate discount',
 *       onClick: Action.aws.lambda.invoke(
 *       discountGenerator,
 *         { Payload: { discountValue: '{{discount}}' } },
 *         { id: 'discountGenerator' }
 *       ),
 *       onClickFinished: Action.buttonize.app.changePage('DonePage')
 *     })
 *   ]
 * })
 * .page('DonePage', {
 *   body: [
 *     Display.heading('Discount generated'),
 *     Display.text('Discount code: {{discountGenerator.code}}')
 *   ]
 * })
 * ```
 */
export class ButtonizeApp extends Construct {
	protected name: string
	protected pages: Record<string, ButtonizeAppPageProps> = {}
	protected appCustomResource: AppCustomResource
	protected apiKey: string

	/**
	 * Execution role generated by Buttonize used for invoking the actions.
	 *
	 * You can modify the role if you need, but be aware that it might break the app.
	 */
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
				externalIds: [
					contextExternalId ??
						new ExternalIdCustomResource(this, 'ExternalIdGenerator')
							.secretValue
				]
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

	/**
	 * Add a new page to the app.
	 *
	 * @param id Unique ID of the page in scope of the ButtonizeApp.
	 * @param props Page props such as `body` to define contents of the page.
	 */
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
