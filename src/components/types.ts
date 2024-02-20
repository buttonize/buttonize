export type VariableReferenceString = `{{${string}}}`

export type SpacingUnits = 'sm' | 'md' | 'lg' | 'xl' | VariableReferenceString

export type WidthUnits = 1 | 2 | 3 | 4 | VariableReferenceString

export interface SpacingProps {
	spacingTop?: SpacingUnits
	spacingBottom?: SpacingUnits
}

export interface SizeProps {
	width?: WidthUnits
}
