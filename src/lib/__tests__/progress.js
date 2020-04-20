import progressMonitor from '../progress';

describe('progressMonitor', () => {
  beforeEach(() => {
    Date.now = jest.fn().mockReturnValueOnce(2).mockReturnValue(4);
  });

  it('initialise with default 0 position and get the correct update', () => {
    const progress = progressMonitor({ destination: 10 });
    progress.add(1);
    expect(progress.destination).toBe(10);
    expect(progress.position).toBe(1);
    expect(progress.remain).toBe(9);
    expect(progress.processed).toBe(1);
    expect(progress.startTime).toBe(2);
    expect(progress.duration).toBe(2);
    expect(progress.etf).toBe(9 * progress.duration);
    expect(progress.formattedPercentage).toBe('10.00');
  });

  it('initialise with a given position and get the correct update', () => {
    const progress = progressMonitor({ position: 5, destination: 10 });
    progress.add(1);
    expect(progress.destination).toBe(10);
    expect(progress.position).toBe(6);
    expect(progress.remain).toBe(4);
    expect(progress.processed).toBe(1);
    expect(progress.startTime).toBe(2);
    expect(progress.duration).toBe(2);
    expect(progress.etf).toBe(4 * progress.duration);
    expect(progress.formattedPercentage).toBe('60.00');
  });
});
