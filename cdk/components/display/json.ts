import { Component, IComponent } from '../../utils/Component.js'
import { TypeOrRuntimeIfExpression } from '../../utils/runtime-if-expression.js'
import { SizeProps, SpacingProps, VariableReferenceString } from '../types.js'

/**
 * Renders JSON data within a Buttonize page.
 *
 * Learn more in the docs: {@link https://docs.buttonize.io/components/display-json/}
 *
 * @param json
 * @param props
 * @example
 *
 * ```ts
 * Display.json({ key: 'value' })
 * ```
 */
export const json = (
	json: TypeOrRuntimeIfExpression<
		VariableReferenceString | Record<string, unknown>
	>,
	props: SpacingProps & SizeProps = {}
): IComponent => {
	return new Component({
		typeName: 'display.json',
		props: { json, ...props }
	})
}
