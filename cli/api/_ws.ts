import { observable } from '@trpc/server/observable'

import { AppWatcherEvent } from '../lib/appWatcher.js'
import { CdkWatcherEvent } from '../lib/cdkWatcher.js'
import { publicProcedure, router } from './trpc.js'
export type { Apps, SerializedComponent } from '../lib/types.js'

export const wsRouter = router({
	rebuild: publicProcedure.mutation(({ ctx }) => {
		ctx.rebuildApps()
	}),
	apps: publicProcedure.query(({ ctx }) => {
		return ctx.getApps()
	}),
	onCdkWatcherEvent: publicProcedure.subscription(({ ctx }) => {
		return observable<CdkWatcherEvent>((emit) => {
			const onEvent = (event: CdkWatcherEvent): void => {
				emit.next(event)
			}

			ctx.cdkEmitter.on('event', onEvent)

			// unsubscribe function when client disconnects or stops subscribing
			return (): void => {
				ctx.cdkEmitter.off('event', onEvent)
			}
		})
	}),
	onAppWatcherEvent: publicProcedure.subscription(({ ctx }) => {
		return observable<AppWatcherEvent>((emit) => {
			const onEvent = (event: AppWatcherEvent): void => {
				emit.next(event)
			}

			ctx.appEmitter.on('event', onEvent)

			// unsubscribe function when client disconnects or stops subscribing
			return (): void => {
				ctx.appEmitter.off('event', onEvent)
			}
		})
	})
})

// Export only the type of a router!
// This prevents us from importing server code on the client.
export type WsRouter = typeof wsRouter
