import addHooks from './helpers/add-hooks';

/*
  a decorator to mute errors when conditions are met
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
