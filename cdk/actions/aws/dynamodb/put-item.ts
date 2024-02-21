import type { PutItemInput as DynamoDBPutItemInput } from '@aws-sdk/client-dynamodb'
import { Stack } from 'aws-cdk-lib'
import type { ITable } from 'aws-cdk-lib/aws-dynamodb'
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam'

import { AwsActionProps } from '../../../types.js'
import { AwsActionIntent } from '../../../utils/action-intent/index.js'
import { extractExecutionRoleData } from '../../../utils/utils.js'

export const putItem = (
	table: ITable,
	input: Omit<DynamoDBPutItemInput, 'TableName'>,
	{ id, executionRole, outputPath }: AwsActionProps = {}
): AwsActionIntent =>
	new AwsActionIntent({
		id,
		type: 'aws',
		executionRole: extractExecutionRoleData(executionRole),
		region: Stack.of(table).region,
		service: 'dynamodb',
		command: 'putItem',
		input: {
			...input,
			TableName: table.tableName
		},
		outputPath,
		iamStatements:
			typeof executionRole === 'undefined'
				? [
						new PolicyStatement({
							effect: Effect.ALLOW,
							actions: ['dynamodb:PutItem'],
							resources: [table.tableArn]
						})
					]
				: []
	})
