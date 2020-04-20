const progressMonitor = ({ position = 0, destination }) => {
  const progress = {
    position,
    destination,
    // each time a progress is resumed from a resumed job
    // the timer is refreshed, to reflect the correct timing
    // startPosition/processed is also refreshed
    startTime: Date.now(),
    startPosition: position,
    add: (value) => {
      progress.position += value;
    },
    get processed() {
      return this.position - this.startPosition;
    },
    get remain() {
      return this.destination - this.position;
    },
    get duration() {
      return Date.now() - this.startTime; // unit: second
    },
    get etf() {
      const processedPercentage = this.processed / this.destination;
      const remainPercentage = this.remain / this.destination;
      const estimateTotalTime = this.duration / processedPercentage;
      const estimateTimeToFinish = estimateTotalTime * remainPercentage;
      return estimateTimeToFinish; // unit: second
    },
    get formattedPercentage() {
      return ((this.position / this.destination) * 100).toFixed(2);
    },
  };
  return progress;
};

export default progressMonitor;
