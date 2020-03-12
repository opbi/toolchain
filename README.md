<h3 align="center">toolchain</h3>
<p align="center" style="margin-bottom: 2em;">🎯 functional hooks for consistent micro-service observability</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@opbi/toolchain">
    <img alt="npm" src="https://img.shields.io/npm/v/@opbi/toolchain.svg"/>
  </a>
  <a href="https://circleci.com/gh/opbi/workflows/toolchain">
    <img alt="CircleCI" src="https://img.shields.io/circleci/project/github/opbi/toolchain/master.svg"/>
  </a>
  <a href="https://coveralls.io/github/opbi/toolchain?branch=master">
    <img alt="Coveralls" src="https://img.shields.io/coveralls/github/opbi/toolchain/master.svg"/>
  </a>
  <a href="https://inch-ci.org/github/opbi/toolchain">
    <img alt="inch-ci" src="http://inch-ci.org/github/opbi/toolchain.svg?branch=master&style=shields"/>
  </a>
  <a href="https://github.com/semantic-release/semantic-release">
    <img alt="semantic-release" src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg"/>
  </a>
</p>

<p align="center">
  <a href="https://snyk.io/test/github/opbi/toolchain">
    <img alt="Known Vulnerabilities" src="https://snyk.io/test/github/opbi/toolchain/badge.svg"/>
  </a>
  <a href="https://app.fossa.io/projects/git%2Bgithub.com%2Fopbi%2Ftoolchain?ref=badge_shield">
    <img alt="License Scan" src="https://app.fossa.io/api/projects/git%2Bgithub.com%2Fopbi%2Ftoolchain.svg?type=shield"/>
  </a>
  <a href="https://david-dm.org/opbi/toolchain">
    <img alt="Dependencies" src="https://img.shields.io/david/opbi/toolchain.svg"/>
  </a>
  <a href="https://david-dm.org/opbi/toolchain?type=dev">
    <img alt="devDependencies" src="https://img.shields.io/david/dev/opbi/toolchain.svg"/>
  </a>
  <a href="https://scrutinizer-ci.com/g/opbi/toolchain/?branch=master">
    <img alt="Scrutinizer Code Quality" src="https://img.shields.io/scrutinizer/g/opbi/toolchain.svg"/>
  </a>
</p>

---

### Purpose

There're a large amount of semi-automatable codes in most production codebases, especially around input validation/null check, error/exception handling, observability anchors(log, metrics, tracing) and various other elements to thread functions together to achieve business goals stably. All those are essential for production code, while they are slowly corrupting the readability/maintability of the codebase, incuring huge communication cost between teams due to a lack of common standards. Fortunately, without AI, it is still possible to automate some of those common programming actions with a standard.

With the power of function composition in Javascript, it becomes very simple to modularize those control mechanisms in the form of well-tested reusable decorators. This makes the core business logic functions extremely conscise and easy to read/test/migrate.

### How to Use

#### Install
```shell
yarn add @opbi/toolchain
```

#### Concepts & Conventions

A few concepts and conventions are introduced to make a standard for those decorators to work well with each other. We'll call a core logic function `action`, and it comes with a standard function signature of `(param<object>, meta<object>, context<object>)`. `param` is the arg of the input values to the core logic action, and with object destruct assigning it is a best-practice to make function calls. `meta` is the arg to be used primarily by logger, metrics clients to anchor meta-data of the function calls to provide the background where and how this call happened. `context` is the arg where you append instances of e.g. logger, metrics and other functions down to the action calling chain.

The decorators come with a standard config step `decorator(config)(action)`, and are named in the format of `[hook point]-[client/behaviour]`, e.g. `errorCounter, eventLogger`.

There are generally three hook points: `before, after, error`, and when a decorator is hooked into both after and error, we call it `event`.

#### Compose & Reuse

Say we're going to build a simple module to parse and upload a list of json files to a database. Using the decorators, we can write minimum code in `json-file-reader.js` and `db-batch-write.js` just to cover the essential logics and get them tested. Then assemble those step actions in the main module.

```js
//json-to-db.js
import {
  errorCounter,
  errorMute,
  errorRetry,
  eventLogger,
  eventTimer,
  recompose,
} from '@opbi/toolchain/dist/decorators';

import jsonFileReader from './json-file-reader';
import dbBatchWrite from './db-batch-write';

const actionErrorLessThan = number =>
  (e, p, m, { metrics }, action) =>
    metrics &&
    metrics.find({ action, type: 'error' }).value() < number;

const labelBatchSize = (p, m, c) => ({ batchSize: c.batch.size });

const jsonToDb = async ({ fileList }, meta, context) => {
  const data = await recompose(
    errorMute({ condition: actionErrorLessThan(20) }),
    eventTimer(),
    eventLogger(),
    errorCounter(),
  )(jsonFileReader)({ fileList }, meta, context);

  await recompose(
    eventTimer({ parseLabel: labelBatchSize }),
    errorRetry(),
    eventLogger(),
    errorCounter(),
    errorMute({ condition: e => e.code === 11000}),
  )(dbBatchWrite)({ data }, meta, context);
};

export default jsonToDb;
```

**The order of the decorators in the recompose chain matters.**

The afterHooks and errorHooks are from bottom to top, while the beforeHooks will be executed from top to bottom and meta/context would be passed from top to bottom.

In the 1st recompose, because of the `errorMute` on the top position, before the number of errors counted by `errorCounter` reaches 20, any error populated from `jsonFileReader` would be muted so that jsonToDb process is not stopped.

In the 2nd recompose above error with code 11000 would be muted and will not be populated to `errorCounter`, `eventLogger`, `errorRetry`, `eventTimer`. The `eventTimer` at the very top would time in the whole duration of execution even if multiple retries happened.

You can see from above that, we can actually make decorator config function with names to make the behaviour highly descriptive. This makes it even possible to package and reuse function control patterns, which is a very efficient way to leverage the power of meta-programming.

```js
//patterns/observerable-retry.js
import {
  errorCounter,
  errorRetry,
  eventLogger,
  eventTimer,
  recompose,
} from '@opbi/toolchain/dist/decorators';

export default recompose(
  eventTimer(),
  errorRetry(),
  eventLogger(),
  errorCounter(),
);
```

#### Error Handling

Furthermore, this makes error handling very handy combing custom hanlders with universal handler.

```js
//cancel-subscription.js
import {
  errorHandler,
  errorRetry,
  recompose,
} from '@opbi/toolchain/dist/decorators';

import userProfileApi from './api/user-profile';
import subscriptionApi from './api/subscription';

import universalErrorPage from './handler/error-page';

const errorForbiddenHandler = {
  condition: e => e.code === 403,
  handler: (e, p, m, { res }) => res.status(403).redirect('/');
}

const timeoutErrorRetry = errorRetry({
  condition: e => e.type === 'TimeoutError'
});

const cancelSubscription = async ({ userId }, meta, context) => {
  const { subscriptionId } = await recompose(
    errorHandler({ condition: e => e.code !== 403, handler: universalErrorPage })
    errorHandler(errorForbiddenHandler),
    timeoutErrorRetry
  )(userProfileApi.getSubscription)(
    { userId }, meta, context
  );

  await recompose(
    errorHandler({
      condition: e => e.code > 500,
      handler: (e, { subscriptionId }, m, c) => subscriptionApi.restore({ subscriptionId }, m, c),
    }),
    timeoutErrorRetry,
  )(subscriptionApi.cancel)({ subscriptionId }, meta, context);
};

export default cancelSubscription;
```

#### Ecosystem

Currently available decorators are as following:

* [callPolling](https://github.com/opbi/toolchain/blob/master/src/decorators/call-polling.js)
* [errorCounter](https://github.com/opbi/toolchain/blob/master/src/decorators/error-counter.js)
* [errorHandler](https://github.com/opbi/toolchain/blob/master/src/decorators/error-handler.js)
* [errorMute](https://github.com/opbi/toolchain/blob/master/src/decorators/error-mute.js)
* [errorRetry](https://github.com/opbi/toolchain/blob/master/src/decorators/error-retry.js)
* [errorTag](https://github.com/opbi/toolchain/blob/master/src/decorators/error-tag.js)
* [eventLogger](https://github.com/opbi/toolchain/blob/master/src/decorators/event-logger.js)
* [eventTimer](https://github.com/opbi/toolchain/blob/master/src/decorators/event-timer.js)

#### Extension

You can also create more decorators for yourself or the ecosystem with the reliable standard decorator creator(coming soon). It helps you to maintain a standard across your decorators to ensure compatibility and consistent develop experience.

### License
[MIT](License)
