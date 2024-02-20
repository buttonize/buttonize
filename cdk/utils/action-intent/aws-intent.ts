import { PolicyStatement } from 'aws-cdk-lib/aws-iam'

import { PlainExecutionRole } from '../../types.js'
import { BaseActionIntentProps } from './types.js'

export interface AwsActionIntentProps extends BaseActionIntentProps {
	type: 'aws'
	executionRole?: PlainExecutionRole
	region: string
	service: string
	command: string
	input: object
	outputPath?: string
}

export class AwsActionIntent {
	public readonly actionIntentProps: AwsActionIntentProps & {
		iamStatements: PolicyStatement[]
	}

	constructor(
		actionIntentProps: AwsActionIntentProps & {
			iamStatements: PolicyStatement[]
		}
	) {
		this.actionIntentProps = actionIntentProps
	}
}
