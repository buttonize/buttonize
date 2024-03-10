import { Component, IComponent } from '../../utils/Component.js'
import { TypeOrRuntimeIfExpression } from '../../utils/runtime-if-expression.js'
import { SizeProps, SpacingProps } from '../types.js'

/**
 * Displays an image within your Buttonize app.
 *
 * Learn more in the docs: {@link https://docs.buttonize.io/components/display-image/}
 *
 * @param url The URL of the image to show.
 * @param props
 * @example
 *
 * ```ts
 * Display.image('https://avatars.githubusercontent.com/u/72308571?s=50', {
 *   alt: 'Buttonize Log'
 * })
 * ```
 */
export const image = (
	url: TypeOrRuntimeIfExpression<string>,
	props: {
		/**
		 * A description for the image for accessibility.
		 */
		alt?: TypeOrRuntimeIfExpression<string>
	} & SpacingProps &
		SizeProps = {}
): IComponent => {
	return new Component({
		typeName: 'display.image',
		props: { url, ...props }
	})
}
