import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import InteractiveMessageApi = require('../lib/interactive-message-api-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new InteractiveMessageApi.InteractiveMessageApiStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
