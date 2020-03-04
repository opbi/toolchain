import addHooks from './helpers/add-hooks';
import findMetrics from './utils/find-metrics';
import findMetricsLabels from './utils/find-metrics-labels';

/*
  a decorator to timing action execution time in both success/error cases
  and send metrics using the client attached in context
 */
const metricsTimer = ({ extralabels = () => {}, count = false } = {}) =>
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
      const stopTimer = timer.startTimer(labels);
      const countStart = () =>
        count
          ? findMetrics({ action, type: 'start', metrics }).inc(labels, 1)
          : undefined;
      const countSuccess = () =>
        count
          ? findMetrics({
              action,
              type: 'success',
              metrics,
            }).inc(labels, 1)
          : undefined;
      const countError = () =>
        count
          ? findMetrics({ action, type: 'error', metrics }).inc(labels, 1)
          : undefined;
      return { countStart, countSuccess, countError, stopTimer };
    },
    beforeHook: (p, m, c, a, { countStart }) => countStart(),
    afterHook: (r, p, m, c, a, { countSuccess, stopTimer }) => {
      stopTimer();
      countSuccess();
    },
    errorHook: (e, p, m, c, a, { countError, stopTimer }) => {
      stopTimer();
      countError();
    },
  });

export default metricsTimer;
