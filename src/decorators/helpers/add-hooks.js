/**
 * A decorator creator to maintain a standard pattern
 * so that decorator behaviour is more predictable with lgihter test.
 *
 * @param  {Function} options.bypassHook - Condition function to bypass the decorator using (param, meta, context).
 * @param  {Function} options.storeHook -  Function to hook instance across all process hooks as an internal store, external instances are recommended to be stored in context.
 * @param  {Function} options.beforeHook -         Function to be executed before the action gets called (param, meta, context, store).
 * @param  {Function} options.actionHook -         Function to augument/modify action call, e.g. Augument args or completely change to another action (param, meta, context, action, store).
 * @param  {Function} options.afterHook -          Function to be executed after the action call is finished successfully (result, param, meta, context, action, store).
 * @param  {Function} options.errorHook -          Function to be executed when error caught calling action function (error, param, meta, context, action, store).
 * @returns {Function}                      The decorated action function that returns the result returned by the original action function or the modified one or value returned from errorHook.
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
