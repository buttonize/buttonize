import { applyWSSHandler } from '@trpc/server/adapters/ws'
import EventEmitter from 'events'
import getPort from 'get-port'
import { WebSocketServer } from 'ws'

import { AppWatcherEmitter } from '../lib/appWatcher.js'
import { CdkWatcherEmitter } from '../lib/cdkWatcher.js'
import { Apps } from '../lib/types.js'
import { Emitter } from '../types.js'
import { wsRouter } from './_ws.js'

export type ApiEvents = {
	connectionChange: {
		connectionsCount: number
	}
}

export const createServer = async ({
	appEmitter,
	cdkEmitter,
	rebuildApps
}: {
	appEmitter: AppWatcherEmitter
	cdkEmitter: CdkWatcherEmitter
	rebuildApps: () => void
}): Promise<{
	apiEmitter: Emitter<ApiEvents>
	wsServer: WebSocketServer
}> => {
	const apiEmitter = new EventEmitter() as Emitter<ApiEvents>

	let apps: Apps | undefined = undefined

	const getApps = (): Apps | undefined => {
		return apps
	}

	appEmitter.on('event', (event) => {
		switch (event.name) {
			case 'done':
				apps = event.apps
				return
		}
	})

	const wss = new WebSocketServer({
		port: await getPort({ port: [3005, 3006, 3008, 3009, 3010, 3011, 3012] })
	})
	applyWSSHandler({
		wss,
		router: wsRouter,
		createContext() {
			return {
				getApps,
				rebuildApps,
				cdkEmitter,
				appEmitter
			}
		}
	})

	wss.on('connection', (socker) => {
		apiEmitter.emit('connectionChange', {
			connectionsCount: wss.clients.size
		})

		socker.on('close', () => {
			apiEmitter.emit('connectionChange', {
				connectionsCount: wss.clients.size
			})
		})
	})

	return {
		apiEmitter,
		wsServer: wss
	}
}
