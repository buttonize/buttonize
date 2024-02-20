import { Role } from 'aws-cdk-lib/aws-iam'

export interface PlainExecutionRole {
	roleArn: string
	externalId: string
}

export type ExecutionRole = Role | PlainExecutionRole

export interface BaseActionProps {
	id?: string
}

export interface AwsActionProps extends BaseActionProps {
	outputPath?: string
	executionRole?: ExecutionRole
}

export interface ButtonizeActionProps extends BaseActionProps {}
