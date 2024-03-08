import { Handler } from 'aws-lambda'

export const handler: Handler = async (event) => {
	// Here, you can load the user info from your database
	const userId = event.userId
	console.log(userId)
	// for this example, we just return hardcoded data
	return {
		image: 'https://teara.govt.nz/files/d-23817-pc_2.jpg',
		rawData:
			'{\n  "metadata": {\n    "reason": "Document expiration"\n  },\n  "firstDeposit": false,\n  "country": "NZ",\n  "risk_level": 2\n}'
	}
}
