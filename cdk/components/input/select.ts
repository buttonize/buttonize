import { Component, IComponent } from '../../utils/Component.js'
import { TypeOrRuntimeIfExpression } from '../../utils/runtime-if-expression.js'
import { SizeProps, SpacingProps, VariableReferenceString } from '../types.js'
// TODO

export interface InputSelectOption {
	label: string | VariableReferenceString
	value: string | number | boolean | VariableReferenceString
}

export const select = (
	props: {
		id: string
		options: TypeOrRuntimeIfExpression<
			InputSelectOption[] | VariableReferenceString
		>
		label?: TypeOrRuntimeIfExpression<string>
		disabled?: TypeOrRuntimeIfExpression<boolean | VariableReferenceString>
		placeholder?: TypeOrRuntimeIfExpression<string>
		multi?: TypeOrRuntimeIfExpression<boolean | VariableReferenceString>
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
