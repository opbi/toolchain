import prometheus from 'prom-client';

import EnhancedCounter from './counter';
import Timer from './timer';

const { Summary, Gauge, Histogram } = prometheus;

export default {
  counter: EnhancedCounter,
  gauge: Gauge,
  histogram: Histogram,
  summary: Summary,
  timer: Timer,
};
