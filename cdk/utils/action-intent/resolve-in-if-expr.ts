import { PolicyStatement } from 'aws-cdk-lib/aws-iam'

import {
	isRuntimeIfExpression,
	RuntimeIfExpression
} from '../runtime-if-expression.js'
import { ActionIntent, ActionIntentProps, isActionIntent } from './types.js'

export type RuntimeIfExpressionWithResolvedActions<T> =
	T extends RuntimeIfExpression<infer Result>
		? RuntimeIfExpression<RuntimeIfExpressionWithResolvedActions<Result>>
		: T extends ActionIntent
		? T['actionIntentProps']
		: T

export const resolveActionIntentsInRuntimeIfExpression = <
	T extends RuntimeIfExpression<unknown>
>(
	expression: T
): {
	action: RuntimeIfExpressionWithResolvedActions<T>
	iamStatements: PolicyStatement[]
} => {
	const resolve = (
		exp: RuntimeIfExpression<unknown>
	): {
		action: RuntimeIfExpressionWithResolvedActions<RuntimeIfExpression<unknown>>
		iamStatements: PolicyStatement[]
	} => {
		let iamStatements: PolicyStatement[] = []
		let positive: ActionIntentProps | RuntimeIfExpression<unknown> | unknown =
			exp.runtimeExpression.positive
		let negative: ActionIntentProps | RuntimeIfExpression<unknown> | unknown =
			exp.runtimeExpression.negative

		if (isRuntimeIfExpression(exp.runtimeExpression.positive)) {
			const result = resolve(exp.runtimeExpression.positive)
			positive = result.action
			iamStatements = [...iamStatements, ...result.iamStatements]
		}
		if (isRuntimeIfExpression(exp.runtimeExpression.negative)) {
			const result = resolve(exp.runtimeExpression.negative)
			negative = result.action
			iamStatements = [...iamStatements, ...result.iamStatements]
		}

		if (isActionIntent(exp.runtimeExpression.positive)) {
			positive = {
				...exp.runtimeExpression.positive.actionIntentProps
			}

			iamStatements = [
				...iamStatements,
				...exp.runtimeExpression.positive.actionIntentProps.iamStatements
			]
			// Clean up iamStatements from the actual value in case of AWS action intents
			delete (positive as Partial<ActionIntent['actionIntentProps']>)
				.iamStatements
		}
		if (isActionIntent(exp.runtimeExpression.negative)) {
			negative = {
				...exp.runtimeExpression.negative.actionIntentProps
			}

			iamStatements = [
				...iamStatements,
				...exp.runtimeExpression.negative.actionIntentProps.iamStatements
			]
			// Clean up iamStatements from the actual value in case of AWS action intents
			delete (negative as Partial<ActionIntent['actionIntentProps']>)
				.iamStatements
		}

		return {
			action: {
				runtimeExpression: {
					typeName: exp.runtimeExpression.typeName,
					statement: exp.runtimeExpression.statement,
					positive,
					negative
				}
			},
			iamStatements
		}
	}

	return resolve(expression) as {
		action: RuntimeIfExpressionWithResolvedActions<T>
		iamStatements: PolicyStatement[]
	}
}
