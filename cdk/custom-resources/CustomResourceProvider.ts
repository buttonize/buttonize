import { Duration, Fn, Stack } from 'aws-cdk-lib'
import {
	Effect,
	Policy,
	PolicyDocument,
	PolicyStatement,
	Role,
	ServicePrincipal
} from 'aws-cdk-lib/aws-iam'
import { Code, Runtime, SingletonFunction } from 'aws-cdk-lib/aws-lambda'
import { LogRetention, RetentionDays } from 'aws-cdk-lib/aws-logs'
import { Construct } from 'constructs'
import * as path from 'path'

import { iacTopicArn } from './handler/iac-topic-arn.js'
import { version } from './version.js'

export class CustomResourceProvider extends Construct {
	/**
	 * **Do not use this value in your CDK code. It's for internal use only.**
	 */
	static readonly CUSTOM_RESOURCE_PROVIDER_ID: string =
		'ButtonizeCustomResourceProvider'

	/**
	 * **Do not use this value in your CDK code. It's for internal use only.**
	 */
	static readonly SINGLETON_LAMBDA_UUID: string =
		'55153c2b-f7bc-4976-af13-351d63d42efc'

	/**
	 * **Do not use this method in your CDK code. It's for internal use only.**
	 *
	 * @param {Construct} scope
	 * @returns {CustomResourceProvider}
	 */
	public static getOrCreateProvider(scope: Construct): CustomResourceProvider {
		const stack = Stack.of(scope)

		const provider =
			(stack.node.tryFindChild(
				CustomResourceProvider.CUSTOM_RESOURCE_PROVIDER_ID
			) as CustomResourceProvider) ?? new CustomResourceProvider(stack)

		return provider
	}

	/**
	 * ARN of the custom resource lambda function handler
	 */
	public readonly serviceToken: string

	private readonly handler: SingletonFunction

	private readonly role: Role

	private get functionName(): string {
		return `${Stack.of(this).stackName}-buttonize-cr`
	}

	protected constructor(scope: Construct) {
		super(scope, CustomResourceProvider.CUSTOM_RESOURCE_PROVIDER_ID)

		this.role = new Role(this, 'LambdaRole', {
			assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
			inlinePolicies: {
				snsTopicPolicy: new PolicyDocument({
					statements: [
						new PolicyStatement({
							effect: Effect.ALLOW,
							actions: ['sns:Publish'],
							resources: [iacTopicArn]
						})
					]
				})
			}
		})

		this.handler = new SingletonFunction(this, 'LambdaHandler', {
			functionName: this.functionName,
			role: this.role,
			code: Code.fromAsset(path.join(__dirname, 'handler')),
			runtime: Runtime.NODEJS_18_X,
			handler: 'index.handler',
			uuid: CustomResourceProvider.SINGLETON_LAMBDA_UUID,
			lambdaPurpose: 'buttonize-custom-resource-handler',
			timeout: Duration.minutes(2),
			memorySize: 512,
			environment: {
				PACKAGE_NAME: 'npm@buttonize',
				PACKAGE_VERSION: version
			}
		})

		this.serviceToken = this.handler.functionArn
	}

	/**
	 * **Do not use this method in your CDK code. It's for internal use only.**
	 *
	 * Instead use `btnz.GlobalConfig.enableCustomResourceLogs(...)`
	 *
	 * @param {RetentionDays} [retention=RetentionDays.THREE_MONTHS]
	 */
	public enableLogs(
		retention: RetentionDays = RetentionDays.THREE_MONTHS
	): void {
		const logGroupName = `/aws/lambda/${this.functionName}`

		new LogRetention(this, 'LogRetention', {
			logGroupName,
			retention
		})

		this.role.attachInlinePolicy(
			new Policy(this, 'LogsPolicy', {
				policyName: 'buttonize-custom-resources-logs',
				document: new PolicyDocument({
					statements: [
						new PolicyStatement({
							effect: Effect.ALLOW,
							actions: ['logs:CreateLogStream', 'logs:CreateLogGroup'],
							resources: [
								Fn.sub(
									`arn:\${AWS::Partition}:logs:\${AWS::Region}:\${AWS::AccountId}:log-group:${logGroupName}:*`
								)
							]
						}),
						new PolicyStatement({
							effect: Effect.ALLOW,
							actions: ['logs:PutLogEvents'],
							resources: [
								Fn.sub(
									`arn:\${AWS::Partition}:logs:\${AWS::Region}:\${AWS::AccountId}:log-group:${logGroupName}:*:*`
								)
							]
						})
					]
				})
			})
		)
	}
}
