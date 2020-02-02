import * as cdk from '@aws-cdk/core';
import { Function, Runtime, Code } from '@aws-cdk/aws-lambda';
import { RestApi, Integration, LambdaIntegration, Resource } from '@aws-cdk/aws-apigateway';
import * as iam from '@aws-cdk/aws-iam';

export class EventApiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //Lambda Function作成
    const lambdaFunction: Function = new Function(this, "SampleEventLambda", {
      functionName: "sample-event-lambda",
      runtime: Runtime.GO_1_X,
      code: Code.asset("./lambdaSource"),
      handler: "main",
      memorySize: 256,
      timeout: cdk.Duration.seconds(10),
      environment: {
        "CHANNEL_ID": "CS7SVJVAP",
        "BOT_ID": "USMCNHD8X",
        "BOT_OAUTH": "xoxb-890596878674-905430591303-eQqa01MPvhKhqVlZ3RxT2TvQ",
        "SIGNING_SECRETS": "30b26967f47ec89c426c81390c60d892"
      }
    })

    //Policyを関数に付加
    lambdaFunction.addToRolePolicy(new iam.PolicyStatement({
      resources: ["*"],
      actions: ["ec2:DescribeInstances"]
    }))

    //API Gateway作成
    const restApi: RestApi = new RestApi(this, "sample-event-api", {
      restApiName: "Sample-Event-API",
      description: "Deployed by CDK"
    })

    //Integration作成
    const integration: Integration = new LambdaIntegration(lambdaFunction)

    //リソースの作成
    const getResource: Resource = restApi.root.addResource("event")

    //メソッドの作成
    getResource.addMethod("POST", integration)
  }
}
