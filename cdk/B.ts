import {
	LogicalOperator,
	MathOperator,
	RuntimeIfExpression,
	TypeOrRuntimeIfExpression
} from './utils/runtime-if-expression.js'

/**
 * Special `B` symbol for defining if-then-else statements in Buttonize apps.
 *
 * Learn more in the docs: {@link https://docs.buttonize.io/core-concepts/if-statements/}
 *
 * @example
 * ```ts
 * Input.button({
 *   label: B.if(
 *     B.eq('{{operation.value}}', 'create'),
 *     'Create',
 *      B.if(
 *        B.eq('{{operation.value}}', 'delete'),
 *        'Delete',
 *        'Select...'
 *       )
 *     ),
 *   intent: B.if(
 *     B.eq('{{operation.value}}', 'create'),
 *     'positive',
 *     B.if(
 *       B.eq('{{operation.value}}', 'delete'),
 *       'negative',
 *       'default'
 *     )
 *   )
 *   onClick: Action.buttonize.app.changePage('MyButtonizePage'),
 * })
 * ```
 */
export abstract class B {
	/**
	 * `if` statement.
	 *
	 * *Please note: Currently, conditions can only be used for a component’s
	 * or action’s property values. You can not use B.if directly in the
	 * body prop of a page or the grid component.*
	 *
	 * Learn more in the docs: {@link https://docs.buttonize.io/core-concepts/if-statements/}
	 *
	 * @example
	 * ```ts
	 * Input.button({
	 *   label: B.if(
	 *     B.eq('{{operation.value}}', 'create'),
	 *     'Create',
	 *      B.if(
	 *        B.eq('{{operation.value}}', 'delete'),
	 *        'Delete',
	 *        'Select...'
	 *       )
	 *     ),
	 *   intent: B.if(
	 *     B.eq('{{operation.value}}', 'create'),
	 *     'positive',
	 *     B.if(
	 *       B.eq('{{operation.value}}', 'delete'),
	 *       'negative',
	 *       'default'
	 *     )
	 *   )
	 *   onClick: Action.buttonize.app.changePage('MyButtonizePage'),
	 * })
	 * ```
	 *
	 * @param statement For example `B.eq('{{operation.value}}', 'delete')`
	 * @param positive Positive result in case `statement` is evaluated as truthy.
	 * @param negative Negative result in case `statement` is evaluated as falsy.
	 */
	static if<Result = string>(
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
	}

	/**
	 * Equality operator `==`
	 *
	 * @param left Left operand.
	 * @param right Right operand.
	 * @example
	 *
	 * ```ts
	 * B.if(
	 *   B.eq('{{variable}}', 'B'),
	 *   'variable equals B',
	 *   'variable does not equal B'
	 * )
	 * ```
	 *
	 * Equivalent of this expression in TypeScript:
	 *
	 * ```ts
	 * if (variable == 'B') {
	 *   return 'variable equals B'
	 * } else {
	 *   return 'variable does not equal B'
	 * }
	 * ```
	 */
	static eq(left: string, right: string): MathOperator {
		return {
			eq: [left, right]
		}
	}

	/**
	 * Greater than operator `>`
	 *
	 * @param left Left operand.
	 * @param right Right operand.
	 * @example
	 *
	 * ```ts
	 * B.if(
	 *   B.gt('{{variable}}', '3'),
	 *   'variable is greater than 3',
	 *   'variable is lower or equal than 3'
	 * )
	 * ```
	 *
	 * Equivalent of this expression in TypeScript:
	 *
	 * ```ts
	 * if (variable > 3) {
	 *   return 'variable is greater than 3'
	 * } else {
	 *   return 'variable is lower or equal than 3'
	 * }
	 * ```
	 */
	static gt(left: string, right: string): MathOperator {
		return {
			gt: [left, right]
		}
	}

	/**
	 * Lower than operator `<`
	 *
	 * @param left Left operand.
	 * @param right Right operand.
	 * @example
	 *
	 * ```ts
	 * B.if(
	 *   B.lt('{{variable}}', '3'),
	 *   'variable is lower than 3',
	 *   'variable is greater or equal than 3'
	 * )
	 * ```
	 *
	 * Equivalent of this expression in TypeScript:
	 *
	 * ```ts
	 * if (variable < 3) {
	 *   return 'variable is lower than 3'
	 * } else {
	 *   return 'variable is greater or equal than 3'
	 * }
	 * ```
	 */
	static lt(left: string, right: string): MathOperator {
		return {
			lt: [left, right]
		}
	}

	/**
	 * Greater than or equal to `>=`
	 *
	 * @param left Left operand.
	 * @param right Right operand.
	 * @example
	 *
	 * ```ts
	 * B.if(
	 *   B.gte('{{variable}}', '3'),
	 *   'variable is greater than or equal to 3',
	 *   'variable is less than 3'
	 * )
	 * ```
	 *
	 * Equivalent of this expression in TypeScript:
	 *
	 * ```ts
	 * if (variable >= 3) {
	 *   return 'variable is greater than or equal to 3'
	 * } else {
	 *   return 'variable is less than 3'
	 * }
	 * ```
	 */
	static gte(left: string, right: string): MathOperator {
		return {
			gte: [left, right]
		}
	}

	/**
	 * Less than or equal to `<=`
	 *
	 * @param left Left operand.
	 * @param right Right operand.
	 * @example
	 *
	 * ```ts
	 * B.if(
	 *   B.lte('{{variable}}', '3'),
	 *   'variable is less than or equal to 3',
	 *   'variable is greater than 3'
	 * )
	 * ```
	 *
	 * Equivalent of this expression in TypeScript:
	 *
	 * ```ts
	 * if (variable <= 3) {
	 *   return 'variable is less than or equal to 3'
	 * } else {
	 *   return 'variable is greater than 3'
	 * }
	 * ```
	 */
	static lte(left: string, right: string): MathOperator {
		return {
			lte: [left, right]
		}
	}

	/**
	 * Logical AND operator `&&`
	 *
	 * @param operands Arbitrary number of operands.
	 * @example
	 *
	 * ```ts
	 * B.if(
	 *   B.and(B.gt('{{variable}}', '3'), B.lt('{{variable}}', '5')),
	 *   'variable is equal to 4', // In case we just use integers
	 *   'variable is number not equal to 4'
	 * )
	 * ```
	 *
	 * Equivalent of this expression in TypeScript:
	 *
	 * ```ts
	 * if (variable > 3 && variable < 5) {
	 *   return 'variable is equal to 4' // In case we just use integers
	 * } else {
	 *   return 'variable is a number not equal to 4'
	 * }
	 * ```
	 */
	static and(...operands: (LogicalOperator | MathOperator)[]): LogicalOperator {
		return {
			and: operands
		}
	}

	/**
	 * Logical OR operator `||`
	 *
	 * @param operands Arbitrary number of operands.
	 * @example
	 *
	 * ```ts
	 * B.if(
	 *   B.or(B.eq('{{variable}}', 'Joe'), B.eq('{{variable}}', 'Alex')),
	 *   'name in the variable is either Joe or Alex',
	 *   'name in the variable is not Joe or Alex'
	 * )
	 * ```
	 *
	 * Equivalent of this expression in TypeScript:
	 *
	 * ```ts
	 * if (variable === 'Joe' || variable === 'Alex') {
	 *   return 'name in the variable is either Joe or Alex'
	 * } else {
	 *   return 'name in the variable is not Joe or Alex'
	 * }
	 * ```
	 */
	static or(...operands: (LogicalOperator | MathOperator)[]): LogicalOperator {
		return {
			or: operands
		}
	}

	/**
	 * Logical NOT operator `!`
	 *
	 * @param operand
	 * @example
	 *
	 * ```ts
	 * B.if(
	 *   B.not(
	 *     B.eq('{{variable}}', 'Joe')
	 *   ),
	 *   'name in the variable not Joe',
	 *   'name in the variable is Joe'
	 * )
	 * ```
	 *
	 * Equivalent of this expression in TypeScript:
	 *
	 * ```ts
	 * if (!(variable === 'Joe')) {
	 *   return 'name in the variable not Joe'
	 * } else {
	 *   return 'name in the variable is Joe'
	 * }
	 * ```
	 */
	static not(operand: LogicalOperator | MathOperator): LogicalOperator {
		return {
			not: operand
		}
	}
}
