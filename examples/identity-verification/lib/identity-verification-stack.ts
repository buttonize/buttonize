import * as cdk from 'aws-cdk-lib'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Action, Buttonize, ButtonizeApp, Display, Input } from 'buttonize/cdk'
import { Construct } from 'constructs'
import * as path from 'path'

export class IdentityVerificationStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props)

		Buttonize.init(this, {
			apiKey: `${process.env.BTNZ_API_KEY}`
		})

		new ButtonizeApp(this, 'IdentityVerificationApp')
			.page('LoadUserPage', {
				body: [
					Display.grid([
						{
							size: 1,
							body: [
								Input.text({
									id: 'userId',
									label: 'User Id'
								})
							]
						},
						{
							size: 1,
							body: [
								Input.button({
									label: 'Load User',
									onClick: Action.aws.lambda.invoke(
										new NodejsFunction(
											this,
											'IdentityVerificationLoadUserLambda',
											{
												handler: 'handler',
												entry: path.join(__dirname, `loadUserHandler.ts`),
												runtime: lambda.Runtime.NODEJS_20_X
											}
										),
										{
											Payload: {
												userId: '{{userId}}'
											}
										},
										{
											id: 'loadUserPayload'
										}
									),
									onClickFinished: Action.buttonize.app.changePage(
										'DocumentVerificationPage'
									),
									kind: 'secondary',
									intent: 'default'
								})
							]
						}
					])
				]
			})
			.page('DocumentVerificationPage', {
				body: [
					Display.grid([
						{
							size: 2,
							body: [
								Display.image('{{loadUserPayload.image}}'),
								Display.code('{{loadUserPayload.rawData}}', {
									language: 'json'
								})
							]
						},
						{
							size: 2,
							body: [
								Input.button({
									label: 'Approve document',
									onClick: Action.aws.lambda.invoke(
										new NodejsFunction(this, 'ApproveDocumentLambda', {
											handler: 'handler',
											entry: path.join(__dirname, `approveDocument.ts`),
											runtime: lambda.Runtime.NODEJS_20_X
										}),
										{
											Payload: {
												userId: '{{userId}}'
											}
										}
									),
									onClickFinished:
										Action.buttonize.app.changePage('ConfirmationPage'),
									kind: 'secondary',
									intent: 'positive'
								}),
								Display.text('Not sure? Check guidlines', {
									spacingBottom: 'lg'
								}),
								Input.select({
									id: 'reason',
									label: 'Select reason',
									options: [
										{ label: 'Document is too blurry', value: 'too_blurry' }
									],
									spacingBottom: 'md',
									spacingTop: 'lg'
								}),
								Input.text({
									id: 'notes',
									label: 'Notes (optional)'
								}),
								Input.button({
									label: 'Reject document',
									onClick: Action.aws.lambda.invoke(
										new NodejsFunction(this, 'RejectDocumentLambda', {
											handler: 'handler',
											entry: path.join(__dirname, `rejectDocument.ts`),
											runtime: lambda.Runtime.NODEJS_20_X
										}),
										{
											Payload: {
												userId: '{{userId}}',
												reason: '{{reason.value}}',
												notes: '{{notes}}'
											}
										}
									),
									onClickFinished:
										Action.buttonize.app.changePage('ConfirmationPage'),
									kind: 'secondary',
									intent: 'negative'
								})
							]
						}
					])
				]
			})
			.page('ConfirmationPage', {
				body: [Display.text('User {{userId}} updated')]
			})
	}
}
