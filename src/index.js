import { validate, join } from 'utils';
import { FOO, BAR } from 'constants';

/**
 * An example function just to show the build and ci pipeline works.
 * @returns {string} Hello world.
 */
export default () => {
  if (validate({ foo: FOO, bar: BAR })) {
    return join(FOO, BAR);
  }
  throw Error('Something interesting has happened ;-)');
};
