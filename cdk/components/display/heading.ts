import { Component, IComponent } from '../../utils/Component.js'
import { TypeOrRuntimeIfExpression } from '../../utils/runtime-if-expression.js'
import { SizeProps, SpacingProps, VariableReferenceString } from '../types.js'

export const heading = (
	label: TypeOrRuntimeIfExpression<string>,
	props: {
		subtitle?: TypeOrRuntimeIfExpression<string>
		level?: TypeOrRuntimeIfExpression<1 | 2 | 3 | 4 | VariableReferenceString>
	} & SpacingProps &
		SizeProps = {}
): IComponent => {
	return new Component({
		typeName: 'display.heading',
		props: { label, ...props }
	})
}
