import polling from '../polling';

describe('polling', () => {
  it('poll until get the result', async () => {
    const original = jest
      .fn()
      .mockReturnValueOnce('no')
      .mockReturnValueOnce('no')
      .mockReturnValueOnce('yes');
    const decorated = polling({
      until: result => result === 'yes',
    })(original);
    const result = await decorated();
    expect(result).toBe('yes');
    expect(original.mock.calls).toHaveLength(3);
  });

  it('poll with the set interval', async () => {
    const original = jest
      .fn()
      .mockReturnValueOnce('no')
      .mockReturnValueOnce('no')
      .mockReturnValueOnce('yes');
    const startTime = Date.now();
    const decorated = polling({
      until: result => result === 'yes',
      interval: 2 * 1000,
    })(original);
    await decorated();
    const lapsed = Date.now() - startTime;
    expect(lapsed).toBeGreaterThan(6);
  });

  it('throws error if time exceeds the set timeout', async () => {
    const original = jest
      .fn()
      .mockReturnValueOnce('no')
      .mockReturnValueOnce('no')
      .mockReturnValueOnce('yes');
    const decorated = polling({
      until: result => result === 'yes',
      interval: 2 * 1000,
      timeout: 2000,
    })(original);
    try {
      await decorated();
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  it('throws error if the request has error', async () => {
    const original = jest
      .fn()
      .mockImplementationOnce(() => 'no')
      .mockImplementationOnce(() => {
        throw Error('expected');
      });
    const decorated = polling({
      until: result => result === 'yes',
    })(original);

    try {
      await decorated();
    } catch (e) {
      expect(e.message).toBe('expected');
    }
  });

  it('support accumulate function to gather data from different polling', async () => {
    const original = jest
      .fn()
      .mockReturnValueOnce({ ok: false, value: 'no' })
      .mockReturnValueOnce({ ok: false, value: 'no' })
      .mockReturnValueOnce({ ok: true, value: 'yes' });
    const decorated = polling({
      until: ({ ok }) => ok,
      accumulate: ({ value }) => value,
    })(original);
    const result = await decorated();
    expect(result).toEqual(['no', 'no', 'yes']);
  });
});
