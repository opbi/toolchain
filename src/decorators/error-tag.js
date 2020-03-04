import addHooks from './helpers/add-hooks';

/*
  a decorator used on actions when they are not chained with a logged upper-level call
  this decorator attaches action name to the error then being thrown to a logged level
 */
const errorTag = ({ tag = (e, p, m, c, a) => ({ action: a.name }) } = {}) =>
  addHooks({
    errorHook: (e, p, m, c, a) => {
      // TODO: test if the .stack is still available
      const tagging = tag(e, p, m, c, a);
      const taggedError = Object.asign({}, e, tagging);
      throw taggedError;
    },
  });

export default errorTag;
