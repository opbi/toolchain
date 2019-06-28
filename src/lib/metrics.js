import fs from 'fs';

import prometheus from 'prom-client';
import importLazy from 'import-lazy';

const lazyImport = importLazy(require);
const { register, Counter, Gauge, Histogram, Summary } = prometheus;

/**
 * Handler to display metrics when scraped by prometheus.
 */
export const metricsHandler = async (req, res) => {
  res.type(register.contentType).send(register.metrics());
};

export const metrics = {
  create: ({ type, ...specs }) => {
    if (['create', 'init'].includes(specs.name)) {
      throw Error('invalid metrics name');
    }
    let m;
    switch (type) {
      case 'counter':
        m = new Counter(specs);
        break;
      case 'gauge':
        m = new Gauge(specs);
        break;
      case 'histogram':
        m = new Histogram(specs);
        break;
      case 'summary':
        m = new Summary(specs);
        break;
      default:
        throw Error('invalid metrics type');
    }
    metrics[m.name] = m;
    return m;
  },
  init: () => {
    try {
      if (fs.existsSync('metrics-specs')) {
        const specs = lazyImport('metrics-specs');
        specs.forEach(m => {
          metrics.create(m);
        });
      }
    } catch (e) {
      // statements
      console.log(e);
    }
  },
};

metrics.init();

export default metrics;

// TODO: consider using fastify-metrics to get default histogram of response times
