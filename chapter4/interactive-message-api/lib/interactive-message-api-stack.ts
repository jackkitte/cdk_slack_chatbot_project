import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import { Function, Runtime, Code } from '@aws-cdk/aws-lambda';
import { RestApi, Integration, LambdaIntegration, Resource } from '@aws-cdk/aws-apigateway';

export class InteractiveMessageApiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda Function 作成
    const lambdaFunction: Function = new Function(this, "sample-interactive-message-lambda",
    {
      functionName: "sample-interactive-message-lambda",
      runtime: Runtime.GO_1_X,
      code: Code.asset("./lambdaSource"),
      handler: "main",
      memorySize: 256,
      timeout: cdk.Duration.seconds(10),
      environment: {
        "SIGNING_SECRETS": "30b26967f47ec89c426c81390c60d892",
      }
    })

    // Policyを関数に付与
    lambdaFunction.addToRolePolicy(new iam.PolicyStatement({
      resources: ["*"],
      actions: [
        "ec2:StartInstances",
        "ec2:StopInstances",
        "ec2:DescribeInstances"
      ],
    }))

    // API Gateway作成
    const restAPI: RestApi = new RestApi(this, "sample-interactive-message-api",
    {
      restApiName: "sample-interactive-message-api",
      description: "Deployed by CDK"
    })

    // Integration作成
    const integration: Integration = new LambdaIntegration(lambdaFunction)

    // リソースの作成
    const getResource: Resource = restAPI.root.addResource("event")

    // メソッドの作成
    getResource.addMethod("POST", integration)
  }
}
