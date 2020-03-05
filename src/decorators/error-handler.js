import addHooks from './helpers/add-hooks';

/**
 * A decorator to add conditional side-effect before error being thrown
  e.g. It can be used together with error-metrics to create conditional error-metrics
  e.g. It can also be used to handle specific error by throw error in the handler.
 *
 * @param  {function():boolean} options.condition - Condition to call the handler.
 * @param  {Function} options.handler -   What to do when the condition met.
 */
const errorHandler = ({ condition = () => false, handler = () => {} } = {}) =>
  addHooks({
    errorHook: (e, param, meta, context, action) => {
      if (condition(e)) {
        handler(e, param, meta, context, action);
      }
    },
  });

export default errorHandler;
