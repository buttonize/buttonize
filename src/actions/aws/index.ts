import { bedrock } from './bedrock/index.js'
import { dynamodb } from './dynamodb/index.js'
import { lambda } from './lambda/index.js'

export const aws = {
	bedrock,
	dynamodb,
	lambda
} as const
