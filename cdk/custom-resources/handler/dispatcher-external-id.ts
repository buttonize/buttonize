import { randomBytes } from 'node:crypto'

import { CloudFormationCustomResourceEvent } from 'aws-lambda'

import { cfnRespond, CR_ERROR_PHYSICAL_ID } from './cfn.js'

export const dispatchExternalId = async (
	event: CloudFormationCustomResourceEvent
): Promise<void> => {
	try {
		switch (event.RequestType) {
			case 'Create':
				const idValue = randomBytes(10).toString('hex')

				const secretValue = randomBytes(20).toString('hex')

				await cfnRespond(
					event,
					{
						status: 'SUCCESS',
						physicalResourceId: idValue,
						data: {
							SecretValue: secretValue
						},
						noEcho: true
					},
					'Successfully generated AWS IAM External ID secret'
				)
				return
			case 'Update':
				await cfnRespond(
					event,
					{
						status: 'FAILED',
						reason: `It's not possible to modify Buttonize IAM External ID generator resource. Please make sure to remove the resource instead of updating it.`,
						physicalResourceId: event.PhysicalResourceId
					},
					'No External ID Update allowed'
				)
				return
			case 'Delete':
				await cfnRespond(
					event,
					{
						status: 'SUCCESS',
						physicalResourceId: event.PhysicalResourceId
					},
					'Successfully removed External ID resource'
				)
				return
		}
	} catch (err) {
		const error = err as Error
		await cfnRespond(
			event,
			{
				status: 'FAILED',
				reason: `[Contact us at buttonize.io or Discord] Error occurred when generating IAM Role External ID secret. Error: ${error.name}: ${error.message}`,
				physicalResourceId:
					event.RequestType === 'Create'
						? CR_ERROR_PHYSICAL_ID
						: event.PhysicalResourceId
			},
			'External ID Unknown Error'
		)
	}
}
