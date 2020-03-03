const retriable = ({ maxRetries = 1 } = {}) => action => async (
  param,
  meta = {},
  context,
) => {
  try {
    const result = await action(param, meta, context);
    return result;
  } catch (e) {
    const { retries = 0 } = meta;
    if (retries < maxRetries) {
      const result = await retriable({ maxRetries })(action)(
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

export default retriable;
