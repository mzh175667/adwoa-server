import Joi from "joi";

const gaolSchema = Joi.object({
  goal_name: Joi.string().required(),
  user: Joi.string().required(),
});

export default gaolSchema;
