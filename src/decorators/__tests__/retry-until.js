import retryUntil from '../retry-until';

describe('retryUntil', () => {
  it('retry until default maxRetries if config/condition not set', async () => {
    const original = jest
      .fn()
      .mockImplementationOnce(() => {
        throw Error('timeout');
      })
      .mockImplementationOnce(() => {
        throw Error('timeout');
      })
      .mockImplementationOnce(() => {
        throw Error('error');
      });
    const decorated = retryUntil()(original);
    try {
      await decorated();
    } catch (e) {
      expect(e.message).toBe('error');
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
    const decorated = retryUntil({
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
    const decorated = retryUntil({
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
    const decorated = retryUntil({
      condition,
      delay: 2000,
    })(original);
    await decorated();
    const lapsed = Date.now() - startTime;
    expect(lapsed).toBeGreaterThan(2);
  });
});
