import addHooks from './helpers/add-hooks';
import findMetrics from './utils/find-metrics';
import findMetricsLabels from './utils/find-metrics-labels';

/*
  a decorator to add count of errors of the action in metrics
  using the metrics client in context
 */
const metricsError = ({ setExtraLabels = () => {}, setValue = () => 1 } = {}) =>
  addHooks({
    bypassHook: (p, m, c) => !c.metrics,
    errorHook: (e, param, meta, context, action) => {
      const { metrics } = context;
      const counter = findMetrics({ action, type: 'error', metrics });
      const labels = findMetricsLabels({
        metric: counter,
        source: { ...e, ...meta },
        extra: setExtraLabels(e, param, meta, context),
      });
      const value = setValue(e, param, meta, context);

      counter.inc(labels, value);
    },
  });

export default metricsError;
