import { Component, IComponent } from '../../utils/Component.js'
import { SpacingProps } from '../types.js'

export const grid = (
	columns: {
		size?: 1 | 2 | 3 | 4
		body: IComponent[]
	}[],
	props: SpacingProps = {}
): IComponent => {
	return new Component({
		typeName: 'display.grid',
		props: { columns, ...props }
	})
}
