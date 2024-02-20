import { Component, IComponent } from '../../utils/Component.js'
import { TypeOrRuntimeIfExpression } from '../../utils/runtime-if-expression.js'
import { SizeProps, SpacingProps, VariableReferenceString } from '../types.js'

export const code = (
	code: TypeOrRuntimeIfExpression<string>,
	props: {
		language: TypeOrRuntimeIfExpression<string>
		title?: TypeOrRuntimeIfExpression<string>
		frame?: TypeOrRuntimeIfExpression<
			'code' | 'terminal' | 'none' | 'auto' | VariableReferenceString
		>
	} & SpacingProps &
		SizeProps
): IComponent => {
	return new Component({
		typeName: 'display.code',
		props: { code, ...props }
	})
}
