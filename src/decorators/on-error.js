import addHooks from './helpers/add-hooks';

// side effect in case of error, but not block the error throw
const onError = (errorCondition, errorHandler) =>
  addHooks({
    errorHook: (e, param, meta, context, action) => {
      if (errorCondition(e)) {
        return errorHandler(e, param, meta, context, action);
      }
      return undefined;
    },
  });

export default onError;
