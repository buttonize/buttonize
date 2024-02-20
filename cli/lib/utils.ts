export const prepareTmpFolder = async (): Promise<string> => {
	const fs = await import('fs/promises')
	const os = await import('os')
	const path = await import('path')

	return fs.mkdtemp(path.join(os.tmpdir(), 'btnz-'))
}

export const linkNodeModulesToTmpDir = async (
	tmpDir: string
): Promise<void> => {
	const path = await import('path')
	const symlinkOrCopy = (await import('symlink-or-copy')).sync

	symlinkOrCopy(
		path.join(process.cwd(), 'node_modules'),
		path.join(tmpDir, 'node_modules')
	)
}

export const isVerbose = (): boolean => {
	return process.env.BTNZ_VERBOSE === 'true' || process.env.BTNZ_VERBOSE === '1'
}
