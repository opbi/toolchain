const selectKeysFromObject = ({ object, keys }) =>
  Object.keys(object).reduce((result, key) => {
    if (keys.includes(key)) {
      return { ...result, [key]: object[key] };
    }
    return result;
  }, {});

export default selectKeysFromObject;
