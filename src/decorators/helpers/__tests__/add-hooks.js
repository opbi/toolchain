import addHooks from '../add-hooks';

const callOrder = jest.fn();

describe('addHooks', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('decorate input function with hooks and fire them in order', async () => {
    const callOrderWithName = hookName => () => {
      callOrder(hookName);
    };
    const beforeHook = callOrderWithName('beforeHook');
    const afterHook = callOrderWithName('afterHook');
    const original = callOrderWithName('original');

    const decorated = addHooks({ beforeHook, afterHook })(original);

    await decorated();

    expect(callOrder.mock.calls).toMatchSnapshot();
  });

  it('return the result of original function', async () => {
    const original = () => {
      return 'result';
    };

    const decorated = addHooks({})(original);

    const result = await decorated();

    expect(result).toBe('result');
  });
});
