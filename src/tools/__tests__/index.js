import { logger, metrics, tracer } from '../index';

describe('import', () => {
  it('logger', () => {
    expect(typeof logger).toBe('object');
  });

  it('metrics', () => {
    expect(typeof metrics).toBe('object');
  });

  it('tracer', () => {
    expect(typeof tracer).toBe('object');
  });
});
