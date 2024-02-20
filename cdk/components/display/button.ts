import {
	ActionIntent,
	translateActionIntentOrExpressionIntoPropsAndIam
} from '../../utils/action-intent/index.js'
import { Component, IComponent } from '../../utils/Component.js'
import { TypeOrRuntimeIfExpression } from '../../utils/runtime-if-expression.js'
import { SizeProps, SpacingProps, VariableReferenceString } from '../types.js'

export const button = (
	props: {
		label: TypeOrRuntimeIfExpression<string>
		onClick: TypeOrRuntimeIfExpression<ActionIntent>
		variant?: TypeOrRuntimeIfExpression<
			'primary' | 'secondary' | 'tertiary' | VariableReferenceString
		>
		disabled?: TypeOrRuntimeIfExpression<boolean | VariableReferenceString>
		onClickFinished?: TypeOrRuntimeIfExpression<ActionIntent>
	} & SpacingProps &
		SizeProps
): IComponent => {
	const onClick = translateActionIntentOrExpressionIntoPropsAndIam(
		props.onClick
	)

	const onClickFinished =
		typeof props.onClickFinished !== 'undefined'
			? translateActionIntentOrExpressionIntoPropsAndIam(props.onClickFinished)
			: { action: undefined, iamStatements: [] }

	return new Component({
		typeName: 'display.button',
		props: {
			...props,
			onClick: onClick.action,
			onClickFinished: onClickFinished.action
		},
		iamStatements: [...onClick.iamStatements, ...onClickFinished.iamStatements]
	})
}
