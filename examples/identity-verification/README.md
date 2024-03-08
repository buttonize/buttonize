# Welcome to Buttonize!

This is an example project for CDK development with Buttonize.

Here, we have a standard CDK project, but with Buttonize constructs utilized within our stack in order to build
an internal app to be used by an identity management. With this app, you could imagine your team could review,
approve, and reject documents submitted by your user's for identity verification purposes.

This example provides an example lambda that returns hardcoded data, but in its place you could fetch user info
from a database or REST API. Afterwards, both the approve and reject button trigger separate AWS lambdas, each
of which could reach out to another one of your services in order to trigger the proper workflow.

## Useful commands

* `cdk deploy --profile=<your AWS profile>`  deploy this stack to your default AWS account/region
* `npx buttonize dev ./bin/identity-verification.ts --profile=<your AWS profile>`  deploy this app for use within Buttonize's web interface
