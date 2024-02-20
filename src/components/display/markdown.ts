import { Component, IComponent } from '../../utils/Component.js'
import { TypeOrRuntimeIfExpression } from '../../utils/runtime-if-expression.js'
import { SizeProps, SpacingProps } from '../types.js'

export const markdown = (
	markdown: TypeOrRuntimeIfExpression<string>,
	props: SpacingProps & SizeProps = {}
): IComponent => {
	return new Component({
		typeName: 'display.markdown',
		props: { markdown, ...props }
	})
}
