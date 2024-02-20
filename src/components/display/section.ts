import { Component, IComponent } from '../../utils/Component.js'
import { TypeOrRuntimeIfExpression } from '../../utils/runtime-if-expression.js'
import { SizeProps, SpacingProps, VariableReferenceString } from '../types.js'

export const section = (
	props: {
		label: TypeOrRuntimeIfExpression<string>
		body: IComponent[]
		collapsed?: TypeOrRuntimeIfExpression<boolean | VariableReferenceString>
	} & SpacingProps &
		SizeProps
): IComponent => {
	return new Component({
		typeName: 'display.section',
		props: {
			...props
		}
	})
}
