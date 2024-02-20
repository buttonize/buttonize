import * as https from 'https'

export const httpsRequest = (
	options: https.RequestOptions,
	requestBody: string,
	logName: string
): Promise<string> =>
	new Promise<string>((resolve, reject) => {
		const req = https.request(options, (res) => {
			console.log(
				`[${logName}]: Received status code "${res.statusCode}" in HTTPS request.`
			)

			const responseChunks: Buffer[] = []
			res.on('data', (d) => {
				responseChunks.push(d)
			})

			res.on('end', () => {
				try {
					console.log(`[${logName}]: Response body from HTTPS request:`)

					const responseData = Buffer.concat(responseChunks).toString()

					console.log(responseData)

					resolve(responseData)
				} catch (e) {
					reject(e)
				}
			})
		})

		req.on('error', (e) => {
			console.error(`[${logName}]: Error occured during HTTPS request:`)
			console.error(e)
			reject(e)
		})

		console.log(`[${logName}]: Sending HTTPS request...`)
		req.write(requestBody)
		req.end()
	})
