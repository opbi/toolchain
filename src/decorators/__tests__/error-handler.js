import errorHandler from '../error-handler';

describe('errorHandler', () => {
  it('call side-effect before error thrown', async () => {
    const original = () => {
      const error = { message: 'error' };
      throw error;
    };
    const handler = jest.fn();
    const decorated = errorHandler({ condition: () => true, handler })(
      original,
    );

    try {
      await decorated();
    } catch (e) {
      expect(handler).toBeCalled();
      expect(e.message).toBe('error');
    }
  });

  it('override error thrown in action if throw used in handler', async () => {
    const original = () => {
      const error = { message: 'error' };
      throw error;
    };
    const handler = () => {
      const error = { message: 'overrided' };
      throw error;
    };
    const decorated = errorHandler({ condition: () => true, handler })(
      original,
    );

    try {
      await decorated();
    } catch (e) {
      expect(e.message).toBe('overrided');
    }
  });

  it('does not bypass error throw in action if return used in handler', async () => {
    const original = () => {
      const error = { message: 'error' };
      throw error;
    };
    const handler = () => {
      const error = { message: 'overrided' };
      return error;
    };
    const decorated = errorHandler({ condition: () => true, handler })(
      original,
    );

    try {
      await decorated();
    } catch (e) {
      expect(e.message).toBe('error');
    }
  });
});
