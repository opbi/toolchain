<p align="center">🎯</p>

<h3 align="center">toolchain</h3>
<p align="center" style="margin-bottom: 2em;">configurable hooks to standardise function mechanisms for consistency</p>

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

Turn scattered repeatitive control mechanism or observability code from interwined blocks to more readable, reusable, testable ones.

By abstract out common control mechanism and observability code into well-tested, composable hooks, it can effectively half the verboseness of your code. This helps to achieve codebase that is self-explanatory of its business logic and technical behaviour. Additionally, conditionally turning certain mechanism off makes testing the code very handy.

Let's measure the effect in LOC (Line of Code) and LOI (Level of Indent) by an example of cancelling user subscription on server-side with some minimal error handling of retry and restore. The simplification effect will be magnified with increasing complexity of the control mechanism.

> Using @opbi/toolchain Hooks: LOC = 16, LOI = 2
```js
// import userProfileApi from './api/user-profile';
// import subscriptionApi from './api/subscription';
// import restoreSubscription from './restore-subscription'

import { errorRetry, errorHandler, chain } from '@opbi/toolchain/dist/hooks';

const retryOnTimeoutError = errorRetry({
  condition: e => e.type === 'TimeoutError'
});

const restoreOnServerError = errorHandler({
  condition: e => e.code > 500,
  handler: (e, p, m, c) => restoreSubscription(p, m, c),
});

const cancelSubscription = async ({ userId }, meta, context) => {
  const { subscriptionId } = await chain(
    retryOnTimeoutError
  )(userProfileApi.getSubscription)( { userId }, meta, context );

  await chain(
    errorRetry(), restoreOnServerError,
  )(subscriptionApi.cancel)({ subscriptionId }, meta, context);
};

// export default cancelSubscription;
```

> Vanilla JavaScript: LOC = 32, LOI = 4
```js
// import userProfileApi from './api/user-profile';
// import subscriptionApi from './api/subscription';
// import restoreSubscription from './restore-subscription'

const cancelSubscription = async({ userId }, meta, context) => {
  let subscriptionId;

  try {
    const result = await userProfileApi.getSubscription({ userId }, meta, context);
    subscriptionId = result.subscriptionId;
  } catch (e) {
    if(e.type === 'TimeoutError'){
      const result = await userProfileApi.getSubscription({ userId }, meta, context);
      subscriptionId = result.subscriptionId;
    }
    throw e;
  }

  try {
    try {
      await subscriptionApi.cancel({ subscriptionId }, meta, context);
    } catch (e) {
      if(e.code > 500) {
        await restoreSubscription({ subscriptionId }, meta, context);
      }
      throw e;
    }
  } catch (e) {
    try {
      return await subscriptionApi.cancel({ subscriptionId }, meta, context);
    } catch (e) {
      if(e.code > 500) {
        await restoreSubscription({ subscriptionId }, meta, context);
      }
      throw e;
    }
  }
}

// export default cancelSubscription;
```
---
### How to Use

#### Install
```shell
yarn add @opbi/toolchain
```

#### Standard Function

Standardisation of function signature is powerful that it creates predictable value flows throughout the functions and hooks chain, making functions more friendly to meta-programming. Moreover, it is also now a best-practice to use object destruct assign for key named parameters.

Via exploration and the development of hooks, we set a function signature standard to define the order of different kinds of variables as expected and we call it `action function`:
```js
/**
 * The standard function signature.
 * @param  {object} param   - parameters input to the function
 * @param  {object} meta    - metadata tagged to describe how the function is called, e.g. requestId
 * @param  {object} context - contextual callable instances attached externally, e.g. metrics, logger
 */
function (param, meta, context) {}
```

#### Config the Hooks

All the hooks in @opbi/toolchain are configurable with possible default settings.

In the [cancelSubscription](#purpose) example, *errorRetry()* is using its default settings, while *restoreOnServerError* is configured *errorHandler*. Descriptive names of hook configurations help to make the behaviour very self-explanatory. Patterns composed of configured hooks can certainly be reused.

```js
const restoreOnServerError = errorHandler({
  condition: e => e.code > 500,
  handler: (e, p, m, c) => restoreSubscription(p, m, c),
});
```

#### Chain the Hooks

> "The order of the hooks in the chain matters."

<a href="https://innolitics.com/articles/javascript-decorators-for-promise-returning-functions/">
  <img alt="decorators" width="640" src="https://innolitics.com/img/javascript-decorators.png"/>
</a>

Under the hood, the hooks are implemented in the [decorators](https://innolitics.com/articles/javascript-decorators-for-promise-returning-functions) pattern. The pre-hooks, action function, after-hooks/error-hooks are invoked in a pattern as illustrated above. In the [cancelSubscription](#purpose) example, as *errorRetry(), restoreOnServerError* are all error hooks, *restoreOnServerError* will be invoked first before *errorRetry* is invoked.

---
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

Hooks are named in a convention to reveal where and how it works `[hook point][what it is/does]`, e.g. *errorCounter, eventLogger*.

Hook points are named `before, after, error` and `event` (multiple points).

#### Extension

You can also create more decorators with [addHooks](https://github.com/opbi/toolchain/blob/master/src/decorators/helpers/add-hooks.js). Open source them aligning with the above standards are very encouraged.

---
#### Decorators
Hooks here are essentially configurable decorators, while different in the way of usage. We found the name 'hooks' better describe the motion that they are attached to functions not modifying their original data process flow (keep it pure). Decorators are coupled with class methods, while hooks help to decouple definition and control, attaching to any function on demand.

```js
//decorators
class SubscriptionAPI:
  //...
  @errorRetry()
  cancel: () => {}
```
```js
//hooks
  withHooks(
    errorRetry()
  )(subscriptionApi.cancel)
```

#### Pipe Operator
We are excited to see how pipe operator will be rolled out and hooks can be elegantly plugged in.
```js
const cancelSubscription = ({ userId }, meta, context)
  |> withHook(timeoutErrorRetry)(userProfileApi.getSubscription)
  |> withHook(restoreOnServerError, timeoutErrorRetry)(subscriptionApi.cancel);
```
---
### Inspiration
* [Financial-Times/n-express-monitor](https://github.com/Financial-Times/n-express-monitor)
* [recompose](https://github.com/acdlite/recompose)
* [ramda](https://github.com/ramda/ramda)
* [funcy](https://github.com/suor/funcy/)
---
### License
[MIT](License)
