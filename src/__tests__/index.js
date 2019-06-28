import { logger, metrics, metricsHandler, liveHandler } from '../index';

describe('index', function() {
  it('logger', function() {
    expect(typeof logger).toBe('object');
  });

  it('metrics', function() {
    expect(typeof metrics).toBe('object');
  });

  it('metricsHandler', function() {
    expect(typeof metricsHandler).toBe('function');
  });

  it('liveHandler', function() {
    expect(typeof liveHandler).toBe('function');
  });
});
