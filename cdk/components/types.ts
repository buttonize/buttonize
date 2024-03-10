export type VariableReferenceString = `{{${string}}}`

export type SpacingUnits =
	| 'none'
	| 'sm'
	| 'md'
	| 'lg'
	| 'xl'
	| VariableReferenceString

export type WidthUnits = 1 | 2 | 3 | 4 | VariableReferenceString

export interface SpacingProps {
	/**
	 * The amount of space to give above the component.
	 */
	spacingTop?: SpacingUnits

	/**
	 * The amount of space to give below the component.
	 */
	spacingBottom?: SpacingUnits
}

export interface SizeProps {
	/**
	 * The width of the component.
	 */
	width?: WidthUnits
}
