import sleep from 'lib/sleep';
import addHooks from './helpers/add-hooks';

/**
 * A decorator to retry action until condition met or reach maxRetries.
 *
 * @param {Function} config.condition - Condition to retry.
 * @param {number} config.maxRetries - Max times of retry.
 * @param {number} config.delay - Time to wait between retry.
 * @returns {object|Array}        The data returned from the original action call.
 */
const errorRetry = (config = {}) =>
  addHooks({
    errorHook: async (e, param, meta, context, action) => {
      const { condition = () => true, maxRetries = 3, delay } = config;
      const { retries = 0 } = meta;
      if (retries < maxRetries && condition(e, param, meta, context)) {
        if (delay) await sleep(delay);

        const updatedMeta = {
          ...meta,
          retries: retries + 1,
          maxRetries,
        };
        const result = await errorRetry(config)(action)(
          param,
          updatedMeta,
          context,
        );
        return result;
      }
      throw e;
    },
  });

export default errorRetry;
