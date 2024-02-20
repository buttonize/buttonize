import { PublishCommand, SNSClient } from '@aws-sdk/client-sns'
import type { CloudFormationCustomResourceHandler } from 'aws-lambda'

import { cfnRespond, CR_ERROR_PHYSICAL_ID } from './cfn.js'
import { iacTopicArn, topicRegion } from './const.js'

const sns = new SNSClient({ region: topicRegion })

export const handler: CloudFormationCustomResourceHandler = async (event) => {
	console.log('Processing custom resource request...')

	const iacRequestBody = JSON.stringify({
		event
	})

	console.log(iacRequestBody)

	// In order to prevent stack deployments from being stuck in case of unknown errors
	// or unavalible Buttonize API, we send SUCCESS response when CfN is reverting the stack
	if (
		event.RequestType !== 'Create' &&
		event.PhysicalResourceId === CR_ERROR_PHYSICAL_ID
	) {
		console.log(
			'Detected "CR_ERROR_PHYSICAL_ID" as PhysicalResourceId. Sending SUCCESS response to CloudFormation.'
		)

		await cfnRespond(
			event,
			{
				status: 'SUCCESS',
				physicalResourceId: event.PhysicalResourceId
			},
			'Custom Resource Error Cleanup'
		)
	} else {
		const publishCommand = new PublishCommand({
			Message: iacRequestBody,
			MessageAttributes: {
				packageName: {
					DataType: 'String',
					StringValue: `${process.env.PACKAGE_NAME}`
				},
				packageVersion: {
					DataType: 'String',
					StringValue: `${process.env.PACKAGE_VERSION}`
				}
			},
			TopicArn: iacTopicArn
		})

		try {
			await sns.send(publishCommand)
		} catch (err) {
			const error = err as Error
			await cfnRespond(
				event,
				{
					status: 'FAILED',
					reason: `[Contact us at buttonize.io or Discord] Error occurred when publishing message to Buttonize SNS topic. Error: ${error.name}: ${error.message}`,
					physicalResourceId:
						event.RequestType === 'Create'
							? CR_ERROR_PHYSICAL_ID
							: event.PhysicalResourceId
				},
				'SNS Error'
			)
		}
	}
}
