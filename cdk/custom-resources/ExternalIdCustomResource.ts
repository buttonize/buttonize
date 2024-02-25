import { CfnResource } from 'aws-cdk-lib'
import { Construct } from 'constructs'

import { CustomResourceProvider } from './CustomResourceProvider.js'

export class ExternalIdCustomResource extends CfnResource {
	constructor(scope: Construct, id: string) {
		const provider = CustomResourceProvider.getOrCreateProvider(scope)

		super(scope, id, {
			type: 'Custom::ButtonizeExternalIdGenerator',
			properties: {
				ServiceToken: provider.serviceToken
			}
		})
	}

	get secretValue(): string {
		return this.getAtt('SecretValue').toString()
	}
}
