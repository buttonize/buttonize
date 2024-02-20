import ora, { Options, Ora } from 'ora'

import { Colors } from './colors.js'

export const spinners: Ora[] = []

export function createSpinner(options: Options | string) {
	const next = ora(options)
	spinners.push(next)
	Colors.mode('line')
	return next
}
