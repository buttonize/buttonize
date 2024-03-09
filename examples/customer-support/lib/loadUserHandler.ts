import { Handler } from 'aws-lambda'

export const handler: Handler = async (event) => {
	// Here, you can load the user info from your database
	const email = event.email
	// for this example, we just return hardcoded data
	return {
		success: true,
		data: {
			email,
			subscription: { label: 'PRO', value: 'pro' },
			registered: '15th May 2020',
			picture:
				'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?w=1060&t=st=1708887795~exp=1708888395~hmac=64f1a63fed0fad04d1d43eacf86c70427934558fcb1bbef3af60db9846e74700'
		}
	}
}
