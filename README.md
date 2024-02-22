
<p align="center">
  <a href="https://buttonize.io">
    <img width="350" alt="Buttonize.io" src="https://user-images.githubusercontent.com/6282843/212024942-9fd50774-ea26-48ba-b2cf-ca2584498c9a.png">
  </a>
</p>

---

<p align="center">
  <a href="https://discord.gg/2quY4Vz5BM"><img alt="Discord" src="https://img.shields.io/discord/1038752242238496779?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/buttonize"><img alt="npm" src="https://img.shields.io/npm/v/buttonize?style=flat-square" /></a>
  <a href="https://github.com/buttonize/buttonize/actions/workflows/release.yml?query=branch%3Amaster"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/buttonize/buttonize/release.yml?branch=master&style=flat-square&logo=github" /></a>
</p>

Buttonize enables you to build internals tools with [AWS CDK](https://aws.amazon.com/cdk/).

Hook-up UI components directly to AWS Lambda functions. Just install Buttonize and deploy your CDK. **That's it.**

## Getting started

Sign-up at [buttonize.io](app.buttonize.io/register)

### Setup fresh new CDK project

#### `npm`

```
$ npx create-buttonize
$ cd my-buttonize-app && npm install
$ npx buttonize dev --profile=YOUR_AWS_PROFILE
```

#### `pnpm`

```
$ pnpm create buttonize
$ cd my-buttonize-app && pnpm install
$ pnpm buttonize dev --profile=YOUR_AWS_PROFILE
```

### Install to existing CDK project
 
#### `npm`

```
$ npm install -D buttonize
$ npx buttonize dev --profile=YOUR_AWS_PROFILE
```

#### `pnpm`

```
$ pnpm add -D buttonize
$ pnpm buttonize dev --profile=YOUR_AWS_PROFILE
```



## Example

```ts
// MyStack.ts

import * as path from 'path'
import { Stack, StackProps } from 'aws-cdk-lib'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Action, Buttonize, ButtonizeApp, Display, Input } from 'buttonize/cdk'
import { Construct } from 'constructs'

export class MyStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    Buttonize.init(this, {
      apiKey: 'btnz_mybuttonizekey1234567',
      externalId: 'this-is-super-secret-99'
    })

    const discountGenerator = new NodejsFunction(this, 'DiscountGenerator', {
      entry: path.join(__dirname, 'discountGenerator.ts')
    })

    new ButtonizeApp(this, 'DemoApp', {
      name: 'Discount code generator',
      description:
        'Select the discount amount and you will get the discount code on the next page.'
    })
      .page('InputPage', {
        body: [
          Display.heading('Generate discount code for customer'),
          Input.select({
            id: 'discount',
            label: 'Discount value',
            options: [
              { label: '30%', value: 30 },
              { label: '60%', value: 60 }
            ]
          }),
          Display.button({
            label: 'Generate discount',
            onClick: Action.aws.lambda.invoke(
              discountGenerator,
              { Payload: { discountValue: '{{discount}}' } },
              { id: 'discountGenerator' }
            ),
            onClickFinished: Action.buttonize.app.changePage('DonePage')
          })
        ]
      })
      .page('DonePage', {
        body: [
          Display.heading('Discount generated'),
          Display.text('Discount code: {{InputPage.discountGenerator.code}}')
        ]
      })
  }
}
```

```ts
// discountGenerator.ts

export const handler = async (event: { discountValue: number }) => {
  console.log(`Generating discount of value ${event.discountValue}`)

  return {
    discountValue: event.discountValue,
    code: `${Math.random()}`.split('.')[1]
  }
}
```

### Result


<p align="center">
  <kbd>
    <img width="700" src="https://github.com/buttonize/buttonize/assets/6282843/0b6f714a-db76-4f24-9ef3-ad704029e836" />
  </kbd>
</p>

---

## Buttonize Docs

Learn more at [docs.buttonize.io](https://docs.buttonize.io)

---

**Join our community** [Discord](https://discord.gg/2quY4Vz5BM) | [Twitter](https://twitter.com/Buttonizeio)
