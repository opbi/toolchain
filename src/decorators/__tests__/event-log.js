import { logger } from 'tools';

import eventLog from '../event-log';

logger.info = jest.fn();
logger.error = jest.fn();

describe('eventLog', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when logger not present in context', () => {
    it('skip the log and return the result in await', async () => {
      const original = () => 'yes';
      const decorated = eventLog()(original);
      const result = await decorated();

      expect(result).toBe('yes');
      expect(logger.info.mock.calls.length).toBe(0);
    });

    it('throws error from the original function', async () => {
      const original = () => {
        const e = { message: 'error' };
        throw e;
      };
      const decorated = eventLog()(original);

      try {
        await decorated();
      } catch (e) {
        expect(e.message).toBe('error');
      }
    });
  });

  describe('when logger present in context', () => {
    it('log the event when input function call succeeds', async () => {
      const original = async () => 'yes';
      const decorated = eventLog()(original);
      const result = await decorated({}, {}, { logger });

      expect(result).toBe('yes');
      expect(logger.info.mock.calls).toMatchSnapshot();
    });

    it('log the error event when input function fails', async () => {
      const original = () => {
        const e = { message: 'error' };
        throw e;
      };
      const decorated = eventLog()(original);

      try {
        await decorated({}, {}, { logger });
      } catch (e) {
        expect(e.message).toBe('error');
        expect(logger.info.mock.calls).toMatchSnapshot();
        expect(logger.error.mock.calls).toMatchSnapshot();
      }
    });
  });
});
