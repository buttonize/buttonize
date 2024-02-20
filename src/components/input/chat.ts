import {
	ActionIntent,
	translateActionIntentOrExpressionIntoPropsAndIam
} from '../../utils/action-intent/index.js'
import { Component, IComponent } from '../../utils/Component.js'
import { TypeOrRuntimeIfExpression } from '../../utils/runtime-if-expression.js'
import { SizeProps, SpacingProps, VariableReferenceString } from '../types.js'

export const chat = (
	props: {
		id: string
		onMessage: TypeOrRuntimeIfExpression<ActionIntent>
		placeholder?: TypeOrRuntimeIfExpression<string>
		disabled?: TypeOrRuntimeIfExpression<boolean | VariableReferenceString>
	} & SpacingProps &
		SizeProps
): IComponent => {
	const onMessage = translateActionIntentOrExpressionIntoPropsAndIam(
		props.onMessage
	)

	return new Component({
		typeName: 'input.chat',
		props: {
			...props,
			onMessage: onMessage.action
		},
		iamStatements: [...onMessage.iamStatements]
	})
}
