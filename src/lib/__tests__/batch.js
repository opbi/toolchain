import createBatch from '../batch';

describe('createBatch', () => {
  beforeEach(() => {
    Date.now = jest
      .fn()
      .mockReturnValueOnce(2)
      .mockReturnValue(4);
  });

  it('create a batch with initial status', () => {
    const batch = createBatch({ size: 10 });
    expect(batch.size).toBe(10);
    expect(batch.data).toEqual([]);
    expect(batch.number).toBe(1);
    expect(batch.startTime).toBe(2);
  });

  it('.full would check if data.length has reached the size', () => {
    const batch = createBatch({ size: 2 });
    batch.add(1);
    expect(batch.full).toBe(false);
    batch.add(2);
    expect(batch.full).toBe(true);
  });

  it('.next() would reset the batch status and record time metrics', () => {
    const batch = createBatch();
    batch.add(1);
    batch.add(2);
    expect(batch.data).toEqual([1, 2]);

    batch.next();
    expect(batch.data).toEqual([]);
    expect(batch.number).toEqual(2);
    expect(batch.totalDuration).toBe(2);
    expect(batch.averageDuration).toBe(2);
  });
});
