declare module 'cfn-resolver-lib' {
	export type NodeEvaluatorOptions = {
		RefResolvers?: { [logicalId: string]: string }
		'Fn::GetAttResolvers'?: {
			[logicalId: string]: { [attrName: string]: string }
		}
	}

	export default class NodeEvaluator {
		constructor(template: any, options: NodeEvaluatorOptions)

		evaluateNodes(): any
	}
}
