import sleep from 'lib/sleep';

/**
 * A decorator used on request calls of remote endpoint with batch data.
 *
 * @param  {object} config - The decorator config.
 * @param  {function(Array|object): boolean} config.until - The function to set conditions to stop the polling and return the data.
 * @param  {function(Array|object): Array|object}  config.mapping - The mapping function to transform response to the data format needed.
 * @param {number}  config.interval - Time to wait between each polling call.
 * @param {number}  config.timeout - The max time to wait for the polling before abort it.
 * @returns {Function}        The decorated function returns the polling result.
 */
const polling = config => action => async (param, meta = {}, context = {}) => {
  const {
    until,
    mapping = data => data,
    interval = 1000,
    timeout = 30 * 1000,
  } = config;
  const { pollingStart = Date.now(), pollingData = [] } = context;

  const res = await action(param, meta, context);
  pollingData.push(mapping(res));

  // until the response signals process finished
  if (until(res)) return pollingData;

  if (Date.now() - pollingStart > timeout) {
    throw Error('polling timeout');
  }

  await sleep(interval);

  // return later combined result recursively
  return polling(config)(action)(param, meta, {
    ...context,
    pollingStart,
    pollingData,
  });
};

export default polling;
