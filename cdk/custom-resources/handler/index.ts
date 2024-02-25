import type { CloudFormationCustomResourceHandler } from 'aws-lambda'

import { cfnRespond, CR_ERROR_PHYSICAL_ID } from './cfn.js'
import { dispatchExternalId } from './dispatcher-external-id.js'
import { dispatchSns } from './dispatcher-sns.js'

export const handler: CloudFormationCustomResourceHandler = async (event) => {
	console.log('Processing custom resource request...')

	console.log(
		JSON.stringify({
			event
		})
	)

	// In order to prevent stack deployments from being stuck in case of unknown errors
	// or unavailable Buttonize API, we send SUCCESS response when CfN is reverting the stack
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
		return
	}

	// Dispatch event
	if (event.ResourceType === 'Custom::ButtonizeExternalIdGenerator') {
		await dispatchExternalId(event)
	} else {
		await dispatchSns(event)
	}
}
