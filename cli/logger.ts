import fs from 'fs/promises'

import { isVerbose } from './lib/utils.js'

let previous = new Date()

const useFile = async () => {
	const filePath = 'debug.log'
	const file = await fs.open(filePath, 'w')
	return file
}

export const Logger = {
	debug(...parts: any[]) {
		const now = new Date()
		const diff = now.getTime() - previous.getTime()
		previous = now
		const line = [
			new Date().toISOString(),
			`+${diff}ms`.padStart(8),
			'[debug]',
			...parts.map((x) => {
				if (typeof x === 'string') return x
				return JSON.stringify(x)
			})
		]
		if (isVerbose()) console.log(...line)

		useFile().then((file) => {
			file.write(line.join(' ') + '\n')
		})
	}
}
