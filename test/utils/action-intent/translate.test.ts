import { App, Stack } from 'aws-cdk-lib'
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam'
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda'
import { describe, expect, it } from 'vitest'

import { Action, B } from '../../../src'
import { translateActionIntentOrExpressionIntoPropsAndIam } from '../../../src/utils/action-intent'

describe('Utils -> Action Intent -> Translate', () => {
	it('should translate action', () => {
		const app = new App()
		const stack = new Stack(app, 'TestStack')

		const lambda = new Function(stack, 'TestLambda', {
			code: Code.fromInline('console.log(1)'),
			handler: 'index.handler',
			runtime: Runtime.NODEJS_LATEST
		})

		const expression = Action.aws.lambda.invoke(lambda)

		expect(
			translateActionIntentOrExpressionIntoPropsAndIam(expression)
		).toEqual({
			action: {
				type: 'aws',
				command: 'invoke',
				service: 'lambda',
				region: stack.region,
				input: {
					FunctionName: lambda.functionArn
				}
			},
			iamStatements: [
				new PolicyStatement({
					actions: ['lambda:InvokeFunction'],
					effect: Effect.ALLOW,
					resources: [lambda.functionArn]
				})
			]
		})
	})

	it('should translate action in expression (tested positive multi level)', () => {
		const app = new App()
		const stack = new Stack(app, 'TestStack')

		const lambda1 = new Function(stack, 'TestLambda1', {
			code: Code.fromInline('console.log(1)'),
			handler: 'index.handler',
			runtime: Runtime.NODEJS_LATEST
		})

		const lambda2 = new Function(stack, 'TestLambda2', {
			code: Code.fromInline('console.log(1)'),
			handler: 'index.handler',
			runtime: Runtime.NODEJS_LATEST
		})

		const lambda3 = new Function(stack, 'TestLambda3', {
			code: Code.fromInline('console.log(1)'),
			handler: 'index.handler',
			runtime: Runtime.NODEJS_LATEST
		})

		const expression = B.if(
			B.eq('{{a}', 'b'),
			B.if(
				B.gt('{{c}}', '2'),
				Action.aws.lambda.invoke(lambda1),
				Action.aws.lambda.invoke(lambda2)
			),
			Action.aws.lambda.invoke(lambda3)
		)

		expect(
			translateActionIntentOrExpressionIntoPropsAndIam(expression)
		).toEqual({
			action: {
				runtimeExpression: {
					negative: {
						command: 'invoke',
						executionRole: undefined,
						id: undefined,
						input: {
							FunctionName: lambda3.functionArn
						},
						outputPath: undefined,
						region: stack.region,
						service: 'lambda',
						type: 'aws'
					},
					positive: {
						runtimeExpression: {
							positive: {
								command: 'invoke',
								executionRole: undefined,
								id: undefined,
								input: {
									FunctionName: lambda1.functionArn
								},
								outputPath: undefined,
								region: stack.region,
								service: 'lambda',
								type: 'aws'
							},
							negative: {
								command: 'invoke',
								executionRole: undefined,
								id: undefined,
								input: {
									FunctionName: lambda2.functionArn
								},
								outputPath: undefined,
								region: stack.region,
								service: 'lambda',
								type: 'aws'
							},
							statement: {
								gt: ['{{c}}', '2']
							},
							typeName: 'if'
						}
					},
					statement: {
						eq: ['{{a}', 'b']
					},
					typeName: 'if'
				}
			},
			iamStatements: [
				new PolicyStatement({
					actions: ['lambda:InvokeFunction'],
					effect: Effect.ALLOW,
					resources: [lambda1.functionArn]
				}),
				new PolicyStatement({
					actions: ['lambda:InvokeFunction'],
					effect: Effect.ALLOW,
					resources: [lambda2.functionArn]
				}),
				new PolicyStatement({
					actions: ['lambda:InvokeFunction'],
					effect: Effect.ALLOW,
					resources: [lambda3.functionArn]
				})
			]
		})
	})

	it('should translate action in expression (tested negative multi level)', () => {
		const app = new App()
		const stack = new Stack(app, 'TestStack')

		const lambda1 = new Function(stack, 'TestLambda1', {
			code: Code.fromInline('console.log(1)'),
			handler: 'index.handler',
			runtime: Runtime.NODEJS_LATEST
		})

		const lambda2 = new Function(stack, 'TestLambda2', {
			code: Code.fromInline('console.log(1)'),
			handler: 'index.handler',
			runtime: Runtime.NODEJS_LATEST
		})

		const lambda3 = new Function(stack, 'TestLambda3', {
			code: Code.fromInline('console.log(1)'),
			handler: 'index.handler',
			runtime: Runtime.NODEJS_LATEST
		})

		const expression = B.if(
			B.eq('{{a}', 'b'),
			Action.aws.lambda.invoke(lambda1),
			B.if(
				B.gt('{{c}}', '2'),
				Action.aws.lambda.invoke(lambda2),
				Action.aws.lambda.invoke(lambda3)
			)
		)

		expect(
			translateActionIntentOrExpressionIntoPropsAndIam(expression)
		).toEqual({
			action: {
				runtimeExpression: {
					negative: {
						runtimeExpression: {
							negative: {
								command: 'invoke',
								executionRole: undefined,
								id: undefined,
								input: {
									FunctionName: lambda3.functionArn
								},
								outputPath: undefined,
								region: stack.region,
								service: 'lambda',
								type: 'aws'
							},
							positive: {
								command: 'invoke',
								executionRole: undefined,
								id: undefined,
								input: {
									FunctionName: lambda2.functionArn
								},
								outputPath: undefined,
								region: stack.region,
								service: 'lambda',
								type: 'aws'
							},
							statement: {
								gt: ['{{c}}', '2']
							},
							typeName: 'if'
						}
					},
					positive: {
						command: 'invoke',
						executionRole: undefined,
						id: undefined,
						input: {
							FunctionName: lambda1.functionArn
						},
						outputPath: undefined,
						region: stack.region,
						service: 'lambda',
						type: 'aws'
					},
					statement: {
						eq: ['{{a}', 'b']
					},
					typeName: 'if'
				}
			},
			iamStatements: [
				new PolicyStatement({
					actions: ['lambda:InvokeFunction'],
					effect: Effect.ALLOW,
					resources: [lambda2.functionArn]
				}),
				new PolicyStatement({
					actions: ['lambda:InvokeFunction'],
					effect: Effect.ALLOW,
					resources: [lambda3.functionArn]
				}),
				new PolicyStatement({
					actions: ['lambda:InvokeFunction'],
					effect: Effect.ALLOW,
					resources: [lambda1.functionArn]
				})
			]
		})
	})
})
