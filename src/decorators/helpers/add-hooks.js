/*
  a type of decorator to add hooks to a function
 */

const addHooks = ({
  guard = () => true,
  beforeHook = () => {},
  afterHook = () => {},
  errorHook = () => {},
}) => action => async (param, meta = {}, context = {}) => {
  if (!guard(param, meta, context)) return action(param, meta, context);

  try {
    await beforeHook(param, meta, context, action);

    const result = await action(param, meta, context);

    await afterHook(param, meta, context, action);

    return result;
  } catch (e) {
    await errorHook(e, param, meta, context, action);

    throw e;
  }
};

export default addHooks;
