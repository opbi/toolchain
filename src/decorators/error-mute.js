import addHooks from './helpers/add-hooks';

/**
 * A decorator to mute errors when conditions are met.
 *
 * @param  {function(): boolean} options.condition - Condition to mute the error.
 * @returns {object|undefined}                     If the error is muted(not thrown to upper level) it is accessible in the return value.
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
