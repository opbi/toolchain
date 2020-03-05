import sleep from 'lib/sleep';

/**
 * A decorator used to poll remote endpoint with action.
 *
 * @param {object} options -
 * @param {Function} options.until - The function to set conditions to stop the polling and return the data.
 * @param {Function} options.mapping - The mapping function to transform response to the data format needed.
 * @param {number}  options.interval - Time to wait between each polling call.
 * @param {number}  options.timeout - The max time to wait for the polling before abort it.
 * @returns {Function}        The decorated function returns the polling result.
 */
const callPolling = ({
  until,
  mapping = data => data,
  interval = 1000,
  timeout = 30 * 1000,
}) => action => async (param, meta = {}, context = {}) => {
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
  return callPolling({
    until,
    mapping,
    interval,
    timeout,
  })(action)(param, meta, {
    ...context,
    pollingStart,
    pollingData,
  });
};

export default callPolling;
