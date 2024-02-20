import {
	LogicalOperator,
	MathOperator,
	RuntimeIfExpression,
	TypeOrRuntimeIfExpression
} from './utils/runtime-if-expression.js'

export const B = {
	if<Result = string>(
		statement: MathOperator | LogicalOperator,
		positive: TypeOrRuntimeIfExpression<Result>,
		negative: TypeOrRuntimeIfExpression<Result>
	): RuntimeIfExpression<TypeOrRuntimeIfExpression<Result>> {
		return {
			runtimeExpression: {
				typeName: 'if',
				statement,
				positive,
				negative
			}
		}
	},
	// Mathematical
	eq(left: string, right: string): MathOperator {
		return {
			eq: [left, right]
		}
	},
	gt(left: string, right: string): MathOperator {
		return {
			gt: [left, right]
		}
	},
	lt(left: string, right: string): MathOperator {
		return {
			lt: [left, right]
		}
	},
	gte(left: string, right: string): MathOperator {
		return {
			gte: [left, right]
		}
	},
	lte(left: string, right: string): MathOperator {
		return {
			lte: [left, right]
		}
	},
	// Logical
	and(...operators: (LogicalOperator | MathOperator)[]): LogicalOperator {
		return {
			and: operators
		}
	},
	or(...operators: (LogicalOperator | MathOperator)[]): LogicalOperator {
		return {
			or: operators
		}
	},
	not(operator: LogicalOperator | MathOperator): LogicalOperator {
		return {
			not: operator
		}
	}
} as const
