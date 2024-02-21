import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam'

import { AwsActionProps } from '../../../types.js'
import { AwsActionIntent } from '../../../utils/action-intent/index.js'
import { extractExecutionRoleData } from '../../../utils/utils.js'

export const invokeModel = (
	input: { region?: string } & (
		| {
				modelId: 'amazon.titan-text-express-v1' | 'amazon.titan-text-lite-v1'
				body:
					| {
							inputText: string
							textGenerationConfig?: {
								temperature?: number
								topP?: number
								maxTokenCount?: number
								stopSequences?: string[]
							}
					  }
					| string
		  }
		| {
				modelId:
					| 'anthropic.claude-v1'
					| 'anthropic.claude-v2'
					| 'anthropic.claude-v2:1'
					| 'anthropic.claude-instant-v1'
				body:
					| {
							prompt: string | { system: string; human: string }
							temperature?: number
							top_p?: number
							top_k?: number
							max_tokens_to_sample?: number
					  }
					| string
		  }
	),
	{ id, executionRole, outputPath }: AwsActionProps = {}
): AwsActionIntent => {
	let body: any = input.body

	if (
		'amazon.titan-text-express-v1' === input.modelId ||
		'amazon.titan-text-lite-v1' === input.modelId
	) {
		body =
			typeof input.body === 'string'
				? {
						inputText: input.body
					}
				: input.body
	} else if (
		'anthropic.claude-v1' === input.modelId ||
		'anthropic.claude-v2' === input.modelId ||
		'anthropic.claude-v2:1' === input.modelId ||
		'anthropic.claude-instant-v1' === input.modelId
	) {
		if (typeof input.body === 'string') {
			body = {
				max_tokens_to_sample: 200,
				prompt: `\n\nHuman:${input.body}\n\nAssistant:`
			}
		} else if (typeof input.body.prompt === 'string') {
			body = {
				max_tokens_to_sample: 200,
				...input.body
			}
		} else {
			body = {
				max_tokens_to_sample: 200,
				...input.body,
				prompt: `${input.body.prompt.system}\n\nHuman:${input.body.prompt.human}\n\nAssistant:`
			}
		}
		body.stop_sequences = ['\n\nHuman:']
	}

	return new AwsActionIntent({
		id,
		type: 'aws',
		executionRole: extractExecutionRoleData(executionRole),
		region: input.region ?? 'us-east-1',
		service: 'bedrockRuntime',
		command: 'invokeModel',
		outputPath,
		input: {
			body,
			modelId: input.modelId
		},
		iamStatements:
			typeof executionRole === 'undefined'
				? [
						new PolicyStatement({
							effect: Effect.ALLOW,
							actions: ['bedrock:InvokeModel'],
							resources: [
								`arn:aws:bedrock:${
									input.region ?? 'us-east-1'
								}::foundation-model/${input.modelId}`
							]
						})
					]
				: []
	})
}
