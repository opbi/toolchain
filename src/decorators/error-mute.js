import addHooks from './helpers/add-hooks';

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
