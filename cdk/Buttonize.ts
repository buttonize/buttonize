import { Stack } from 'aws-cdk-lib'
import { Construct } from 'constructs'

import {
	ButtonizeApiKeyContextKey,
	ButtonizeExternalIdContextKey,
	ButtonizeStageContextKey,
	ButtonizeTagsContextKey
} from './utils/const.js'

export interface ButtonizeInitProps {
	/**
	 * Default API Key that will be used for all the Buttonize apps in the CDK stack.
	 *
	 * Secret string. Must be a valid API Key created at {@link https://app.buttonize.io}
	 *
	 * *Please make sure to use a **plain string**. Any references to Secrets Manager or Parameter Store won't work
	 * due to a CloudFormation limitation with Custom Resources.
	 * Learn more here: {@link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html}*
	 */
	apiKey: string

	/**
	 * Default IAM External ID that will be used for all the Buttonize apps in the CDK stack.
	 *
	 * **By default Buttonize generates the External ID on its own via special Custom Resource called "ExternalIdCustomResource".**
	 *
	 * **Use this approach only if you really need to.**
	 *
	 * Learn more about IAM External ID here: {@link https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user_externalid.html}
	 *
	 * *Please make sure to use a **plain string**. Any references to Secrets Manager or Parameter Store won't work
	 * due to a CloudFormation limitation with Custom Resources.
	 * Learn more here: {@link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html}*
	 */
	externalId?: string

	/**
	 * Default Stage that will be used for all the Buttonize apps in the CDK stack.
	 */
	stage?: string

	/**
	 * Default Tags that will be applied to all the Buttonize apps in the CDK stack.
	 *
	 * The default tags will be merged and added to the tags defined for the individual apps.
	 */
	tags?: string[]
}

/**
 * Configuration of the Buttonize context.
 *
 * Make sure to call `Buttonize.init` at the very beginning of the CDK stack definition.
 *
 * @example
 *
 * ```ts
 * Buttonize.init(this, {
 *   apiKey: 'btnz_mybuttonizekey1234567'
 * })
 * ```
 */
export abstract class Buttonize {
	/**
	 * Set default IAM External ID that will be used for all the Buttonize apps in the CDK stack.
	 *
	 * **By default Buttonize generates the External ID on its own via a special Custom Resource called "ExternalIdCustomResource".**
	 *
	 * **Use this approach only if you really need to.**
	 *
	 * Learn more about IAM External ID here: {@link https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user_externalid.html}
	 *
	 * *Please make sure to use a **plain string**. Any references to Secrets Manager or Parameter Store won't work
	 * due to a CloudFormation limitation with Custom Resources.
	 * Learn more here: {@link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html}*
	 *
	 * @param scope
	 * @param externalId Secret string. Min length 6 characters.
	 */
	static setExternalId(scope: Construct, externalId: string): void {
		if (externalId.length < 6) {
			throw new Error('External ID must be at least 6 characters long.')
		}

		Stack.of(scope).node.setContext(ButtonizeExternalIdContextKey, externalId)
	}

	/**
	 * Set default API Key that will be used for all the Buttonize apps in the CDK stack.
	 *
	 * *Please make sure use use a **plain string**. Any references to Secrets Manager or Parameter Store won't work
	 * due to a CloudFormation limitation with Custom Resources.
	 * Learn more here: {@link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html}*
	 *
	 * @param scope
	 * @param apiKey Secret string. Must be a valid API Key created at {@link https://app.buttonize.io}
	 */
	static setApiKey(scope: Construct, apiKey: string): void {
		Stack.of(scope).node.setContext(ButtonizeApiKeyContextKey, apiKey)
	}

	/**
	 * Set default Stage that will be used for all the Buttonize apps in the CDK stack.
	 *
	 * @param scope
	 * @param stage Stage name.
	 */
	static setStage(scope: Construct, stage: string): void {
		Stack.of(scope).node.setContext(ButtonizeStageContextKey, stage)
	}

	/**
	 * Set default Tags that will be applied to all the Buttonize apps in the CDK stack.
	 *
	 * The default tags will be merged and added to the tags defined for the individual apps.
	 *
	 * @param scope
	 * @param tags Array of string tags.
	 */
	static setTags(scope: Construct, tags: string[]): void {
		Stack.of(scope).node.setContext(ButtonizeTagsContextKey, tags)
	}

	/**
	 * Initialize Buttonize in the context of the CDK Stack.
	 *
	 * Make sure to call `Buttonize.init` at the very beginning of the CDK stack definition.
	 *
	 * @param scope
	 * @param props `Buttonize.init` props such as `apiKey`.
	 * @example
	 *
	 * ```ts
	 * Buttonize.init(this, {
	 *   apiKey: 'btnz_mybuttonizekey1234567'
	 * })
	 * ```
	 */
	static init(scope: Construct, props: ButtonizeInitProps): void {
		Buttonize.setApiKey(scope, props.apiKey)
		if (typeof props.externalId !== 'undefined') {
			Buttonize.setExternalId(scope, props.externalId)
		}
		if (typeof props.stage !== 'undefined') {
			Buttonize.setStage(scope, props.stage)
		}
		if (typeof props.tags !== 'undefined') {
			Buttonize.setTags(scope, props.tags)
		}
	}
}
