/**
 * Trim object keys to the target array.
 *
 * @param  {object} input -  The object to be trimmed.
 * @param  {Array} target - The array of target keys.
 * @returns {object}        The new object with trimmed keys.
 */
const objectOnlyKeys = (input, target) =>
  Object.keys(input).reduce((result, key) => {
    if (target.includes(key)) {
      return { ...result, [key]: input[key] };
    }
    return result;
  }, {});

export default objectOnlyKeys;
