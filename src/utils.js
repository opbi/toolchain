// @flow

/**
 * Join to string with a space.
 */
export const join = (a: string, b: string): string => `${a} ${b}`;

/**
 * An example function to show JSDoc works with object destruction in function params.
 */
export const validate = ({
  foo,
  bar,
}: {
  foo: string,
  bar: string,
}): boolean => {
  if (typeof foo !== 'string' || typeof bar !== 'string') return false;
  return true;
};
