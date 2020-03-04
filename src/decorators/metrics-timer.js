import findMetrics from './utils/find-metrics';
import findMetricsLabels from './utils/find-metrics-labels';

const metricsTimer = (setExtraLabels = () => {}) => action => async (
  param,
  meta,
  context,
) => {
  const { metrics } = context;

  if (!metrics) {
    return action(param, meta, context);
  }

  const timer = findMetrics({ action, type: 'timer', metrics });
  const labels = findMetricsLabels({
    metric: timer,
    source: meta,
    extra: setExtraLabels(param, meta, context),
  });
  // TODO: find a way/pattern to persist a variable between hooks
  const finish = timer.startTimer(labels);

  try {
    const result = await action(param, meta, context);

    finish();

    return result;
  } catch (e) {
    finish();

    throw e;
  }
};

export default metricsTimer;
