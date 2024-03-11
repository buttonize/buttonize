import { Component, IComponent } from '../../utils/Component.js'
import { TypeOrRuntimeIfExpression } from '../../utils/runtime-if-expression.js'
import { SizeProps, SpacingProps, VariableReferenceString } from '../types.js'

/**
 * Displays a collapsible section with a label and body content.
 *
 * Learn more in the docs: {@link https://docs.buttonize.io/components/display-section/}
 *
 * @param props
 * @example
 *
 * ```ts
 * Display.section({
 *   label: 'Title',
 *   body: [
 *     Display.heading('Hello, world!')
 *   ],
 *   collapsed: true
 * })
 * ```
 */
export const section = (
	props: {
		/**
		 * The label/title of the section.
		 */
		label: TypeOrRuntimeIfExpression<string>

		/**
		 * An array of Buttonize components which will be shown inside the section.
		 */
		body: IComponent[]

		/**
		 * Initial collapsed state of the section.
		 *
		 * @default false
		 */
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
