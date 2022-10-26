import Joi from "joi";

const profileSchema = Joi.object({
  name: Joi.string().required(),
  date_of_birth: Joi.string().required(),
  country: Joi.string().required(),
  state: Joi.string().required(),
  gender: Joi.string().required(),
  city: Joi.string().required(),
});

export default profileSchema;
