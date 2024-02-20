export type EventMap = Record<string, any>

export type EventKey<T extends EventMap> = string & keyof T
export type EventReceiver<T> = (params: T) => void

export interface Emitter<T extends EventMap> {
	on<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): Emitter<T>
	off<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): Emitter<T>
	emit<K extends EventKey<T>>(eventName: K, params: T[K]): boolean
}
