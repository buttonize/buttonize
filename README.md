
<p align="center">
  <a href="https://buttonize.io">
    <img width="350" alt="Buttonize.io" src="https://user-images.githubusercontent.com/6282843/212024942-9fd50774-ea26-48ba-b2cf-ca2584498c9a.png">
  </a>
</p>

---

<p align="center">
  <a href="https://discord.gg/2quY4Vz5BM"><img alt="Discord" src="https://img.shields.io/discord/1038752242238496779?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/@buttonize/cdk"><img alt="npm" src="https://img.shields.io/npm/v/@buttonize/cdk?style=flat-square" /></a>
  <a href="https://github.com/buttonize/buttonize-cdk/actions/workflows/release.yml?query=branch%3Amaster"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/buttonize/buttonize-cdk/release.yml?branch=master&style=flat-square" /></a>
</p>

[Buttonize](https://buttonize.io) is a low-code paltform which enables cloud developers to create UI widgets like buttons, inputs, forms etc. connected to the cloud services like [AWS Lambda](https://aws.amazon.com/lambda/), [AWS Step Functions](https://aws.amazon.com/step-functions/), [AmazonDynamoDB](https://aws.amazon.com/dynamodb/) and more.

This package contains [AWS CDK](https://aws.amazon.com/cdk/) constructs through which you can manage Buttonize widgets via Infrastructure as Code.

## Getting started

### Installation


#### TypeScript

```
$ npm i -D @buttonize/cdk
```

#### Python, Java, Go, .NET

*Coming soon...*

## Example

You can find more examples in the [`examples`](./examples) folder.

```typescript
import * as path from 'path'
import * as btnz from '@buttonize/cdk'
import * as cdk from 'aws-cdk-lib'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Construct } from 'constructs'

export class SimpleFormStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    btnz.GlobalConfig.init(this, {
      apiKey: process.env.BUTTONIZE_API_KEY, // Ideally use SSM or Secrets Manager
      executionRoleExternalId: 'secret-external-id' // Ideally use SSM or Secrets Manager
    })

    const simpleFormActionLambda = new NodejsFunction(
      this,
      'SimpleFormActionLambda',
      {
        handler: 'handler',
        entry: path.join(__dirname, `/src/index.ts`),
        runtime: lambda.Runtime.NODEJS_18_X
      }
    )

    const form = new btnz.Form({
      name: '[Example: simple-form] Invoke the lambda function',
      label: 'Open form',
      tags: ['simple', 'button', 'example']
    })

    form
      .addTextField('email', {
        label: 'Email of the user',
        placeholder: 'user@example.com',
        regex: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'
      })
      .addToggleField('isAdmin', {
        label: 'Is admin'
      })

    simpleFormActionLambda.addEventSource(form)
  }
}
```

## Video Tutorial

<p align="center">
  <a href="https://www.youtube.com/watch?v=38cHso4csgY&t=720s"><img width="720" alt="Video Tutorial" src="https://user-images.githubusercontent.com/6282843/227496761-739d6ad0-8b81-426c-8257-90f3ebab4bcb.png"></a>
</p>

## Construct API Docs

Read more [here](API.md).

## Buttonize Docs

Learn more at [docs.buttnoize.io](https://docs.buttonize.io/infrastructure-as-code/aws-cdk/quick-start)

---

**Join our community** [Discord](https://discord.gg/2quY4Vz5BM) | [Twitter](https://twitter.com/SST_dev)
