import { CfnResource } from 'aws-cdk-lib'
import { Construct } from 'constructs'

import { PlainExecutionRole } from '../types.js'
import { CustomResourceProvider } from './CustomResourceProvider.js'

export interface AppCustomResourceProps {
	name: string
	executionRole: PlainExecutionRole
	apiKey: string
	stage: string
	description: string
	tags: string[]
}

export class AppCustomResource extends CfnResource {
	constructor(scope: Construct, id: string, props: AppCustomResourceProps) {
		const provider = CustomResourceProvider.getOrCreateProvider(scope)

		super(scope, id, {
			type: 'Custom::ButtonizeApp',
			properties: {
				ServiceToken: provider.serviceToken,
				ApiKey: props.apiKey,
				Name: props.name,
				Description: props.description,
				ExecutionRoleArn: props.executionRole.roleArn,
				ExecutionRoleExternalId: props.executionRole.externalId,
				Tags: props.tags,
				Stage: props.stage
			}
		})
	}
}
