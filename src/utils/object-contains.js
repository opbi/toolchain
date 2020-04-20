/**
 * Check if object a contains another object b by shallow equal.
 *
 * @param  {object} a - The bigger object.
 * @param  {object} b - The smaller object.
 * @returns {boolean}   If contains.
 */
const objectContains = (a, b) =>
  Object.keys(b).every((keyName) => b[keyName] === a[keyName]);

export default objectContains;
