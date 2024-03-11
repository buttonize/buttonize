import { Component, IComponent } from '../../utils/Component.js'
import { TypeOrRuntimeIfExpression } from '../../utils/runtime-if-expression.js'
import { SizeProps, SpacingProps, VariableReferenceString } from '../types.js'

/**
 * Displays a video within your Buttonize app.
 *
 * The video link must be a valid value for the src attribute of an HTML <video> tag.
 *
 * Embeddable YouTube video links and other such <iframe>-based links will not work.
 *
 * Learn more in the docs: {@link https://docs.buttonize.io/components/display-video/}
 *
 * @param url
 * @param props
 * @example
 *
 * ```ts
 * Display.video('https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm')
 * ```
 */
export const video = (
	url: TypeOrRuntimeIfExpression<string>,
	props: {
		/**
		 * Initial muted state of the video.
		 *
		 * @default false
		 */
		muted?: TypeOrRuntimeIfExpression<boolean | VariableReferenceString>
	} & SpacingProps &
		SizeProps = {}
): IComponent => {
	return new Component({
		typeName: 'display.video',
		props: { url, ...props }
	})
}
