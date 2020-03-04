/*
  a standard decorator template
  to hook healthy side-effects to a function
 */
const addHooks = ({
  bypassHook = () => false,
  beforeHook = () => {},
  afterHook = () => {},
  errorHook = () => {},
} = {}) => action => async (param, meta = {}, context = {}) => {
  if (bypassHook(param, meta, context)) return action(param, meta, context);

  try {
    await beforeHook(param, meta, context, action);

    const result = await action(param, meta, context);

    await afterHook(param, meta, context, action);

    return result;
  } catch (e) {
    const errorHookResult = await errorHook(e, param, meta, context, action);

    if (errorHookResult) {
      return errorHookResult;
    }

    throw e;
  }
};

export default addHooks;
