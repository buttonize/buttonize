import { Component, IComponent } from '../../utils/Component.js'
import { TypeOrRuntimeIfExpression } from '../../utils/runtime-if-expression.js'
import { SizeProps, SpacingProps, VariableReferenceString } from '../types.js'

/**
 * Displays an interactable toggle button within a Buttonize page.
 *
 * Learn more in the docs: {@link https://docs.buttonize.io/components/input-toggle/}
 *
 * @param props
 * @example
 *
 * ```ts
 * Input.toggle({
 *   id: 'toggleSwitch',
 *   label: 'Enable Feature'
 * })
 * ```
 */
export const toggle = (
	props: {
		id: string
		label?: TypeOrRuntimeIfExpression<string>
		initialValue?: TypeOrRuntimeIfExpression<boolean | VariableReferenceString>
		disabled?: TypeOrRuntimeIfExpression<boolean | VariableReferenceString>
	} & SpacingProps &
		SizeProps
): IComponent => {
	return new Component({
		typeName: 'input.toggle',
		props: { ...props }
	})
}
