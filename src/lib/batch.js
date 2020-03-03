const createBatch = ({ size } = {}) => {
  const batch = {
    size,
    data: [],
    number: 1,
    startTime: Date.now(),
    totalDuration: 0,
    averageDuration: 0,
    get full() {
      return this.data.length >= this.size;
    },
    add: value => {
      batch.data.push(value);
    },
    next: () => {
      const finishTime = Date.now();
      const duration = finishTime - batch.startTime;
      batch.totalDuration += duration;
      batch.averageDuration = batch.totalDuration / batch.number;

      batch.number += 1;
      batch.data = [];
      batch.startTime = Date.now();
    },
  };
  return batch;
};

export default createBatch;
