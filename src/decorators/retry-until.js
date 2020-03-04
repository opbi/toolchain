import sleep from 'lib/sleep';
import addHooks from './helpers/add-hooks';

/*
  a decorator to retry action until condition met or reach maxRetries
 */
const retryUntil = (config = {}) =>
  addHooks({
    errorHook: async (e, param, meta, context, action) => {
      const { condition = () => false, maxRetries = 3, delay } = config;
      const { retries = 0 } = meta;
      if (retries < maxRetries && condition(e, param, meta, context)) {
        if (delay) await sleep(delay);

        const updatedMeta = {
          ...meta,
          retries: retries + 1,
          maxRetries,
        };
        const result = await retryUntil(config)(action)(
          param,
          updatedMeta,
          context,
        );
        return result;
      }
      throw e;
    },
  });

export default retryUntil;
