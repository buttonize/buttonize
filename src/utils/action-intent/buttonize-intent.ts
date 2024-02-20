import { PolicyStatement } from 'aws-cdk-lib/aws-iam'

import { BaseActionIntentProps } from './types.js'

export interface ButtonizeActionIntentProps extends BaseActionIntentProps {
	type: 'buttonize'
	service: string
	command: string
	input: object
}
export class ButtonizeActionIntent {
	public readonly actionIntentProps: ButtonizeActionIntentProps & {
		iamStatements: PolicyStatement[]
	}

	constructor(
		actionIntentProps: ButtonizeActionIntentProps & {
			iamStatements?: PolicyStatement[]
		}
	) {
		this.actionIntentProps = {
			...actionIntentProps,
			iamStatements: actionIntentProps.iamStatements ?? []
		}
	}
}
