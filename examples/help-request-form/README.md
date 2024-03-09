# Welcome to Buttonize!

This is an example project for CDK development with Buttonize.

Here, we have a standard CDK project, but with Buttonize constructs utilized within our stack in order to build
a help request app. This is something that is often needed within an organization to enable employees to request
help from an IT department or support team.

After the user fills in the data and submits the form, a lambda is triggered. The lambda in this example is just
a placeholder, but you could imagine sending an email or hitting your ticketing system's REST API from within the
lambda.

## Useful commands

* `cdk deploy --profile=<your AWS profile>`  deploy this stack to your default AWS account/region
* `npx buttonize dev ./bin/help-request-form.ts --profile=<your AWS profile>` start live local development with code hot reloading 
