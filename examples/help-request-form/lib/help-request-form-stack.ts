import * as cdk from 'aws-cdk-lib'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Action, Buttonize, ButtonizeApp, Display, Input } from 'buttonize/cdk'
import { Construct } from 'constructs'
import * as path from 'path'

export class HelpRequestFormStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props)

		Buttonize.init(this, {
			apiKey: `${process.env.BTNZ_API_KEY}`
		})

		new ButtonizeApp(this, 'HelpFormApp')
			.page('HelpFormPage', {
				body: [
					Display.heading('How can we help?'),
					Input.text({
						id: 'email',
						label: 'What is your corporate email?'
					}),
					Input.select({
						id: 'problem',
						label: 'What kind of problem are you facing?',
						options: [
							{ label: 'Hardware Issues', value: 'hardware' },
							{ label: 'Permissions issues', value: 'permissions' },
							{ label: 'Bug Report', value: 'bug' }
						]
					}),
					Input.text({
						id: 'desc',
						label: 'Please describe the issue in detail'
					}),
					Input.button({
						label: 'Preview',
						onClick: Action.buttonize.app.changePage('PreviewPage')
					})
				]
			})
			.page('PreviewPage', {
				body: [
					Display.heading('Is the following info correct?'),
					Display.text('Email: {{email}}'),
					Display.text('Problem: {{problem.value}}'),
					Display.text('Description: {{desc}}'),
					Display.grid([
						{
							size: 1,
							body: [
								Input.button({
									label: 'Go Back',
									onClick: Action.buttonize.app.changePage('HelpFormPage'),
									kind: 'secondary'
								})
							]
						},
						{
							size: 1,
							body: [
								Input.button({
									label: 'Submit',
									onClick: Action.aws.lambda.invoke(
										new NodejsFunction(this, 'HelpFormSubmitLambda', {
											handler: 'handler',
											entry: path.join(__dirname, `lambdaHandler.ts`),
											runtime: lambda.Runtime.NODEJS_20_X
										}),
										{
											Payload: {
												email: '{{email}}',
												problem: '{{problem.value}}',
												desc: '{{desc}}'
											}
										}
									),
									onClickFinished:
										Action.buttonize.app.changePage('FinishPage'),
									kind: 'primary'
								})
							]
						}
					])
				]
			})
			.page('FinishPage', {
				body: [
					Display.heading('Thanks for reaching out!'),
					Display.text(
						'One of our support team members will contact you shortly'
					)
				]
			})
	}
}
