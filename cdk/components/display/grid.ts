import { Component, IComponent } from '../../utils/Component.js'
import { SpacingProps } from '../types.js'

/**
 * Displays the given components with the specified, grid-based layout.
 *
 * Learn more in the docs: {@link https://docs.buttonize.io/components/display-grid/}
 *
 * @param columns
 * @param props
 * @example
 *
 * ```ts
 * Display.grid([
 *   { size: 1, body: [Display.heading('Title')] },
 *   { size: 2, body: [Display.text('Some description to right instead of below')] }
 * ])
 * ```
 */
export const grid = (
	columns: {
		/**
		 * Width of the grid column.
		 *
		 * Total sum of all sizes must be less or equal 4
		 *
		 * @default 1
		 */
		size?: 1 | 2 | 3 | 4

		/**
		 * Body of the grid column.
		 */
		body: IComponent[]
	}[],
	props: SpacingProps = {}
): IComponent => {
	return new Component({
		typeName: 'display.grid',
		props: { columns, ...props }
	})
}
