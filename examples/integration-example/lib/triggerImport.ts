import { Handler } from 'aws-lambda'

export const handler: Handler = async (event) => {
	const lookback = event.lookback
	// here, we can take the lookback period the user specified and use it to select
	// the data we'd like to import. Then, we can perform the migration
	// and notify the user once it's complete
	console.log(`Lookback period is ${lookback}`)

	// you can imagine making REST API calls, database queries, or interaction with other
	// AWS services in order to accomplish this

	// pseudo-code to demonstrate the flow
	// data = axios.get("service.a.com?days_ago=lookback")
	// serializedData = serializeDataFromServiceAForServiceB(data)
	// axios.post("service.b.com", serializedData)
	// emailClient.sendEmail("Import from ServiceA to ServiceB complete")

	return {
		success: true
	}
}
