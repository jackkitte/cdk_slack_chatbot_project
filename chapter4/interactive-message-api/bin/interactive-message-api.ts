#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { InteractiveMessageApiStack } from '../lib/interactive-message-api-stack';

const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function deploy() {
    //Goのソースをbuildする
    await exec('go get -v -t -d ./lambdaSource/... && ' + 'GOOS=linux GOARCH=amd64 go build -o ./lambdaSource/main ./lambdaSource/**.go');

    const app = new cdk.App();
    new InteractiveMessageApiStack(app, 'InteractiveMessageApiStack');
    app.synth();

    //build結果のバイナリを消去する
    await exec('rm ./lambdaSource/main');
}

deploy();
