import addHooks from './helpers/add-hooks';
import findMetrics from './utils/find-metrics';
import findMetricsLabels from './utils/find-metrics-labels';

const metricsTimer = ({ extralabels = () => {} } = {}) =>
  addHooks({
    bypassHook: (p, m, { metrics }) => !metrics,
    storageHook: (param, meta, context, action) => {
      const { metrics } = context;
      const timer = findMetrics({ action, type: 'timer', metrics });
      const labels = findMetricsLabels({
        metric: timer,
        source: meta,
        extra: extralabels(param, meta, context),
      });
      const finish = timer.startTimer(labels);
      return { finish };
    },
    afterHook: (r, p, m, c, a, { finish }) => finish(),
    errorHook: (e, p, m, c, a, { finish }) => finish(),
  });

export default metricsTimer;
