export type MathOperator =
	| {
			eq: [string, string]
	  }
	| {
			gt: [string, string]
	  }
	| {
			lt: [string, string]
	  }
	| {
			gte: [string, string]
	  }
	| {
			lte: [string, string]
	  }

export type LogicalOperator =
	| {
			and: (LogicalOperator | MathOperator)[]
	  }
	| {
			or: (LogicalOperator | MathOperator)[]
	  }
	| {
			not: LogicalOperator | MathOperator
	  }

export interface RuntimeIfExpression<Result> {
	runtimeExpression: {
		typeName: 'if'
		statement: MathOperator | LogicalOperator
		positive: Result
		negative: Result
	}
}

export type TypeOrRuntimeIfExpression<Value> =
	| Value
	| RuntimeIfExpression<TypeOrRuntimeIfExpression<Value>>

export const isRuntimeIfExpression = (
	arg: unknown
): arg is RuntimeIfExpression<unknown> =>
	typeof arg === 'object' &&
	arg !== null &&
	'runtimeExpression' in arg &&
	typeof arg.runtimeExpression === 'object' &&
	arg.runtimeExpression !== null &&
	'typeName' in arg.runtimeExpression &&
	arg.runtimeExpression.typeName === 'if'
