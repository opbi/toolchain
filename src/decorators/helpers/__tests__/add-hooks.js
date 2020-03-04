import addHooks from '../add-hooks';

const callOrder = jest.fn();

const callOrderWithName = hookName => () => {
  callOrder(hookName);
};
const beforeHook = callOrderWithName('beforeHook');
const afterHook = callOrderWithName('afterHook');
const errorHook = callOrderWithName('errorHook');

describe('addHooks', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('decorate input function with hooks and fire them in right order', async () => {
    const original = callOrderWithName('original');
    const decorated = addHooks({ beforeHook, afterHook, errorHook })(original);

    await decorated();

    expect(callOrder.mock.calls).toMatchSnapshot();
  });

  it('return the result of original function despite hooked', async () => {
    const original = () => 'result';
    const decorated = addHooks({ beforeHook, afterHook, errorHook })(original);

    const result = await decorated();

    expect(result).toBe('result');
  });

  it('tolerates empty config but ideally should be removed during usage', async () => {
    const original = () => 'result';
    const decorated = addHooks()(original);
    const result = await decorated();

    expect(result).toBe('result');
  });

  it('throws error and fire beforeHook and errorHook', async () => {
    const original = () => {
      callOrder('original');
      const error = { message: 'error' };
      throw error;
    };

    const decorated = addHooks({ beforeHook, afterHook, errorHook })(original);

    try {
      await decorated();
    } catch (e) {
      expect(e.message).toBe('error');
      expect(callOrder.mock.calls).toMatchSnapshot();
    }
  });

  it('return result available in recursive errorHook instead of throwing an error', async () => {
    const original = result => {
      callOrder('original');
      if (result) {
        return 'result';
      }
      const error = { message: 'error' };
      throw error;
    };

    const recursiveErrorHookWithResult = (e, p, m, c, action) => {
      const result = action(true);
      return result;
    };

    const decorated = addHooks({ errorHook: recursiveErrorHookWithResult })(
      original,
    );

    const result = await decorated();
    expect(result).toBe('result');
  });

  it('bypass hooks when bypassHook condition met', async () => {
    const bypassHook = (param, meta, context) => !context.something;
    const original = callOrderWithName('original');
    const decorated = addHooks({
      bypassHook,
      beforeHook,
      afterHook,
      errorHook,
    })(original);

    await decorated();

    expect(callOrder.mock.calls).toMatchSnapshot();
  });
});
