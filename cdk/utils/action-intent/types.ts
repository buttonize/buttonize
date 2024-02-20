import { AwsActionIntent, AwsActionIntentProps } from './aws-intent.js'
import {
	ButtonizeActionIntent,
	ButtonizeActionIntentProps
} from './buttonize-intent.js'

export type BaseActionIntentProps = {
	id?: string
}

export type ActionIntentProps =
	| ButtonizeActionIntentProps
	| AwsActionIntentProps

export type ActionIntent = ButtonizeActionIntent | AwsActionIntent

export const isActionIntent = (arg: unknown): arg is ActionIntent =>
	arg instanceof ButtonizeActionIntent || arg instanceof AwsActionIntent
