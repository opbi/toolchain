import prometheus from 'prom-client';

const { Counter, Gauge, Histogram, Summary } = prometheus;
const typeMetricsMap = {
  counter: Counter,
  gauge: Gauge,
  histogram: Histogram,
  summary: Summary,
};

// when metrics were scraped by prometheus deamon,
// k8s meta data such as `app` would be added
// so it is not very necessary to add app name into metrics namespace
export const metricsNamespace =
  process.env.METRICS_NAMESPACE || 'domalch_metrics';

const metrics = {};

const create = ({ type, name, ...specs }) => {
  const MetricsConstructor = typeMetricsMap[type];
  if (!MetricsConstructor) {
    throw Error('invalid metrics type');
  }

  // convert the namecase to snakecase to align with prometheus standard
  const m = new MetricsConstructor({
    ...specs,
    name: `${metricsNamespace}_${name}`,
  });

  // TODO: update the original .inc(), .label() function
  // to take only the labelNames[] from the input

  metrics[name] = m;
  return m;
};

const init = list => {
  list.forEach(m => {
    create(m);
  });
};

const getErrorMetrics = functionName => {
  const specName = `${functionName}_error`;
  const spec = metrics[specName];
  const { values } = spec.get();
  return values;
};

const getErrorNumber = functionName => {
  const values = getErrorMetrics(functionName);
  return values.length;
};

const objectPartOfAnother = (a, b) =>
  Object.keys(a).every(keyName => a[keyName] === b[keyName]);

const getErrorNumberByLabels = ({ functionName, labels }) => {
  const values = getErrorMetrics(functionName);
  return values.filter(value => objectPartOfAnother(labels, value.labels))
    .length;
};

const getErrorStatsByLabelName = ({ functionName, labelName }) => {
  const values = getErrorMetrics(functionName);
  return values.reduce((output, value) => {
    const { labels } = value;
    const selectedLabelValue = labels[labelName];
    return {
      ...output,
      [selectedLabelValue]: output.selectedLabelValue
        ? output.selectedLabelValue + 1
        : 1,
    };
  }, {});
};

metrics.init = init;
metrics.getErrorMetrics = getErrorMetrics;
metrics.getErrorNumber = getErrorNumber;
metrics.getErrorNumberByLabels = getErrorNumberByLabels;
metrics.getErrorStatsByLabelName = getErrorStatsByLabelName;

export default metrics;

// TODO: consider using fastify-metrics to get default histogram of response times
