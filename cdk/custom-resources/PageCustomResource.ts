import { CfnResource, Reference } from 'aws-cdk-lib'
import { Construct } from 'constructs'

import { ActionIntentProps } from '../utils/action-intent/index.js'
import { ISerializedComponent } from '../utils/Component.js'
import { CustomResourceProvider } from './CustomResourceProvider.js'

export interface PageCustomResourceProps {
	pageIdName: string
	appId: string | Reference
	body: ISerializedComponent[]
	apiKey: string
	isFirstPage: boolean
	initialState?: {
		[id: string]: ActionIntentProps
	}
	title?: string
	subtitle?: string
}

export class PageCustomResource extends CfnResource {
	constructor(scope: Construct, id: string, props: PageCustomResourceProps) {
		const provider = CustomResourceProvider.getOrCreateProvider(scope)

		super(scope, id, {
			type: 'Custom::ButtonizeAppPage',
			properties: {
				ServiceToken: provider.serviceToken,
				ApiKey: props.apiKey,
				PageIdName: props.pageIdName,
				AppId: props.appId,
				Body: JSON.stringify(props.body),
				IsFirstPage: props.isFirstPage ? 'true' : 'false',
				InitialState:
					typeof props.initialState !== 'undefined'
						? JSON.stringify(props.initialState)
						: undefined,
				Title: props.title,
				Subtitle: props.subtitle
			}
		})
	}
}
