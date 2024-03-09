# Welcome to Buttonize!

This is an example project for CDK development with Buttonize.

Here, we have a standard CDK project, but with Buttonize constructs utilized within our stack in order to build
a simple page for our non-technical coworkers to trigger a lambda.

In this particular example, we've decided to demonstrate a button that triggers an import from two integrated systems.
For example, perhaps our sales data is generated and stored in our ERP, but our customer data is in a CRM, and we want
the sales data from the ERP for each customer visible in our CRM.

We accomplish this by writing a script to keep the data in sync. Perhaps once a day we run a lambda that triggers an
import process, hitting the REST API of one service with a GET, serializing the data, and then hitting the REST API
of the other service with a POST in order to send the data along.

Sometimes, though, our coworkers might change the data in the first system and not want to wait until the next day
to see the data reflected in the other system. We need to give them a way to instigate the process themselves, despite
the whole thing being very backend focused without any UIs to make it possible.

This is the perfect use-case for Buttonize! After the data is changed, our coworkers can use the button we've made
for them in order to trigger the same lambda that runs nightly, all without them having to dive into the technical
details.

We realize this example is a bit more specific than the others, but we hope it conveys the idea we're getting:
with Buttonize, you no longer need to spin up a frontend to trigger these basic, backend only tasks. We provide you
the button, and you can focus on the more interesting parts that are specific to the needs of your business.

## Useful commands

* `cdk deploy --profile=<your AWS profile>`  deploy this stack to your default AWS account/region
* `npx buttonize dev ./bin/integration-example.ts --profile=<your AWS profile>`  start live local development with code hot reloading
