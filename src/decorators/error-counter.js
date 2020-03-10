// @ts-check

import addHooks from './helpers/add-hooks';

/**
 * @template T
 * @typedef {import('./types').ErrorHookMethod<T>} ErrorHookMethod
 */

/**
 * A decorator to use context.metrics to count error thrown from action.
 *
 * @param {object} options - Decorator config.
 * @param {ErrorHookMethod<object>} [options.parseLabel] - Use to add extra labels to error metrics.
 * @param {ErrorHookMethod<number>} [options.value] - Use to set counter values, e.g. In case that retries are used.
 */
const errorCounter = ({ parseLabel = () => {}, value = () => 1 } = {}) =>
  addHooks({
    bypassHook: (p, m, c) => !c.metrics,
    errorHook: (e, p, m, c, a) => {
      const counter = c.metrics.find({ action: a.name, type: 'error' });

      counter.count(
        { ...e, ...m, ...parseLabel(e, p, m, c, a) },
        value(e, p, m, c, a),
      );
    },
  });

export default errorCounter;
