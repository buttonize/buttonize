import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		watch: false,
		include: ['test/**/*.test.ts'],
		coverage: {
			enabled: true,
			all: true,
			include: ['src/**/*.ts'],
			// 100: true,
			provider: 'v8',
			exclude: ['test']
		}
	}
})
