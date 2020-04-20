import prometheus from 'prom-client';

import metricsClient from './metrics-client';

// TODO: update the original .inc(), .label() function
// to take only the labelNames[] from the input

// TODO: further abstract out type of metrics will be used on application
// e.g. error_counter, call_timer, etc.
// make metrics-specs to { action, type }?

// TODO: consider using fastify-metrics to get default histogram of response times

// TODO: need to test the behaviour in a distributed system

let metricsUnits = {};

/*
  when metrics were scraped by prometheus deamon,
  k8s meta data such as `app` would be added
  so it is not very necessary to add AppName into metrics namespace
  it can be used to distinguish with canned metrics
 */
const metricsNamespace = process.env.METRICS_NAMESPACE || 'custom_metrics';

/**
 * Add a new metrics unit from metrics-specs.
 *
 * @param {object} options - Config.
 * @param  {string}    options.type -  Type of the metrics, e.g. Counter.
 * @param  {string}    options.name -  Name of the metrics, e.g. Action_error.
 * @param  {object} options.specs - Other specific configuration for the metrics, e.g. Help, labelNames, buckets.
 */
const add = ({ type, name, ...specs }) => {
  const MetricsConstructor = metricsClient[type];

  if (!MetricsConstructor) {
    throw Error('invalid metrics type');
  }

  // metricsNamespace will be appended
  const m = new MetricsConstructor({
    ...specs,
    name: `${metricsNamespace}_${name}`,
  });

  metricsUnits[name] = m;
};

/**
 * Load a list of metrics specs to metricsUnits.
 *
 * @param  {Array} list - List of metrics specs.
 */
const load = (list) => {
  list.forEach((m) => {
    add(m);
  });
};

/**
 * List the metrics unit instances stored in metricsUnits.
 *
 * @returns {object} <{[metrics name]: metrics unit instance}>.
 */
const list = () => metricsUnits;

/**
 * Find a metrics unit by action/type or by name(higher priority).
 *
 * @param {object} options - Config.
 * @param  {string} options.action - Name of the action function.
 * @param  {string} options.type -   Type of metrics attached to the action function.
 * @param  {string} options.name -   Name of the metrics unit.
 * @returns {object}                The metrics unit instance.
 */
const find = ({ action, type, name }) => {
  const unitName = name || `${action}_${type}`;
  const unit = metricsUnits[unitName];
  if (!unit) {
    throw Error(`${unitName} not found in metrics-specs`);
  }
  return unit;
};

/**
 * Clear instances stored in metricsUnits and prometheus.register.
 */
const reset = () => {
  prometheus.register.clear();
  metricsUnits = {};
};

export default {
  add,
  load,
  list,
  find,
  reset,
};
