import sleep from 'lib/sleep';

// TODO: try add recursiveErrorHook to addHooks
const conditionalRetry = (config = {}) => action => async (
  param,
  meta = {},
  context,
) => {
  try {
    const result = await action(param, meta, context);
    return result;
  } catch (e) {
    const { condition = () => true, maxRetries = 1, delay } = config;
    const { retries = 0 } = meta;

    if (retries < maxRetries && condition(e, param, meta, context)) {
      if (delay) await sleep(delay);

      const result = await conditionalRetry(config)(action)(
        param,
        {
          ...meta,
          retries: retries + 1,
          maxRetries,
        },
        context,
      );
      return result;
    }

    throw e;
  }
};

export default conditionalRetry;
