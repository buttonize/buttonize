import { button } from './button.js'
import { chat } from './chat.js'
import { select } from './select.js'
import { text } from './text.js'
import { toggle } from './toggle.js'

export const Input = {
	button,
	chat,
	text,
	toggle,
	select
} as const

export { InputSelectOption } from './select.js'
