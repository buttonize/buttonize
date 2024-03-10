import {
	ActionIntent,
	translateActionIntentOrExpressionIntoPropsAndIam
} from '../../utils/action-intent/index.js'
import { Component, IComponent } from '../../utils/Component.js'
import { TypeOrRuntimeIfExpression } from '../../utils/runtime-if-expression.js'
import { SizeProps, SpacingProps, VariableReferenceString } from '../types.js'

/**
 * Renders an interactable button.
 *
 * The button can be used to trigger a lambda, change pages within a Buttonize
 * app, or interact with some other AWS services via Buttonize Actions {@link https://docs.buttonize.io/core-concepts/actions/#available-actions}.
 *
 * Learn more in the docs: {@link https://docs.buttonize.io/components/input-button/}
 *
 * @param props
 * @example
 *
 * ```ts
 * Input.button({
 *   label: 'Invoke Lambda',
 *   onClick: Action.aws.lambda.invoke(
 *     new NodejsFunction(this, 'ExampleLambda', {
 *       entry: 'exampleLambda.ts'
 *     })
 *   ),
 *   onClickFinished: Action.buttonize.app.changePage('EndPage')
 * })
 * ```
 */
export const button = (
	props: {
		/**
		 * The text to display inside the button.
		 */
		label: TypeOrRuntimeIfExpression<string>

		/**
		 * The action to call when the user clicks the button.
		 * {@link https://docs.buttonize.io/core-concepts/actions/#available-actions}
		 */
		onClick: TypeOrRuntimeIfExpression<ActionIntent>

		/**
		 * A variant of the button.
		 *
		 * @default 'primary'
		 */
		kind?: TypeOrRuntimeIfExpression<
			'primary' | 'secondary' | 'tertiary' | VariableReferenceString
		>

		/**
		 * An intent of the button.
		 *
		 * @default 'default'
		 */
		intent?: TypeOrRuntimeIfExpression<
			'default' | 'positive' | 'negative' | VariableReferenceString
		>

		/**
		 * Whether or not the button can be interacted with.
		 *
		 * @default false
		 */
		disabled?: TypeOrRuntimeIfExpression<boolean | VariableReferenceString>

		/**
		 * A callback that will be invoked when the `onClick` function is finished executing.
		 *
		 * This is also often used to redirect to the next page via `Action.buttonize.app.changePage(...)`.
		 */
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
		typeName: 'input.button',
		props: {
			...props,
			onClick: onClick.action,
			onClickFinished: onClickFinished.action
		},
		iamStatements: [...onClick.iamStatements, ...onClickFinished.iamStatements]
	})
}
