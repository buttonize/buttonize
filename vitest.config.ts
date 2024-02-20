import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		watch: false,
		include: ['test/**/*.test.ts'],
		alias: {
			'@/cdk/': new URL('./cdk/', import.meta.url).pathname,
			'@/cli/': new URL('./cli/', import.meta.url).pathname
		},
		coverage: {
			enabled: true,
			all: true,
			include: ['cdk/**/*.ts', 'cli/**/*.{ts,tsx}'],
			// 100: true,
			provider: 'v8',
			exclude: ['test']
		}
	}
})
