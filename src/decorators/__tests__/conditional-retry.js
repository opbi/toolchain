import conditionalRetry from '../conditional-retry';

describe('conditionalRetry', () => {
  it('does not retry if condition not set', async () => {
    const original = jest
      .fn()
      .mockImplementationOnce(() => {
        throw Error('timeout');
      })
      .mockImplementationOnce(() => {
        throw Error('error');
      });
    const decorated = conditionalRetry()(original);
    try {
      await decorated();
    } catch (e) {
      expect(e.message).toBe('timeout');
    }
  });

  it('retries until condition met', async () => {
    const original = jest
      .fn()
      .mockImplementationOnce(() => {
        throw Error('timeout');
      })
      .mockImplementationOnce(() => {
        throw Error('error');
      });
    const condition = e => e.message === 'timeout';
    const decorated = conditionalRetry({
      condition,
      maxRetries: 2,
    })(original);
    try {
      await decorated();
    } catch (e) {
      expect(e.message).toBe('error');
    }
  });

  it('retries until result returned', async () => {
    const original = jest
      .fn()
      .mockImplementationOnce(() => {
        throw Error('timeout');
      })
      .mockImplementationOnce(() => {
        return 'yes';
      });
    const condition = e => e.message === 'timeout';
    const decorated = conditionalRetry({
      condition,
    })(original);
    const result = await decorated();
    expect(result).toBe('yes');
  });

  it('delays if specified', async () => {
    const original = jest
      .fn()
      .mockImplementationOnce(() => {
        throw Error('timeout');
      })
      .mockImplementationOnce(() => {
        return 'yes';
      });
    const condition = e => e.message === 'timeout';
    const startTime = Date.now();
    const decorated = conditionalRetry({
      condition,
      delay: 2000,
    })(original);
    await decorated();
    const lapsed = Date.now() - startTime;
    expect(lapsed).toBeGreaterThan(2);
  });
});
