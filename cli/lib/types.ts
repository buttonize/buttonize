export type Apps = {
	[stackId: string]: {
		[appId: string]: {
			executionRoleArn?: string
			executionRoleExternalId?: string
			name: string
			description: string
			tags: string[]
			stage: string
			pages: {
				pageIdName: string
				isFirstPage: boolean
				body: SerializedComponent[]
				initialState?: InitialState
				title?: string
				subtitle?: string
			}[]
		}
	}
}

export type CdkForkedStack = {
	template: Apps
	metadata: {
		env: string
		stackName: string
	}
}

export type CdkForkedStacks = {
	[key: string]: CdkForkedStack
}

export type CdkForkedErrors = string[]

export type CdkForkedInput = {
	tmpDir: string
}

export type CdkForkedOutput = {
	stacks: CdkForkedStacks
	errors: CdkForkedErrors
}

export interface SerializedComponent {
	props?: any
	typeName: string
}

export interface InitialState {
	[id: string]: object
}
