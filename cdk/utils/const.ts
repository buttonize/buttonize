import { AccountPrincipal } from 'aws-cdk-lib/aws-iam'

import { buttonizeAccountPrincipalId } from './buttonize-account-principal.js'

export const ButtonizeExternalIdContextKey = '@buttonize/externalId'
export const ButtonizeApiKeyContextKey = '@buttonize/apiKey'
export const ButtonizeStageContextKey = '@buttonize/stage'
export const ButtonizeTagsContextKey = '@buttonize/tags'
export const ButtonizeAccountPrincipal = new AccountPrincipal(
	buttonizeAccountPrincipalId
)
