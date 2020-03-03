import { logger, metrics } from '../index';

describe('import', () => {
  it('logger', () => {
    expect(typeof logger).toBe('object');
  });

  it('metrics', () => {
    expect(typeof metrics).toBe('object');
  });
});
