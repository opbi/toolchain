// note: this function can't be simplified by addHooks
// as the `return` keywords defined in the hook function
// is not on the same scope of the `throw`
// so there's no effective way to stop the `throw`

const suppressError = conditionFunction => action => async (
  param,
  meta,
  context,
) => {
  try {
    const result = await action(param, meta, context);
    return result;
  } catch (e) {
    if (!conditionFunction || conditionFunction(e, param, meta, context)) {
      return e;
    }
    throw e;
  }
};

export default suppressError;
