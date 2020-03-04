import sleep from 'lib/sleep';

/*
  a decorator used on request calls of remote endpoint with batch data
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
