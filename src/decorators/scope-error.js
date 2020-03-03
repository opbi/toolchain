import addHooks from './helpers/add-hooks';

const scopeError = addHooks({
  errorHook: (e, param, meta, context, action) => {
    // TODO: evaluate the risk of mutating the input object
    // given that hook function is currently ran async
    e.action = action.name;
  },
});

export default scopeError;
