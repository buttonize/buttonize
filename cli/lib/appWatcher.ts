import { paginate } from '@baselime/paginate-aws'
import type { Account } from 'aws-cdk/lib/index.js'
import type { CloudFormation, IAM } from 'aws-sdk'
import NodeEvaluator, { NodeEvaluatorOptions } from 'cfn-resolver-lib'
import { deepKeys, getProperty } from 'dot-prop'
import { EventEmitter } from 'events'

import { Logger } from '../logger.js'
import { Emitter } from '../types.js'
import { CdkWatcherEmitter, CdkWatcherEvent } from './cdkWatcher.js'
import { getSdk } from './sdk.js'
import {
	Apps,
	CdkForkedErrors,
	CdkForkedStack,
	CdkForkedStacks
} from './types.js'

export type AppWatcherEvent =
	| { name: 'rebuilding' }
	| {
			name: 'done'
			apps: Apps
			errors: CdkForkedErrors
	  }

export type AppWatcherEmitter = Emitter<{ event: AppWatcherEvent }>

let deployedStackDataCache: {
	[key: string]: Awaited<ReturnType<typeof tryToFetchDeployedStack>>
} = {}

const resetDeployedStackDataCache = (): void => {
	deployedStackDataCache = {}
}

export const createAppWatcher = async ({
	cdkEmitter
}: {
	cdkEmitter: CdkWatcherEmitter
}): Promise<{
	appEmitter: AppWatcherEmitter
	rebuild: () => void
	close: () => void
}> => {
	const appEmitter = new EventEmitter() as AppWatcherEmitter

	let latestCdkEvent:
		| {
				name: 'done'
				stacks: CdkForkedStacks
				errors: CdkForkedErrors
		  }
		| undefined
	let buildInProgress = false

	const onCdkEvent = async (event: CdkWatcherEvent): Promise<void> => {
		switch (event.name) {
			case 'done':
				latestCdkEvent = event
				buildInProgress = true

				appEmitter.emit('event', {
					name: 'rebuilding'
				})

				const apps = await extractAppsFromStacks(event.stacks)

				appEmitter.emit('event', {
					name: 'done',
					apps,
					errors: event.errors
				})
				buildInProgress = false
		}
	}

	cdkEmitter.on('event', onCdkEvent)
	return {
		appEmitter,
		close(): void {
			cdkEmitter.off('event', onCdkEvent)
		},
		rebuild(): void {
			if (typeof latestCdkEvent !== 'undefined' && !buildInProgress) {
				resetDeployedStackDataCache()
				onCdkEvent(latestCdkEvent)
			}
		}
	}
}

export const tryToFetchDeployedStack = async (
	stack: CdkForkedStack
): Promise<{
	stackName: string | null
	stackId: string | null
	evaluatorOptions: NodeEvaluatorOptions | null
	region: string | null
	account: Account | null
}> => {
	const evaluatorOptions = {
		RefResolvers: {} as Exclude<
			NodeEvaluatorOptions['RefResolvers'],
			undefined
		>,
		'Fn::GetAttResolvers': {} as Exclude<
			NodeEvaluatorOptions['Fn::GetAttResolvers'],
			undefined
		>
	}
	try {
		const { sdk } = await getSdk(stack)

		const cfn = sdk.cloudFormation() as CloudFormation

		let stackId: null | string = null

		for await (const stacks of paginate(
			async (next) =>
				stackId !== null
					? cfn
							.describeStacks({
								StackName: stack.metadata.stackName,
								NextToken: next
							})
							.promise()
					: { Stacks: [], NextToken: undefined },
			'NextToken'
		)) {
			for (const { StackId, StackStatus } of stacks.Stacks ?? []) {
				if (
					!StackStatus.startsWith('DELETE_') &&
					typeof StackId !== 'undefined'
				) {
					stackId = StackId
				}
			}
		}

		// For now only resolve Lambda Functions. Should be sufficient.
		for await (const stacks of paginate(
			(next) =>
				cfn
					.listStackResources({
						StackName: stack.metadata.stackName,
						NextToken: next
					})
					.promise(),
			'NextToken'
		)) {
			for (const {
				LogicalResourceId,
				PhysicalResourceId,
				ResourceType
			} of stacks.StackResourceSummaries ?? []) {
				const account = await sdk.currentAccount()

				switch (ResourceType) {
					case 'AWS::Lambda::Function':
						evaluatorOptions.RefResolvers[LogicalResourceId] =
							`${PhysicalResourceId}`
						evaluatorOptions['Fn::GetAttResolvers'][LogicalResourceId] = {
							Arn: `arn:${account.partition}:lambda:${sdk.currentRegion}:${account.accountId}:function:${PhysicalResourceId}`
						}
						break
					case 'AWS::IAM::Role':
						evaluatorOptions.RefResolvers[LogicalResourceId] =
							`${PhysicalResourceId}`
						evaluatorOptions['Fn::GetAttResolvers'][LogicalResourceId] = {
							Arn: `arn:${account.partition}:iam::${account.accountId}:role/${PhysicalResourceId}`
						}
						break
				}
			}
		}

		return {
			stackName: stack.metadata.stackName,
			stackId,
			evaluatorOptions,
			region: sdk.currentRegion,
			account: await sdk.currentAccount()
		}
	} catch (error) {
		Logger.debug(
			'Error when fetching CloduFormation Stack data from AWS',
			error
		)
		return {
			stackName: null,
			stackId: null,
			account: null,
			evaluatorOptions: null,
			region: null
		}
	}
}

export const tryToFetchExternalId = async (
	stack: CdkForkedStack,
	rawExecutionRoleArn: string
): Promise<string> => {
	const { sdk } = await getSdk(stack)

	const iam = sdk.iam() as IAM

	try {
		const iamResponse = await iam
			.getRole({
				RoleName: rawExecutionRoleArn.split(':role/')[1]
			})
			.promise()

		const trustPolicy =
			typeof iamResponse.Role.AssumeRolePolicyDocument === 'string'
				? JSON.parse(
						decodeURIComponent(iamResponse.Role.AssumeRolePolicyDocument)
					)
				: {}

		const externalIdPath = deepKeys(trustPolicy).find((path) =>
			path.includes('.sts:ExternalId')
		)

		if (typeof externalIdPath === 'undefined') {
			Logger.debug('External ID for role:', rawExecutionRoleArn, 'not found')
			return ''
		}

		const externalId = getProperty(trustPolicy, externalIdPath)

		if (typeof externalId === 'undefined') {
			Logger.debug(
				'External ID not found in the trust policy. Role:',
				rawExecutionRoleArn
			)
			return ''
		}

		return externalId
	} catch (err) {
		Logger.debug(
			'Encountered error when searching for Role External ID',
			err,
			'Role:',
			rawExecutionRoleArn
		)
		return ''
	}
}

export const extractAppsFromStacks = async (
	stacks: CdkForkedStacks
): Promise<Apps> => {
	const acc: Apps = {}

	for (const [stackId, stackData] of Object.entries(stacks)) {
		acc[stackId] = {}

		const key = `${stackData.metadata.stackName}__${stackData.metadata.env}`
		const deployedStackData =
			key in deployedStackDataCache
				? deployedStackDataCache[key]
				: await tryToFetchDeployedStack(stackData)
		deployedStackDataCache[key] = deployedStackData

		// The cfn-resolver-lib library is logging warnings
		// And we don't want any of those logs in our CLI
		const warn = console.warn
		console.warn = (): void => {}

		const resolvedTemplate = new NodeEvaluator(stackData.template, {
			RefResolvers: {
				...(deployedStackData.evaluatorOptions !== null
					? deployedStackData.evaluatorOptions.RefResolvers
					: {}),
				'AWS::Region': deployedStackData.region ?? '',
				'AWS::Partition':
					deployedStackData.account !== null
						? deployedStackData.account.partition
						: '',
				'AWS::AccountId':
					deployedStackData.account !== null
						? deployedStackData.account.accountId
						: '',
				'AWS::StackId': deployedStackData.stackId ?? '',
				'AWS::StackName': deployedStackData.stackName ?? ''
			},
			'Fn::GetAttResolvers':
				deployedStackData.evaluatorOptions !== null
					? deployedStackData.evaluatorOptions['Fn::GetAttResolvers']
					: {}
		}).evaluateNodes()

		// Revert console.warn
		console.warn = warn

		const rawApps = Object.entries<any>(resolvedTemplate.Resources).filter(
			([, { Type }]) => Type === 'Custom::ButtonizeApp'
		)

		for (const [rawAppId, rawAppTemplate] of rawApps) {
			const rawAppPages = Object.entries<any>(
				resolvedTemplate.Resources
			).filter(
				([, { Type, Properties }]) =>
					Type === 'Custom::ButtonizeAppPage' &&
					Properties.AppId[0] === rawAppId
			)

			acc[stackId][rawAppId] = {
				executionRoleArn: rawAppTemplate.Properties.ExecutionRoleArn,
				executionRoleExternalId:
					typeof rawAppTemplate.Properties.ExecutionRoleExternalId === 'string'
						? rawAppTemplate.Properties.ExecutionRoleExternalId
						: await tryToFetchExternalId(
								stackData,
								rawAppTemplate.Properties.ExecutionRoleArn
							),
				name: rawAppTemplate.Properties.Name,
				description: rawAppTemplate.Properties.Description,
				stage: rawAppTemplate.Properties.Stage,
				tags: rawAppTemplate.Properties.Tags,
				pages: rawAppPages.map<Apps[string][string]['pages'][number]>(
					([, rawPageTemplate]) => ({
						pageIdName: rawPageTemplate.Properties.PageIdName,
						body: JSON.parse(rawPageTemplate.Properties.Body),
						isFirstPage: rawPageTemplate.Properties.IsFirstPage === 'true',
						title: rawPageTemplate.Properties.Title,
						subtitle: rawPageTemplate.Properties.Subtitle,
						initialState:
							typeof rawPageTemplate.Properties.InitialState !== 'undefined'
								? JSON.parse(rawPageTemplate.Properties.InitialState)
								: undefined
					})
				)
			}
		}
	}

	return acc
}
