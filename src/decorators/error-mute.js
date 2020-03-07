import addHooks from './helpers/add-hooks';

/**
 * @typedef {import('./types')} ErrorHook
 */

/**
 * A decorator to mute errors when conditions are met.
 *
 * @param {object} options - Config.
 * @param  {ErrorHook} options.condition - Condition to mute the error.
 * @returns {Error|object|undefined} - If the error is muted(not thrown to upper level) it is accessible in the return value.
 */
const errorMute = ({ condition = () => true } = {}) =>
  addHooks({
    errorHook: (e, p, m, c, a) => {
      if (condition(e, p, m, c, a)) {
        return e;
      }
      return undefined;
    },
  });

export default errorMute;
