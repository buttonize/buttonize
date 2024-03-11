import { Component, IComponent } from '../../utils/Component.js'
import { TypeOrRuntimeIfExpression } from '../../utils/runtime-if-expression.js'
import { SizeProps, SpacingProps, VariableReferenceString } from '../types.js'

export interface InputSelectOption {
	label: string | VariableReferenceString
	value: string | number | boolean | VariableReferenceString
}

/**
 * Displays a dropdown field, allowing a user to select an option from a pre-defined list.
 *
 * Learn more in the docs: {@link https://docs.buttonize.io/components/input-select/}
 *
 * @param props
 * @example
 *
 * ```ts
 * Input.select({
 *   id: 'selectInput',
 *   options: [
 *     { label: 'Option 1', value: 'option1' },
 *     { label: 'Option 2', value: 'option2' },
 *   ],
 *   label: 'Select an option',
 *   placeholder: 'Choose one...',
 *   initialValue: [
 *     { label: 'Option 1', value: 'option1' }
 *   ]
 * })
 * ```
 */
export const select = (
	props: {
		/**
		 * The name of the variable containing the selected option. This variable can then be referenced elsewhere in your Buttonize app.
		 */
		id: string

		/**
		 * An array of options. Each option should have a `label` and `value` key set.
		 */
		options: TypeOrRuntimeIfExpression<
			InputSelectOption[] | VariableReferenceString
		>

		/**
		 * Text to display above the select input.
		 */
		label?: TypeOrRuntimeIfExpression<string>

		/**
		 * Whether or not the input is disabled.
		 *
		 * @default false
		 */
		disabled?: TypeOrRuntimeIfExpression<boolean | VariableReferenceString>

		/**
		 * Placeholder text for the select input.
		 */
		placeholder?: TypeOrRuntimeIfExpression<string>

		/**
		 * Enables multi-select functionality.
		 *
		 * @default false
		 */
		multi?: TypeOrRuntimeIfExpression<boolean | VariableReferenceString>

		/**
		 * Initial selected value or values for the select input. Use an array for multi-select.
		 */
		initialValue?: TypeOrRuntimeIfExpression<
			InputSelectOption | InputSelectOption[] | VariableReferenceString
		>
	} & SpacingProps &
		SizeProps
): IComponent => {
	return new Component({
		typeName: 'input.select',
		props: { ...props }
	})
}
