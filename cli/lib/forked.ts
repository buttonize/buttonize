import { pathToFileURL } from 'node:url'

import type { App as AppType, Stack as StackType } from 'aws-cdk-lib'
import type { Template as TemplateType } from 'aws-cdk-lib/assertions'
import * as path from 'path'

import { CdkForkedErrors, CdkForkedInput, CdkForkedStacks } from './types.js'

const sendResponse = ({
	stacks,
	errors
}: {
	stacks: CdkForkedStacks
	errors: CdkForkedErrors
}): void => {
	if (typeof process.send !== 'undefined') {
		process.send(JSON.stringify({ stacks, errors }))
	} else {
		throw new Error('This should never happen')
	}
}

export const forked = async ({
	tmpDir,
	entrypoint
}: CdkForkedInput): Promise<void> => {
	const stacks: CdkForkedStacks = {}
	const errors: string[] = []

	try {
		const { App, Stack } = await import(
			pathToFileURL(
				path.join(tmpDir, 'node_modules', 'aws-cdk-lib', 'index.js')
			).href
		)

		const { Template } = await import(
			pathToFileURL(
				path.join(
					tmpDir,
					'node_modules',
					'aws-cdk-lib',
					'assertions',
					'index.js'
				)
			).href
		)

		let binFile
		try {
			binFile = await import(
				pathToFileURL(path.join(tmpDir, entrypoint.replace(/\.[^/.]+$/, '.js')))
					.href
			)
		} catch (err) {
			if (
				typeof err === 'object' &&
				err !== null &&
				'code' in err &&
				err.code === 'ERR_MODULE_NOT_FOUND'
			) {
				errors.push(
					`Provided entrypoint argument "${entrypoint}" doesn't contain valid JS/TS file with CDK App.`,
					`Please make sure the path in entrypoint argument is correct.\n\n`
				)
			}

			throw err
		}

		for (const [, variableValue] of Object.entries(binFile)) {
			if (variableValue instanceof App) {
				try {
					const app = variableValue as AppType

					for (const child of app.node.children) {
						try {
							if (Stack.isStack(child)) {
								const stack = child as StackType

								stacks[stack.node.id] = {
									template: (
										Template.fromStack(app.node.children[0]) as TemplateType
									).toJSON(),
									metadata: {
										env: stack.environment,
										stackName: stack.stackName
									}
								}
							}
						} catch (err) {
							errors.push(`${err}`)
						}
					}
				} catch (err) {
					errors.push(`${err}`)
				}
			}
		}
	} catch (err) {
		errors.push(`${err}`)
	}

	if (Object.keys(stacks).length === 0 && errors.length === 0) {
		errors.push(
			`No CDK stacks found in "${entrypoint}". Please make sure you export the \`app\` variable.`,
			'For example:\n\n\t\texport const app = new cdk.App()\n\n'
		)
	}

	sendResponse({
		stacks,
		errors: errors.map((err) =>
			// In order to make sure all error messages from CDK are relative to CWD and not tmpDir
			err.replaceAll(new RegExp(`(\/private)?${tmpDir}\/?`, 'g'), '')
		)
	})
}

process.on('message', (message) => {
	const data: CdkForkedInput = JSON.parse(message as string)
	forked(data)
})
