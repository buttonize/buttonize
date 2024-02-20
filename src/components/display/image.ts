import { Component, IComponent } from '../../utils/Component.js'
import { TypeOrRuntimeIfExpression } from '../../utils/runtime-if-expression.js'
import { SizeProps, SpacingProps } from '../types.js'

export const image = (
	url: TypeOrRuntimeIfExpression<string>,
	props: {
		alt?: TypeOrRuntimeIfExpression<string>
	} & SpacingProps &
		SizeProps = {}
): IComponent => {
	return new Component({
		typeName: 'display.image',
		props: { url, ...props }
	})
}
