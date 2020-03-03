import compose from 'compose-function';

import reserveName from './reserve-name';

const reserveNameCompose = (...args) => {
  const enhancedArgs = args.map(arg => reserveName(arg));
  return compose(...enhancedArgs);
};

export default reserveNameCompose;
