import { initTracer } from 'jaeger-client';

import logger from './logger';

const config = {
  // serviceName is anchored to APP_NAME exported in Makefile
  serviceName: process.env.APP_NAME,
  sampler: {
    type: 'const',
    param: 1,
  },
  reporter: {
    logSpans: process.env.NODE_ENV === 'development',
  },
};
const option = { logger };

const configTracer = () => initTracer(config, option);

let instance;

const tracer = {
  rootSpan: undefined,
  start: (name) => {
    if (!instance) {
      instance = configTracer();
    }
    if (tracer.rootSpan) {
      const span = instance.startSpan(name, { childOf: tracer.rootSpan });
      return span;
    }
    const span = instance.startSpan(name);
    tracer.rootSpan = span;
    return span;
  },
};

export default tracer;
