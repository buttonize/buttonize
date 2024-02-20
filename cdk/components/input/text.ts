import { Component, IComponent } from '../../utils/Component.js'
import { TypeOrRuntimeIfExpression } from '../../utils/runtime-if-expression.js'
import { SizeProps, SpacingProps, VariableReferenceString } from '../types.js'

export const text = (
	props: {
		id: string
		label?: TypeOrRuntimeIfExpression<string>
		placeholder?: TypeOrRuntimeIfExpression<string>
		initialValue?: TypeOrRuntimeIfExpression<string>
		disabled?: TypeOrRuntimeIfExpression<boolean | VariableReferenceString>
	} & SpacingProps &
		SizeProps
): IComponent => {
	return new Component({
		typeName: 'input.text',
		props: { ...props }
	})
}
