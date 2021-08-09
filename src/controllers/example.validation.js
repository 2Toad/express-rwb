import validate from "../utils/validate-http-request";

const echo = (req) => {
  const errors = validate.requiredFields(["input"], req);
  return errors;
};

export default {
  echo,
};
