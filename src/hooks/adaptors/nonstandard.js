export const adaptorNonstandard = () => (action) => async (
  param,
  meta,
  context,
) => {
  // convert the decorated action signature to standard signature (param, meta, context)
  // so that it can be hooked
  const result = await action(...Object.values(param), meta, context);
  return result;
};

export const revertorNonstandard = () => (action) => async (...args) => {
  let param;
  let meta;
  let context;

  const extraArgs = args.length - action.length;

  // ignore meta, context in any other cases
  if (extraArgs === 2) {
    param = args.slice(0, -2);
    [context, meta] = args.reverse();
  } else {
    param = args;
  }

  // calling the hooked function with standard signature
  const result = await action(param, meta, context);
  return result;
};

export default [revertorNonstandard, adaptorNonstandard];
