import type { InvokeCommandInput as LambdaInvokeCommandInput } from '@aws-sdk/client-lambda'
import { Stack } from 'aws-cdk-lib'
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam'
import type { IFunction } from 'aws-cdk-lib/aws-lambda'

import { AwsActionProps } from '../../../types.js'
import { AwsActionIntent } from '../../../utils/action-intent/index.js'
import { extractExecutionRoleData } from '../../../utils/utils.js'

/**
 * Invoke a lambda function.
 *
 * `input.Payload` is of type object. Buttonize will stringify the payload to JSON before sending it to AWS API.
 *
 * @param f Lambda function
 * @param input Lambda Invoke API call props
 * @param props Buttonize Action props
 * @example
 *
 * ```ts
 * const saveToDbLambda = new NodejsFunction(this, 'SaveToDbLambda', {
 *   entry: path.join(__dirname, `lambdaHandler.ts`)
 * })
 *
 * Input.button({
 *   label: 'Save to database',
 *   onClick: Action.aws.lambda.invoke(
 *     saveToDbLambda,
 *     {
 *       Payload: {
 *         saveToDb: true,
 *         userName: '{{name}}'
 *       }
 *     }
 *   )
 * })
 * ```
 */
export const invoke = (
	f: IFunction,
	input: Omit<LambdaInvokeCommandInput, 'Payload' | 'FunctionName'> & {
		Payload?: object
	} = {},
	props: AwsActionProps = {}
): AwsActionIntent =>
	new AwsActionIntent({
		id: props.id,
		type: 'aws',
		executionRole: extractExecutionRoleData(props.executionRole),
		region: Stack.of(f).region,
		service: 'lambda',
		command: 'invoke',
		input: {
			...input,
			FunctionName: f.functionArn
		},
		outputPath: props.outputPath,
		iamStatements:
			typeof props.executionRole === 'undefined'
				? [
						new PolicyStatement({
							effect: Effect.ALLOW,
							actions: ['lambda:InvokeFunction'],
							resources: [f.functionArn]
						})
					]
				: []
	})
