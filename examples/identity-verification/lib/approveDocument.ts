import { Handler } from 'aws-lambda'

export const handler: Handler = async (event) => {
	// Here, you can make an API call to handle the approval
	const userId = event.userId

	console.log(`User ${userId} document approved`)

	return {
		success: true
	}
}
