import { Component, IComponent } from '../../utils/Component.js'
import { TypeOrRuntimeIfExpression } from '../../utils/runtime-if-expression.js'
import { SizeProps, SpacingProps } from '../types.js'

/**
 * Shows plain text on a Buttonize page.
 *
 * Learn more in the docs: {@link https://docs.buttonize.io/components/display-text/}
 *
 * @param label
 * @param props
 * @example
 *
 * ```ts
 * Display.text('Hello, World!')
 * ```
 */
export const text = (
	label: TypeOrRuntimeIfExpression<string>,
	props: SpacingProps & SizeProps = {}
): IComponent => {
	return new Component({
		typeName: 'display.text',
		props: { label, ...props }
	})
}
