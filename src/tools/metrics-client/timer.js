import prometheus from 'prom-client';

import objectOnlyKeys from 'utils/object-only-keys';
// import objectContains from 'utils/object-contains';

const { Summary } = prometheus;

export default class Timer extends Summary {
  start(untrimmedLabels = {}) {
    const { labelNames } = this;
    const labels = objectOnlyKeys(untrimmedLabels, labelNames);
    const timerStopper = this.startTimer(labels);
    return (dirtyEndLabels = {}) => {
      const endLabels = objectOnlyKeys(dirtyEndLabels, labelNames);
      timerStopper(endLabels);
    };
  }
}
