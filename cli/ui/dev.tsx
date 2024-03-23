import { Box, Newline, Text, useApp, useInput } from 'ink'
import Spinner from 'ink-spinner'
import symbols from 'log-symbols'
import { AddressInfo } from 'net'
import React, { useEffect, useState } from 'react'
import { WebSocketServer } from 'ws'

import { ApiEvents } from '../api/server.js'
import { AppWatcherEmitter, AppWatcherEvent } from '../lib/appWatcher.js'
import { CdkWatcherEmitter, CdkWatcherEvent } from '../lib/cdkWatcher.js'
import { Emitter } from '../types.js'

type DevProps = {
	cdkEmitter: CdkWatcherEmitter
	appEmitter: AppWatcherEmitter
	apiEmitter: Emitter<ApiEvents>
	wsServer: WebSocketServer
	rebuild: () => void
}

type ProgramPhases =
	| 'init'
	| 'compilingTs'
	| 'buildingCdkTree'
	| 'buildingApp'
	| 'built'

const phasesTranslations: Record<ProgramPhases, string> = {
	buildingCdkTree: 'Executing CDK code...',
	built: 'App built',
	compilingTs: 'Compiling TypeScript source files...',
	buildingApp: 'Extracting Apps from CDK and fetching resources from AWS...',
	init: 'Initializing...'
}

export const Dev: React.FC<DevProps> = ({
	apiEmitter,
	cdkEmitter,
	appEmitter,
	wsServer,
	rebuild
}) => {
	const [currentPhase, setCurrentPhase] = useState<ProgramPhases>('init')

	const [errors, setErrors] = useState<string[] | undefined>()

	const [apiConnections, setApiConnections] = useState<number>(0)

	const [needsDeploy, setNeedsDeploy] = useState<boolean>(false)

	const { exit } = useApp()

	useInput((input, key) => {
		if (key.escape || input === 'q') {
			exit()
		}
		if (key.return) {
			rebuild()
		}
	})

	// cdkEmitter
	useEffect(() => {
		const onEvent = (event: CdkWatcherEvent): void => {
			switch (event.name) {
				case 'beforeRecompilation':
					setCurrentPhase('compilingTs')
					setErrors(undefined)
					return
				case 'recompiled':
					setCurrentPhase('buildingCdkTree')
					return
				case 'error':
					setErrors((currentErrors) => {
						let errs = typeof currentErrors === 'undefined' ? [] : currentErrors

						// Remove duplicates by using Set
						return [...new Set<string>([...errs, event.message])]
					})
			}
		}

		cdkEmitter.on('event', onEvent)
		return () => {
			cdkEmitter.off('event', onEvent)
		}
	}, [])

	// appEmitter
	useEffect(() => {
		const onEvent = (event: AppWatcherEvent): void => {
			switch (event.name) {
				case 'done':
					setCurrentPhase('built')

					const allStacksDeployed = Object.entries(event.apps).reduce(
						(acc, [, apps]) =>
							Object.entries(apps).reduce(
								(acc2, [, { isDeployed }]) => acc2 && isDeployed,
								acc
							),
						true
					)

					setNeedsDeploy(!allStacksDeployed)

					if (event.errors.length > 0) {
						setErrors((currentErrors) => {
							let errs =
								typeof currentErrors === 'undefined' ? [] : currentErrors

							// Remove duplicates by using Set
							return [...new Set<string>([...errs, ...event.errors])]
						})
					}
					return
				case 'rebuilding':
					setCurrentPhase('buildingApp')
			}
		}

		appEmitter.on('event', onEvent)
		return () => {
			appEmitter.off('event', onEvent)
		}
	}, [])

	// apiEmitter
	useEffect(() => {
		const connectionChange = (event: ApiEvents['connectionChange']): void => {
			setApiConnections(event.connectionsCount)
		}

		apiEmitter.on('connectionChange', connectionChange)
		return () => {
			apiEmitter.off('connectionChange', connectionChange)
		}
	}, [])

	const port = (wsServer.address() as AddressInfo).port

	const debugLink = `https://app.buttonize.io/live${
		port !== 3005 ? `?port=${encodeURIComponent(port)}` : ''
	}`

	return (
		<Box flexWrap="wrap">
			{needsDeploy ? (
				<Box width="100%">
					<Box
						borderStyle="doubleSingle"
						borderColor="yellow"
						flexWrap="wrap"
						paddingTop={1}
						paddingRight={2}
						paddingBottom={1}
						paddingLeft={2}
					>
						<Box width="100%">
							<Text>
								{symbols.warning} One of your CDK stacks is not deployed. Some
								features are limited.
								<Newline />
								<Newline />
								<Text>Run:</Text>
								<Newline />
								<Newline />
								<Text>
									$ npx cdk deploy
									{process.env.AWS_PROFILE
										? ` --profile=${process.env.AWS_PROFILE}`
										: ''}
								</Text>
								<Newline />
								<Newline />
								<Text>
									After you deploy the stack press &quot;Enter&quot; to rebuild.
								</Text>
							</Text>
						</Box>
					</Box>
				</Box>
			) : null}
			<Box width="100%" paddingTop={1}>
				{typeof errors !== 'undefined' && errors.length > 0 ? (
					<Text>
						<Text>{symbols.error} Error occurred</Text>
						<Newline />
						<Newline />
						<Text dimColor>
							{errors?.map((error, i) => (
								<Text key={i}>
									{error}
									<Newline />
								</Text>
							)) ?? null}
						</Text>
					</Text>
				) : (
					<Box width="100%">
						{currentPhase === 'built' ? (
							<Text>{symbols.success}</Text>
						) : (
							<Spinner type="dots" />
						)}
						<Text>{` ${phasesTranslations[currentPhase]}`}</Text>
					</Box>
				)}
			</Box>

			<Box width="100%" paddingTop={1}>
				<Text>
					{apiConnections === 0 ? symbols.info : symbols.success} Debug your app
					live here: <Text color={'blueBright'}>{debugLink}</Text>
				</Text>
			</Box>
			<Box paddingTop={1} width="100%">
				<Text dimColor>
					<Text>Press &quot;q&quot; to quit</Text>
					<Newline />
					<Text>Press &quot;Enter&quot; to rebuild</Text>
				</Text>
			</Box>
		</Box>
	)
}
