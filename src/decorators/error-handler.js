import addHooks from './helpers/add-hooks';

/*
  a decorator to add conditional side-effect before error being thrown
  e.g. it can be used together with error-metrics to create conditional error-metrics
  e.g. it can also be used to handle specific error by throw error in the handler
 */
const errorHandler = ({ condition = () => false, handler }) =>
  addHooks({
    errorHook: (e, param, meta, context, action) => {
      if (condition(e)) {
        handler(e, param, meta, context, action);
      }
    },
  });

export default errorHandler;
