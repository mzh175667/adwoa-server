import Joi from "joi";

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  role: Joi.string().required(),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    // .minOfSpecialCharacters(1)
    .required(),
  // .minOfLowercase(4)
  // .minOfUppercase(5)
  // .minOfNumeric(6)
  // .noWhiteSpaces()
  // .messages({
  //   "password.minOfUppercase":
  //     "{#label} should contain at least {#min} uppercase character",
  //   "password.minOfSpecialCharacters":
  //     "{#label} should contain at least {#min} special character",
  //   "password.minOfLowercase":
  //     "{#label} should contain at least {#min} lowercase character",
  //   "password.minOfNumeric":
  //     "{#label} should contain at least {#min} numeric character",
  //   "password.noWhiteSpaces": "{#label} should not contain white spaces",
  // }),
  //
});

export default registerSchema;
