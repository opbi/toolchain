import sleep from 'lib/sleep';
import addHooks from './helpers/add-hooks';

/*
  a decorator to retry action until condition met or reach maxRetries
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