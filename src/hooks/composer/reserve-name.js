/*
  a decorator enhancer
  used to enhance decorators to preserve the input function name
  reserveName(decorator)(inputFunction)(...args)

  when using curry/arrow functions to write decorators
  an anonymous function (.name: undefined) would be returned
  this helper helps to reserve the funcion name
 */
const reserveNameLength = (decorator) => (inputFunction) => {
  const decorated = decorator(inputFunction);
  Object.defineProperty(decorated, 'name', {
    value: inputFunction.name,
    configurable: true,
  });
  Object.defineProperty(decorated, 'length', {
    value: inputFunction.length,
    configurable: true,
  });
  return decorated;
};

export default reserveNameLength;
