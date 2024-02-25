import { PublishCommand, SNSClient } from '@aws-sdk/client-sns'
import { CloudFormationCustomResourceEvent } from 'aws-lambda'

import { cfnRespond, CR_ERROR_PHYSICAL_ID } from './cfn.js'
import { iacTopicArn } from './iac-topic-arn.js'

const topicRegion = iacTopicArn.split(':')[3]

const sns = new SNSClient({ region: topicRegion })

export const dispatchSns = async (
	event: CloudFormationCustomResourceEvent
): Promise<void> => {
	const publishCommand = new PublishCommand({
		Message: JSON.stringify({
			event
		}),
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
