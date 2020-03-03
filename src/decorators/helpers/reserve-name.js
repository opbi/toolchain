/*
  when using curry/arrow functions to write decorators
  an anonymous function (.name: undefined) would be returned
  this helper helps to reserve the funcion name
 */

const setFunctionName = (targetFunction, name) => {
  const output = targetFunction;
  Object.defineProperty(output, 'name', {
    value: name,
    configurable: true,
  });
  return output;
};

// higher-order decorator/enhancer: the decorator for decorators
// usage: reserveName(decorator)(inputFunction)(...args)
// note: different from chaining decorators
//       decorator1(decorator2(inputFunction))(...args)
const reserveName = decorators => inputFunction =>
  setFunctionName(decorators(inputFunction), inputFunction.name);

export default reserveName;
