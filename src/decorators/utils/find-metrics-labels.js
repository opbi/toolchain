import selectKeysFromObject from 'utils/select-key-from-object';

const findMetricsLabels = ({ metric, source, extra }) => {
  const { labelNames } = metric;
  const labels = selectKeysFromObject({ object: source, keys: labelNames });
  return extra ? { ...labels, ...extra } : labels;
};

export default findMetricsLabels;
