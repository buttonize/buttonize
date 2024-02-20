import type {
	CloudFormationCustomResourceEvent,
	CloudFormationCustomResourceResponse
} from 'aws-lambda'
import * as https from 'https'
import * as url from 'url'

import { httpsRequest } from './https.js'

export const CR_ERROR_PHYSICAL_ID = '__custom-resource-error__'

export const cfnRespond = async (
	event: CloudFormationCustomResourceEvent,
	response: {
		status: CloudFormationCustomResourceResponse['Status']
		reason?: string
		physicalResourceId: string
	},
	logName: string
): Promise<void> => {
	// unknown custom resource error response
	// in order to prevent stack deployments from being stuck

	const requestUrl = new url.URL(event.ResponseURL)

	const request: CloudFormationCustomResourceResponse = {
		Status: response.status,
		Reason: response.reason ?? '',
		RequestId: event.RequestId,
		StackId: event.StackId,
		LogicalResourceId: event.LogicalResourceId,
		PhysicalResourceId: response.physicalResourceId
	}

	const requestBody = JSON.stringify(request)

	const options: https.RequestOptions = {
		hostname: requestUrl.hostname,
		port: 443,
		path: `${requestUrl.pathname}${requestUrl.search}`,
		method: 'PUT',
		headers: {
			'Content-Type': '',
			'Content-Length': requestBody.length
		}
	}

	await httpsRequest(options, requestBody, logName)
}
