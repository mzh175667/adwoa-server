import Joi from "joi";

const serviceSchema = Joi.object({
  service_name: Joi.string().required(),
  user: Joi.string().required(),
});

export default serviceSchema;
