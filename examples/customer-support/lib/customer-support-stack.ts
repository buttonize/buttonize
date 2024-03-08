import * as cdk from 'aws-cdk-lib'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Action, Buttonize, ButtonizeApp, Display, Input } from 'buttonize/cdk'
import { Construct } from 'constructs'
import * as path from 'path'

export class CustomerSupportStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props)

		Buttonize.init(this, {
			apiKey: `${process.env.BTNZ_API_KEY}`
		})

		new ButtonizeApp(this, 'CustomerSupportApp')
			.page('LoadUserPage', {
				body: [
					Display.grid([
						{
							size: 1,
							body: [
								Input.text({
									id: 'email',
									label: 'User'
								})
							]
						},
						{
							size: 1,
							body: [
								Input.button({
									label: 'Load User',
									onClick: Action.aws.lambda.invoke(
										new NodejsFunction(this, 'CustomerSupperLoadUserLambda', {
											handler: 'handler',
											entry: path.join(__dirname, `loadUserHandler.ts`),
											runtime: lambda.Runtime.NODEJS_20_X
										}),
										{
											Payload: {
												email: '{{email}}'
											}
										},
										{
											id: 'loadUserPayload'
										}
									),
									onClickFinished:
										Action.buttonize.app.changePage('UserInfoPage'),
									kind: 'secondary',
									intent: 'default'
								})
							]
						}
					])
				]
			})
			.page('UserInfoPage', {
				body: [
					Display.section({
						label: 'Customer data',
						body: [
							Display.grid([
								{
									size: 1,
									body: [Display.image('{{loadUserPayload.data.picture}}')]
								},
								{
									size: 2,
									body: [
										Input.select({
											id: 'plan',
											label: 'Subscription plan',
											options: [
												{ label: 'PRO', value: 'pro' },
												{ label: 'Free', value: 'free' }
											],
											initialValue: '{{loadUserPayload.data.subscription}}',
											spacingBottom: 'md'
										}),
										Input.text({
											id: 'newEmail',
											label: 'Email change',
											initialValue: '{{email}}'
										}),
										Input.button({
											label: 'Confirm changes',
											onClick:
												Action.buttonize.app.changePage('EmailChangePage'),
											kind: 'primary',
											intent: 'default'
										})
									]
								}
							]),
							Display.text('Registered: {{loadUserPayload.data.registered}}')
						]
					}),
					Display.section({
						label: 'Advanced actions',
						body: [
							Display.grid([
								{
									size: 1,
									body: [
										Input.button({
											label: 'Delete user',
											onClick:
												Action.buttonize.app.changePage('UserDeletedPage'),
											kind: 'secondary',
											intent: 'negative'
										})
									]
								},
								{
									size: 1,
									body: [
										Input.button({
											label: 'Reset password',
											onClick:
												Action.buttonize.app.changePage('PasswordResetPage'),
											kind: 'secondary',
											intent: 'default'
										})
									]
								}
							])
						]
					})
				]
			})
			.page('EmailChangePage', {
				body: [Display.heading('Email changed from {{email}} to {{newEmail}}')]
			})
			.page('UserDeletedPage', {
				body: [Display.heading('{{email}} deleted')]
			})
			.page('PasswordResetPage', {
				body: [Display.heading("{{email}}'s password reset")]
			})
	}
}
