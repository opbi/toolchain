import metrics from '../metrics';

const metricsSpecs = [
  {
    name: 'serverRestart',
    type: 'counter',
    help: `the number of times server(node instance) restarted, an unexpected high number indicates crash loop`,
  },
  {
    name: 'dbConnect_timer',
    type: 'timer',
    help: `the time to create db connection to monitor upstream service health`,
    labelNames: ['envId'],
  },
  {
    name: 'dbConnect_error',
    type: 'counter',
    help: `the number of db connection errors`,
    labelNames: ['envId'],
  },
  {
    name: 'orderValue',
    type: 'histogram',
    help: 'price summary of shopping orders',
    buckets: [10, 100, 1000, 10000, 100000],
    labelNames: ['envId', 'length'],
  },
];

describe('metrics', () => {
  beforeEach(() => {
    metrics.load(metricsSpecs);
  });

  afterEach(() => {
    metrics.reset();
  });

  it('is an object with the following methods', () => {
    expect(typeof metrics).toBe('object');
    expect(metrics).toHaveProperty('load');
    expect(metrics).toHaveProperty('add');
    expect(metrics).toHaveProperty('find');
  });

  it('.load() can create a list of metrics unit', () => {
    metrics.reset();
    metrics.load(metricsSpecs);
    const units = metrics.list();
    expect(Object.keys(units)).toHaveLength(4);
  });

  it('.load() throws an error if invalid metrics type was specified', () => {
    metrics.reset();
    const invalidSpecs = [
      {
        name: 'someName',
        type: 'randomType',
      },
    ];
    try {
      metrics.load(invalidSpecs);
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  it('.find() can find a metrics unit', () => {
    const dbConnectTimer = metrics.find({ action: 'dbConnect', type: 'timer' });
    expect(dbConnectTimer).toBeDefined();
  });

  it('.find() throws an error if no unit found', () => {
    try {
      metrics.find({ action: 'dbConnect', type: 'invalid' });
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  it('counter.count() with excessive labels', () => {
    const counter = metrics.find({ name: 'dbConnect_error' });
    counter.count({ envId: 'test', foo: 'bar' });
    counter.count({ envId: 'test', foo: 'bar' }, 2);
    expect(counter.value()).toBe(3);
  });

  it('counter.value() to get the current total count with optional filter', () => {
    const counter = metrics.find({ name: 'dbConnect_error' });
    expect(counter.value()).toBe(0);
    counter.count();
    expect(counter.value()).toBe(1);
    counter.count({ envId: 'test' });
    counter.count({ envId: 'prod' });
    expect(counter.value({ envId: 'test' })).toBe(1);
    expect(counter.value({ envId: 'prod' })).toBe(1);
  });

  it('counter.stats() to get distribution of all values of a label', () => {
    const counter = metrics.find({ name: 'dbConnect_error' });
    expect(counter.value()).toBe(0);
    counter.count();
    counter.count({ envId: 'test' });
    counter.count({ envId: 'test' });
    counter.count({ envId: 'prod' });
    expect(counter.stats('envId')).toMatchSnapshot();
  });

  it('timer.start() with excessive labels or none', async () => {
    const timer = metrics.find({ name: 'dbConnect_timer' });
    const timerStop = timer.start({ envId: 'test', foo: 'bar' });
    timerStop();
    timer.start()();
    expect(timer.get().values[0]).toBeDefined();
  });
});
