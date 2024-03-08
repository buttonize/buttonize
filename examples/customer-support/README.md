# Welcome to Buttonize!

This is an example project for CDK development with Buttonize.

Here, we have a standard CDK project, but with Buttonize constructs utilized within our stack in order to build
an internal app to be used by a customer support team. With this app, you could imagine your support team could
update a user's email, delete a user, or change other data associated with the user.

This example provides an example lambda that returns hardcoded data, but in its place you could fetch user info
from a database or REST API. Afterwards, the provided actions simply change the page displayed, but in a real app,
these could instead invoke other lambdas to take the desired action.

## Useful commands

* `cdk deploy --profile=<your AWS profile>`  deploy this stack to your default AWS account/region
* `npx buttonize dev ./bin/customer-support.ts --profile=<your AWS profile>`  deploy this app for use within Buttonize's web interface
