import * as cdk from 'aws-cdk-lib'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Action, Buttonize, ButtonizeApp, Display, Input } from 'buttonize/cdk'
import { Construct } from 'constructs'
import * as path from 'path'

export class IntegrationExampleStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props)

		Buttonize.init(this, {
			apiKey: `${process.env.BTNZ_API_KEY}`
		})

		new ButtonizeApp(this, 'IntegrationExampleApp')
			.page('IntegrationExamplePage', {
				body: [
					Display.heading('Reimport'),
					Display.text(
						"After you've updated data in SERVICE A, this will trigger the nightly import script that syncs the data to SERVICE B"
					),
					Display.text(
						'Selecting "1 day" will only import records created/updated since yesterday from SERVICE A to SERVICE B'
					),
					Display.text(
						'Please note, the further back in time you look, the longer the import will take.'
					),
					Input.select({
						id: 'lookback',
						label: 'How far back should the import go?',
						options: [
							{ label: '1 day', value: '1' },
							{ label: '1 week', value: '7' },
							{ label: '1 month', value: '31' },
							{ label: '1 year', value: '365' }
						],
						spacingTop: 'lg'
					}),
					Input.button({
						label: 'Trigger',
						onClick: Action.aws.lambda.invoke(
							new NodejsFunction(this, 'TriggerImportLambda', {
								handler: 'handler',
								entry: path.join(__dirname, `triggerImport.ts`),
								runtime: lambda.Runtime.NODEJS_20_X
							}),
							{
								Payload: {
									lookback: '{{lookback.value}}'
								}
							}
						),
						onClickFinished: Action.buttonize.app.changePage('FinishPage')
					})
				]
			})
			.page('FinishPage', {
				body: [
					Display.heading('The import has started.'),
					Display.text('You will receive an email once it is done.'),
					Display.text(
						'Please note that it can take up to an hour for the process to complete.'
					)
				]
			})
	}
}
