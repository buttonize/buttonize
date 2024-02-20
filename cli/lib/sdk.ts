import { Mode } from 'aws-cdk/lib/api/plugin/credential-provider-source.js'
import * as cdkLib from 'aws-cdk/lib/index.js'
import { EnvironmentUtils } from 'aws-cdk-lib/cx-api'

import { CdkForkedStack } from './types.js'

const cache: { [key: string]: cdkLib.SdkForEnvironment } = {}

export const getSdk = async (
	stack: CdkForkedStack
): Promise<cdkLib.SdkForEnvironment> => {
	const key = `${stack.metadata.stackName}__${stack.metadata.env}`
	if (key in cache) {
		return cache[key]
	}

	const sdkProvider = await (
		cdkLib.default as typeof cdkLib
	).SdkProvider.withAwsCliCompatibleDefaults()

	const sdk = await sdkProvider.forEnvironment(
		EnvironmentUtils.parse(stack.metadata.env),
		Mode.ForReading
	)

	cache[key] = sdk

	return sdk
}
