const findMetrics = ({ action, type, metrics }) => {
  const { name } = action;
  const specName = `${name}_${type}`;
  const spec = metrics[specName];
  if (!spec) {
    throw Error(`${specName} not found in metrics-specs`);
  }
  return spec;
};

export default findMetrics;
