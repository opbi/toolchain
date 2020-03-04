import addHooks from './helpers/add-hooks';
import findMetrics from './utils/find-metrics';
import findMetricsLabels from './utils/find-metrics-labels';

/**
 * A decorator to add count of errors of the action in metrics
  using the metrics client in context.
 *
 * @param  {Function} options.extraLabels - [use (e, param, meta, context) to add extra labels to error metrics].
 * @param  {Function} count -               [use (e, p, m, c) to set counter values, e.g. In case that retries are used].
 */
const metricsError = ({ extraLabels = () => {}, count = () => 1 } = {}) =>
  addHooks({
    bypassHook: (p, m, c) => !c.metrics,
    errorHook: (e, param, meta, context, action) => {
      const { metrics } = context;
      const counter = findMetrics({ action, type: 'error', metrics });
      const labels = findMetricsLabels({
        metric: counter,
        source: { ...e, ...meta },
        extra: extraLabels(e, param, meta, context),
      });
      const value = count(e, param, meta, context);

      counter.inc(labels, value);
    },
  });

export default metricsError;
