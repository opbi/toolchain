import addHooks from './helpers/add-hooks';

/**
 * A decorator to add count of errors of the action in metrics
  using the metrics client in context.
 *
 * @param  {function():object} options.extraLabels - Use to add extra labels to error metrics.
 * @param  {function(): number} options.value - Use to set counter values, e.g. In case that retries are used.
 */
const errorCounter = ({ parseLabel = () => {}, value = () => 1 } = {}) =>
  addHooks({
    bypassHook: (p, m, c) => !c.metrics,
    errorHook: (e, p, m, c, action) => {
      const { metrics } = c;
      const counter = metrics.find({ action, type: 'error' });

      counter.count(
        { ...e, ...m, ...parseLabel(e, p, m, c) },
        value(e, p, m, c),
      );
    },
  });

export default errorCounter;
