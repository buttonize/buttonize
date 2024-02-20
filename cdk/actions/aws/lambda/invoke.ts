import type { InvokeCommandInput as LambdaInvokeCommandInput } from '@aws-sdk/client-lambda'
import { Stack } from 'aws-cdk-lib'
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam'
import type { IFunction } from 'aws-cdk-lib/aws-lambda'

import { AwsActionProps } from '../../../types.js'
import { AwsActionIntent } from '../../../utils/action-intent/index.js'
import { extractExecutionRoleData } from '../../../utils/utils.js'

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
