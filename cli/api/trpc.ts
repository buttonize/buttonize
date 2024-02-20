import { initTRPC } from '@trpc/server'

import { AppWatcherEmitter } from '../lib/appWatcher.js'
import { CdkWatcherEmitter } from '../lib/cdkWatcher.js'
import { Apps } from '../lib/types.js'

// You can use any variable name you like.
// We use t to keep things simple.
const t = initTRPC
	.context<{
		getApps: () => Apps | undefined
		rebuildApps: () => void
		appEmitter: AppWatcherEmitter
		cdkEmitter: CdkWatcherEmitter
	}>()
	.create()

export const router = t.router
export const middleware = t.middleware
export const publicProcedure = t.procedure
