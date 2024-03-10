import { Component, IComponent } from '../../utils/Component.js'
import { TypeOrRuntimeIfExpression } from '../../utils/runtime-if-expression.js'
import { SizeProps, SpacingProps, VariableReferenceString } from '../types.js'

/**
 * Renders code within your Buttonize app with syntax highlighting.
 *
 * Learn more in the docs: {@link https://docs.buttonize.io/components/display-code/}
 *
 * @param code
 * @param props
 * @example
 *
 * ```ts
 * Display.code('const message = "Hello, World!"', {
 *   language: 'typescript',
 *   title: 'Code Example'
 * })
 * ```
 */
export const code = (
	code: TypeOrRuntimeIfExpression<string>,
	props: {
		/**
		 * The programming language of the code for proper syntax highlighting.
		 *
		 * List of all available languages: {@link https://github.com/shikijs/textmate-grammars-themes/blob/main/packages/tm-grammars/README.md}
		 */
		language: TypeOrRuntimeIfExpression<string>

		/**
		 * Title for the code block.
		 *
		 * @default None
		 */
		title?: TypeOrRuntimeIfExpression<string>

		/**
		 * Frame type for the code block.
		 *
		 * @default 'code'
		 */
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
