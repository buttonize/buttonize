import { Role } from 'aws-cdk-lib/aws-iam'
import { Construct } from 'constructs'

import { ExecutionRole, PlainExecutionRole } from '../types.js'
import {
	ButtonizeApiKeyContextKey,
	ButtonizeExternalIdContextKey,
	ButtonizeStageContextKey,
	ButtonizeTagsContextKey
} from './const.js'
import { flatten } from './flatten.js'

export const getRoleExternalId = (role: Role): string => {
	const statementEntry = Object.entries(
		flatten(role.assumeRolePolicy?.toJSON() ?? {})
	).find((value): value is [string, string] =>
		value[0].endsWith('.sts:ExternalId')
	)

	if (typeof statementEntry === 'undefined') {
		throw new Error(
			'All roles assumed by Buttonize must have ExternalID. Please make sure to add "externalIds" property to your Role.'
		)
	}

	const [, externalId] = statementEntry

	return externalId
}

export const getExternalIdFromContext = (
	scope: Construct
): string | undefined =>
	scope.node.tryGetContext(ButtonizeExternalIdContextKey) as string | undefined

export const getApiKeyFromContext = (scope: Construct): string | undefined =>
	scope.node.tryGetContext(ButtonizeApiKeyContextKey) as string | undefined

export const getStageFromContext = (scope: Construct): string | undefined =>
	scope.node.tryGetContext(ButtonizeStageContextKey) as string | undefined

export const getTagsFromContext = (scope: Construct): string[] | undefined =>
	scope.node.tryGetContext(ButtonizeTagsContextKey) as string[] | undefined

export const extractExecutionRoleData = (
	executionRole?: ExecutionRole
): PlainExecutionRole | undefined =>
	executionRole instanceof Role
		? {
				roleArn: executionRole.roleArn,
				externalId: getRoleExternalId(executionRole)
			}
		: executionRole
