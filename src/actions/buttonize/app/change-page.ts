import { ButtonizeActionProps } from '../../../types.js'
import { ButtonizeActionIntent } from '../../../utils/action-intent/index.js'
import { TypeOrRuntimeIfExpression } from '../../../utils/runtime-if-expression.js'

export const changePage = (
	pageId: TypeOrRuntimeIfExpression<string>,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_input: {} = {},
	{ id }: ButtonizeActionProps = {}
): ButtonizeActionIntent =>
	new ButtonizeActionIntent({
		id,
		type: 'buttonize',
		service: 'app',
		command: 'changePage',
		input: {
			newPageId: pageId
		}
	})
