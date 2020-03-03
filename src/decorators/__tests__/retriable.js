import retriable from '../retriable';

describe('retriable', () => {
  it('execute the original function', async () => {
    const original = () => 'yes';
    const decorated = retriable()(original);

    const result = await decorated();
    expect(result).toBe('yes');
  });

  it('retries once by default and return value of second trial', async () => {
    const original = jest
      .fn()
      .mockImplementationOnce(() => {
        throw Error('error');
      })
      .mockImplementationOnce(() => 'yes');
    const decorated = retriable()(original);

    const result = await decorated();
    expect(result).toBe('yes');
    expect(original.mock.calls).toHaveLength(2);
  });

  it('retries once by default and throw the error from second trial', async () => {
    const original = jest
      .fn()
      .mockImplementationOnce(() => {
        throw Error('error 1');
      })
      .mockImplementationOnce(() => {
        throw Error('error 2');
      });
    const decorated = retriable()(original);

    try {
      await decorated();
    } catch (e) {
      expect(e.message).toBe('error 2');
      expect(original.mock.calls).toHaveLength(2);
    }
  });

  it('retries the times set and return value before last trial', async () => {
    const original = jest
      .fn()
      .mockImplementationOnce(() => {
        throw Error('error 1');
      })
      .mockImplementationOnce(() => {
        throw Error('error 2');
      })
      .mockImplementationOnce(() => 'yes');

    const decorated = retriable({ maxRetries: 2 })(original);

    try {
      const result = await decorated();
      expect(result).toBe('yes');
      expect(original.mock.calls).toHaveLength(3);
    } catch (e) {
      throw Error('error not expected to be thrown here');
    }
  });

  it('retries the times set and throw the last error', async () => {
    const original = jest
      .fn()
      .mockImplementationOnce(() => {
        throw Error('error 1');
      })
      .mockImplementationOnce(() => {
        throw Error('error 2');
      })
      .mockImplementationOnce(() => {
        throw Error('error 3');
      });

    const decorated = retriable({ maxRetries: 2 })(original);

    try {
      await decorated();
    } catch (e) {
      expect(e.message).toBe('error 3');
      expect(original.mock.calls).toHaveLength(3);
    }
  });
});
