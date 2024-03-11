import { Component, IComponent } from '../../utils/Component.js'
import { TypeOrRuntimeIfExpression } from '../../utils/runtime-if-expression.js'
import { SizeProps, SpacingProps, VariableReferenceString } from '../types.js'

/**
 * Simple text input field.
 *
 * Learn more in the docs: {@link https://docs.buttonize.io/components/input-text/}
 *
 * @param props
 * @example
 *
 * ```ts
 * Input.text({
 *   id: 'name',
 *   label: 'What is your name?',
 *   placeholder: 'John Doe',
 *   initialValue: 'David Copperfield'
 * })
 * ```
 */
export const text = (
	props: {
		/**
		 * Key used for storing the value of the text input in the Runtime State {@link https://docs.buttonize.io/core-concepts/runtime-state/}.
		 */
		id: string

		/**
		 * Text above the input element.
		 */
		label?: TypeOrRuntimeIfExpression<string>

		/**
		 * Placeholder of the input element.
		 */
		placeholder?: TypeOrRuntimeIfExpression<string>

		/**
		 * The initial value for the input set in the Runtime State.
		 */
		initialValue?: TypeOrRuntimeIfExpression<string>

		/**
		 * Whether or not the input is disabled.
		 *
		 * @default false
		 */
		disabled?: TypeOrRuntimeIfExpression<boolean | VariableReferenceString>
	} & SpacingProps &
		SizeProps
): IComponent => {
	return new Component({
		typeName: 'input.text',
		props: { ...props }
	})
}
