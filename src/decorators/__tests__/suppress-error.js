import suppressError from '../suppress-error';

describe('suppressError', () => {
  it('returns original result', async () => {
    const original = () => 'yes';
    const decorated = suppressError()(original);

    const result = await decorated();
    expect(result).toBe('yes');
  });

  it('suppress error from throwing', async () => {
    const original = () => {
      const e = { message: 'error' };
      throw e;
    };
    const decorated = suppressError()(original);

    try {
      original();
    } catch (e) {
      expect(e.message).toBe('error');
    }

    try {
      const result = await decorated();
      expect(result.message).toBe('error');
    } catch (e) {
      if (e) {
        throw Error('error is expected to be suppressed');
      }
    }
  });
});
