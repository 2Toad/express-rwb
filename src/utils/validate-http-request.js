import { separateCamelCase } from "./misc";

/**
 * Verify the specified field exists. A missing field is defined as undefined, null, or an empty string
 * @param {string} field the field that is required
 * @param {*} req the Express.Request object
 * @param {string} target the target within the Request object (default: "body")
 * @returns {string} an error message if validation fails; otherwise null
 */
export const requiredField = (field, req, target = "body") => {
  const value = req[target][field];
  return value === null || value === undefined || value === "" ? `${separateCamelCase(field)} is required` : null;
};

/**
 * Verify the specified fields exist. A missing field is defined as undefined, null, or an empty string
 * @param {string} fields an array of fields that are required
 * @param {*} req the Express.Request object
 * @param {string} target the target within the Request object (default: "body")
 * @returns {string[]} an array of error messages
 */
export const requiredFields = (fields, req, target = "body") => {
  const errors = [];

  fields.forEach((field) => {
    const value = req[target][field];
    if (value === null || value === undefined || value === "") {
      errors.push(`${separateCamelCase(field)} is required`);
    }
  });

  return errors;
};

/**
 * Verify the specified field is an array
 * @param {string} field the field to validate
 * @param {*} req the Express.Request object
 * @param {string} target the target within the Request object (default: "body")
 * @returns {string} an error message if validation fails; otherwise null
 */
export const arrayType = (field, req, target = "body") => {
  return Array.isArray(req[target][field]) ? null : `${separateCamelCase(field)} must be an array`;
};

/**
 * Verify the specified field is an array containing the specified number of items
 * @param {string} field the field to validate
 * @param {number} count the required array length
 * @param {*} req the Express.Request object
 * @param {string} target the target within the Request object (default: "body")
 * @returns {string} an error message if validation fails; otherwise null
 */
export const arrayCount = (field, count, req, target = "body") => {
  const value = req[target][field];
  return Array.isArray(value) && value.length === count
    ? null
    : `${separateCamelCase(field)} must be an array with a length of ${count}`;
};

/**
 * Verify the specified field contains the minimum number of specified characters
 * @param {string} field the field to validate
 * @param {number} min the minimum length required
 * @param {*} req the Express.Request object
 * @param {string} target the target within the Request object (default: "body")
 * @returns {string} an error message if validation fails; otherwise null
 */
export const stringLengthMin = (field, min, req, target = "body") => {
  const value = req[target][field];
  return value && value.length >= min
    ? null
    : `${separateCamelCase(field)} must be a minimum of ${min} character${min > 1 ? "s" : ""} in length`;
};

/**
 * Verify the specified field contains the maximum number of specified characters
 * @param {string} field the field to validate
 * @param {number} max the maximum length required
 * @param {*} req the Express.Request object
 * @param {string} target the target within the Request object (default: "body")
 * @returns {string} an error message if validation fails; otherwise null
 */
export const stringLengthMax = (field, max, req, target = "body") => {
  const value = req[target][field];
  return value && value.length <= max
    ? null
    : `${separateCamelCase(field)} must be a maximum of ${max} character${max > 1 ? "s" : ""} in length`;
};

/**
 * Verify the specified field is between the specified min-max characters in length
 * @param {string} field the field to validate
 * @param {number} min the minimum length required
 * @param {number} max the maximum length required
 * @param {*} req the Express.Request object
 * @param {string} target the target within the Request object (default: "body")
 * @returns {string} an error message if validation fails; otherwise null
 */
export const stringLengthRange = (field, min, max, req, target = "body") => {
  const value = req[target][field];
  return value && value.length >= min && value.length <= max
    ? null
    : `${separateCamelCase(field)} must be between ${min}-${max} characters in length`;
};

export default {
  requiredField,
  requiredFields,
  arrayType,
  arrayCount,
  stringLengthMin,
  stringLengthMax,
  stringLengthRange,
};
