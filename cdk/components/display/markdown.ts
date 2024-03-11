import { Component, IComponent } from '../../utils/Component.js'
import { TypeOrRuntimeIfExpression } from '../../utils/runtime-if-expression.js'
import { SizeProps, SpacingProps } from '../types.js'

/**
 * Displays content formatted with Markdown.
 *
 * Learn more in the docs: {@link https://docs.buttonize.io/components/display-markdown/}
 *
 * @param markdown
 * @param props
 * @example
 *
 * ```ts
 * Display.markdown('# Hello, *World*!')
 * ```
 */
export const markdown = (
	markdown: TypeOrRuntimeIfExpression<string>,
	props: SpacingProps & SizeProps = {}
): IComponent => {
	return new Component({
		typeName: 'display.markdown',
		props: { markdown, ...props }
	})
}
