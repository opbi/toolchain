import addHooks from './helpers/add-hooks';
import findMetrics from './helpers/find-metrics';
import findMetricsLabels from './helpers/find-metrics-labels';

const metricsError = ({ setExtraLabels = () => {}, setValue = () => 1 } = {}) =>
  addHooks({
    guard: (p, m, c) => c.metrics,
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
