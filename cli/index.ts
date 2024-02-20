#!/usr/bin/env node

import { blue, red } from 'colorette'

import { dev } from './commands/dev.js'
import { VisibleError } from './error.js'
import { Logger } from './logger.js'
import { program } from './program.js'
import { spinners } from './spinner.js'

dev(program)

if (
	'setSourceMapsEnabled' in process &&
	typeof process.setSourceMapsEnabled === 'function'
) {
	process.setSourceMapsEnabled(true)
}

process.removeAllListeners('uncaughtException')
process.on('uncaughtException', (err) => {
	Logger.debug(err)
	for (const spinner of spinners) {
		if (spinner.isSpinning) spinner.fail(spinner.text)
	}
	console.log(red('Error:'), err.message)
	if (!(err instanceof VisibleError)) {
		console.log()
		console.trace(err.stack)
	}
	console.log()
	console.log(
		`Need help with this error? Let us know in #help on the Buttonize Discord ${blue(
			`https://discord.gg/2quY4Vz5BM`
		)}`
	)
	process.exit(1)
})

// Check Node version
const nodeVersion = process.versions.node
if (Number(nodeVersion.split('.')[0]) < 18) {
	throw new VisibleError(
		`Node.js version ${nodeVersion} is not supported by Buttonize. Please upgrade to Node.js 18 or later.`
	)
}

program.parse()
