/*
  a standard decorator template
  to hook healthy side-effects to a function
 */
const addHooks = ({
  bypassHook = () => false,
  storeHook = () => {},
  beforeHook = () => {},
  actionHook = (param, meta, context, action) => action(param, meta, context),
  afterHook = () => {},
  errorHook = () => {},
} = {}) => action => async (param, meta = {}, context = {}) => {
  if (bypassHook(param, meta, context)) return action(param, meta, context);

  const store = storeHook(param, meta, context, action);

  try {
    await beforeHook(param, meta, context, action, store);

    const result = await actionHook(param, meta, context, action, store);

    await afterHook(result, param, meta, context, action, store);

    return result;
  } catch (e) {
    const errorHookResult = await errorHook(
      e,
      param,
      meta,
      context,
      action,
      store,
    );

    if (errorHookResult) {
      return errorHookResult;
    }

    throw e;
  }
};

export default addHooks;
