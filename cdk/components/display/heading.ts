import { Component, IComponent } from '../../utils/Component.js'
import { TypeOrRuntimeIfExpression } from '../../utils/runtime-if-expression.js'
import { SizeProps, SpacingProps, VariableReferenceString } from '../types.js'

/**
 * Displays bold heading with large font size.
 *
 * Learn more in the docs: {@link https://docs.buttonize.io/components/display-heading/}
 *
 * @param label The displayed text.
 * @param props
 * @example
 *
 * ```ts
 * Display.heading('QR code')
 * ```
 */
export const heading = (
	label: TypeOrRuntimeIfExpression<string>,
	props: {
		/**
		 * Can serve as a further description of the heading.
		 */
		subtitle?: TypeOrRuntimeIfExpression<string>

		/**
		 * Level of the heading.
		 *
		 * @default 1
		 */
		level?: TypeOrRuntimeIfExpression<1 | 2 | 3 | 4 | VariableReferenceString>
	} & SpacingProps &
		SizeProps = {}
): IComponent => {
	return new Component({
		typeName: 'display.heading',
		props: { label, ...props }
	})
}
