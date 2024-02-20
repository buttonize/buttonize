import { AccountPrincipal } from 'aws-cdk-lib/aws-iam'

export const ButtonizeExternalIdContextKey = '@buttonize/externalId'
export const ButtonizeApiKeyContextKey = '@buttonize/apiKey'
export const ButtonizeStageContextKey = '@buttonize/stage'
export const ButtonizeTagsContextKey = '@buttonize/tags'
export const ButtonizeAccountPrincipal = new AccountPrincipal('376361556750') // TODO change before production
