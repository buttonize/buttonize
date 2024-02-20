import { PolicyStatement } from 'aws-cdk-lib/aws-iam'
import traverse from 'traverse'

export interface ISerializedComponent {
	props?: object
	typeName: string
}

export interface IComponent {
	serializeComponent(): ISerializedComponent
	resolveIamStatements(): PolicyStatement[]
}

export interface ComponentProps {
	typeName: string
	props?: Record<string, unknown>
	iamStatements?: PolicyStatement[]
}

export class Component implements IComponent {
	protected typeName: string
	protected props: Record<string, unknown>
	protected iamStatements: PolicyStatement[]

	constructor({ typeName, props, iamStatements }: ComponentProps) {
		this.typeName = typeName
		this.props = props ?? {}
		this.iamStatements = iamStatements ?? []
	}

	serializeComponent(): ISerializedComponent {
		let resp: ISerializedComponent = {
			typeName: this.typeName
		}

		if (Object.keys(this.props).length > 0) {
			// Check if in props are any component definitions e.g. "display.grid"
			resp.props = traverse(this.props).map(function (value) {
				if (value instanceof Component) {
					this.update(value.serializeComponent())
				}
			})
		}

		return resp
	}

	resolveIamStatements(): PolicyStatement[] {
		// Check if in props are any component definitions e.g. "display.grid"
		return traverse(this.props).reduce(
			function (acc: PolicyStatement[], value) {
				if (value instanceof Component) {
					acc.push(...value.resolveIamStatements())
				}
				return acc
			},
			[...this.iamStatements]
		)
	}
}
