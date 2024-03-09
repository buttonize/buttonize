import { Handler } from 'aws-lambda'

export const handler: Handler = async (event) => {
	// Here, you can make an API call to handle the rejection
	const userId = event.userId
	const reason = event.reason
	const notes = event.notes

	console.log(
		`User ${userId} document rejected due to ${reason}. Notes: ${notes}`
	)

	return {
		success: true
	}
}
