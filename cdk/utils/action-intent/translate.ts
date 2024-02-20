import { PolicyStatement } from 'aws-cdk-lib/aws-iam'

import { TypeOrRuntimeIfExpression } from '../runtime-if-expression.js'
import { resolveActionIntentsInRuntimeIfExpression } from './resolve-in-if-expr.js'
import { ActionIntent, ActionIntentProps, isActionIntent } from './types.js'

export const translateActionIntentIntoPropsAndIam = (
	action: ActionIntent
): {
	action: ActionIntentProps
	iamStatements: PolicyStatement[]
} => {
	const cleanAction = { ...action.actionIntentProps }
	// Clean up iamStatements from the actual value in case of AWS action intents
	delete (cleanAction as Partial<ActionIntent['actionIntentProps']>)
		.iamStatements

	return {
		iamStatements: action.actionIntentProps.iamStatements,
		action: cleanAction
	}
}

export const translateActionIntentOrExpressionIntoPropsAndIam = (
	action: TypeOrRuntimeIfExpression<ActionIntent>
): {
	action: TypeOrRuntimeIfExpression<ActionIntentProps>
	iamStatements: PolicyStatement[]
} => {
	if (!isActionIntent(action)) {
		return resolveActionIntentsInRuntimeIfExpression(action)
	}
	return translateActionIntentIntoPropsAndIam(action)
}
