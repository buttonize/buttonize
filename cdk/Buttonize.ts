import { Stack } from 'aws-cdk-lib'
import { Construct } from 'constructs'

import {
	ButtonizeApiKeyContextKey,
	ButtonizeExternalIdContextKey,
	ButtonizeStageContextKey,
	ButtonizeTagsContextKey
} from './utils/const.js'

export class Buttonize {
	static setExternalId(scope: Construct, externalId: string): void {
		if (externalId.length < 6) {
			throw new Error('External ID must be at least 6 characters long.')
		}

		Stack.of(scope).node.setContext(ButtonizeExternalIdContextKey, externalId)
	}

	static setApiKey(scope: Construct, apiKey: string): void {
		Stack.of(scope).node.setContext(ButtonizeApiKeyContextKey, apiKey)
	}

	static setStage(scope: Construct, stage: string): void {
		Stack.of(scope).node.setContext(ButtonizeStageContextKey, stage)
	}

	static setTags(scope: Construct, tags: string[]): void {
		Stack.of(scope).node.setContext(ButtonizeTagsContextKey, tags)
	}

	static init(
		scope: Construct,
		{
			apiKey,
			externalId,
			stage,
			tags
		}: { apiKey: string; externalId: string; stage?: string; tags?: string[] }
	): void {
		Buttonize.setApiKey(scope, apiKey)
		Buttonize.setExternalId(scope, externalId)
		if (typeof stage !== 'undefined') {
			Buttonize.setStage(scope, stage)
		}
		if (typeof tags !== 'undefined') {
			Buttonize.setTags(scope, tags)
		}
	}
}
