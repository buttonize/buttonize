import { pathToFileURL } from 'node:url'

import cpx2 from 'cpx2'
import { EventEmitter } from 'events'
import * as path from 'path'
import type * as ts from 'typescript'

import { Colors } from '../colors.js'
import { Emitter } from '../types.js'
import { buildCdkTree } from './cdk.js'
import { CdkForkedErrors, CdkForkedStacks } from './types.js'
import { isVerbose } from './utils.js'

export type CdkWatcherEvent =
	| {
			name: 'error'
			message: string
	  }
	| {
			name: 'recompiled'
	  }
	| {
			name: 'beforeRecompilation'
	  }
	| {
			name: 'done'
			stacks: CdkForkedStacks
			errors: CdkForkedErrors
	  }

export type CdkWatcherEmitter = Emitter<{ event: CdkWatcherEvent }>

export const createCdkWatcher = async ({
	tmpDir
}: {
	tmpDir: string
}): Promise<{ cdkEmitter: CdkWatcherEmitter; close: () => void }> => {
	const importedTs = (
		await import(
			pathToFileURL(
				path.join(tmpDir, 'node_modules', 'typescript', 'lib', 'typescript.js')
			).href
		)
	).default as typeof ts

	let tsWatcher: ts.WatchOfConfigFile<any> | undefined
	let fsWatcher: cpx2.Watcher | undefined

	const cdkEmitter = new EventEmitter() as CdkWatcherEmitter

	const formatHost: ts.FormatDiagnosticsHost = {
		getCanonicalFileName: (path) => path,
		getCurrentDirectory: () => tmpDir,
		getNewLine: () => ''
	}

	const watchTs = (): void => {
		const tsConfigPath = importedTs.findConfigFile(
			tmpDir,
			importedTs.sys.fileExists,
			'tsconfig.json'
		)

		if (!tsConfigPath) {
			cdkEmitter.emit('event', {
				name: 'error',
				message: 'tsconfig.json file not found in the project folder'
			})
			return
		}

		const host = importedTs.createWatchCompilerHost(
			tsConfigPath,
			{
				outDir: tmpDir,
				sourceMap: false,
				declaration: false
			},
			importedTs.sys,
			importedTs.createEmitAndSemanticDiagnosticsBuilderProgram,
			(diagnostic) => {
				const message = importedTs.formatDiagnostic(diagnostic, formatHost)
				if (isVerbose()) {
					Colors.line(Colors.dim(Colors.bold('TSC Error:'), message))
				}

				cdkEmitter.emit('event', {
					name: 'error',
					message
				})
			},
			(diagnostic: ts.Diagnostic) => {
				if (isVerbose()) {
					Colors.line(
						Colors.dim(
							Colors.bold('TSC Info:'),
							importedTs.formatDiagnostic(diagnostic, formatHost)
						)
					)
				}
			}
		)

		const origCreateProgram = host.createProgram
		host.createProgram = (
			rootNames,
			options,
			host,
			oldProgram
		): ts.EmitAndSemanticDiagnosticsBuilderProgram => {
			cdkEmitter.emit('event', { name: 'beforeRecompilation' })

			return origCreateProgram(rootNames, options, host, oldProgram)
		}

		const origPostProgramCreate = host.afterProgramCreate as Exclude<
			(typeof host)['afterProgramCreate'],
			undefined
		>
		host.afterProgramCreate = async (program): Promise<void> => {
			// Make sure all compiled files are written to filesystem
			setTimeout(async () => {
				cdkEmitter.emit('event', { name: 'recompiled' })

				const { stacks, errors } = await buildCdkTree(tmpDir)

				cdkEmitter.emit('event', { name: 'done', stacks, errors })
			}, 100)

			origPostProgramCreate(program)
		}

		tsWatcher = importedTs.createWatchProgram(host)
	}

	fsWatcher = cpx2.watch('**/*', tmpDir, {
		ignore: ['node_modules', '.git']
	})
	fsWatcher.on('watch-ready', () => watchTs())

	return {
		cdkEmitter,
		close(): void {
			tsWatcher?.close()
			fsWatcher?.close()
		}
	}
}
