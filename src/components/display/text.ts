import { Component, IComponent } from '../../utils/Component.js'
import { TypeOrRuntimeIfExpression } from '../../utils/runtime-if-expression.js'
import { SizeProps, SpacingProps } from '../types.js'

export const text = (
	label: TypeOrRuntimeIfExpression<string>,
	props: SpacingProps & SizeProps = {}
): IComponent => {
	return new Component({
		typeName: 'display.text',
		props: { label, ...props }
	})
}
