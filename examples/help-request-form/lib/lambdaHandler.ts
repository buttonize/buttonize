import { Handler } from 'aws-lambda'

export const handler: Handler = async (event) => {
	// here you can send the data collected from your buttonize app to a ticketing system,
	// or send an email to your support team
	console.log(event.email)
	console.log(event.problem)
	console.log(event.desc)

	return { success: true }
}
