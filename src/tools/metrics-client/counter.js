import prometheus from 'prom-client';

import objectOnlyKeys from 'utils/object-only-keys';
import objectContains from 'utils/object-contains';

const { Counter } = prometheus;

export default class EnhancedCounter extends Counter {
  count(untrimmedLabels = {}, value = 1) {
    const { labelNames } = this;
    const labels = objectOnlyKeys(untrimmedLabels, labelNames);
    this.inc(labels, value);
  }

  value(filter) {
    const values = filter
      ? this.get().values.filter(({ labels }) => objectContains(labels, filter))
      : this.get().values;
    return values
      .map(({ value }) => value)
      .reduce((output, v) => output + v, 0);
  }

  /**
   * Used when the exhaustive values of a label is not clear
   * e.g. When it is stats for errorCodes.
   *
   * @param  {string} labelName - The name of the label.
   * @returns {object}           {[labelValue]: count}.
   */
  stats(labelName) {
    const { values } = this.get();
    return values.reduce((output, { labels, value }) => {
      const labelValue = labels[labelName];
      const count = output.labelValue ? output.labelValue + value : value;
      return {
        ...output,
        [labelValue]: count,
      };
    }, {});
  }
}
