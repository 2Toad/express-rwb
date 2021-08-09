/**
 * Capitalize the first character in a string. Makes all other characters lowercase.
 * @param {string} text The string to capitalize
 */
export const capFirst = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Separates the words in a camelCase string and capitalizes the first word
 * @param {string} text the camelCase string
 * @returns {string} A string of capitalized words
 */
export const separateCamelCase = (text) => {
  const words = text.split(/([A-Z][a-z]+)/).filter((e) => e);
  if (words.length) words[0] = capFirst(words[0]);
  return words.join(" ");
};

/**
 * Recursively adds all properties within Data to Target. Mutates the Target object.
 * @param {*} target the object to hydrate
 * @param {*} data the data to hydrate the object with
 */
export const hydrate = (target, data) => {
  Object.entries(data).forEach(([key, value]) => {
    // eslint-disable-next-line no-param-reassign
    target[key] = value;
  });
};
