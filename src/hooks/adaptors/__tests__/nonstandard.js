import adaptorNonstandard from '../nonstandard';

import { eventLogger, errorRetry, chain } from '../../index';

const loggerMock = {
  info: jest.fn(),
  error: jest.fn(),
};

const [revertor, adaptor] = adaptorNonstandard;

describe('adaptorNonstandard', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('helps to use hook on non-standard functions with meta, context', async () => {
    const original = (a, b, c) => a + b + c;

    const adapted = chain(
      revertor(),
      eventLogger({ logParam: true }),
      adaptor(),
    )(original);

    const result = await adapted(1, 2, 3, {}, { logger: loggerMock });

    expect(result).toBe(6);
    expect(loggerMock.info.mock.calls).toMatchSnapshot();
  });

  it('helps to use hooks on non-standard functions without meta, context', async () => {
    const original = jest
      .fn((input) => input)
      .mockImplementationOnce(() => {
        throw Error('timeout');
      });

    const adapted = chain(revertor(), errorRetry(), adaptor())(original);

    const result = await adapted('yes');

    expect(result).toBe('yes');
    expect(original.mock.calls).toMatchSnapshot();
  });
});
