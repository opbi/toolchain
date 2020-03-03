import sleep from 'lib/sleep';

// TODO: test data object would need to be instanced
// if polling used by multiple actions
const data = [];

const polling = ({
  until,
  accumulate,
  transform,
  interval = 1000,
  timeout = 30 * 1000,
} = {}) => action => async (param, meta = {}, context) => {
  const { pollingStart = Date.now() } = meta;

  let result;
  result = await action(param, meta, context);

  if (accumulate) data.push(accumulate(result));

  if (until(result)) {
    return accumulate ? data : result;
  }

  const lapsed = Date.now() - pollingStart;
  if (lapsed > timeout) {
    throw Error('polling timeout');
  }

  await sleep(interval);
  result = await polling({ until, accumulate, interval, timeout })(action)(
    param,
    { ...meta, pollingStart },
    context,
  );

  if (!accumulate) {
    return result;
  }
  return transform ? transform(data) : data;
};

export default polling;
