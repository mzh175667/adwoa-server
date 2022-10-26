import Joi from "joi";

const classesSchema = Joi.object({
  class_name: Joi.string().required(),
  class_des: Joi.string().required(),
  class_format: Joi.string().required(),
  class_links: Joi.string().required(),
  class_type: Joi.string().required(),
});

export default classesSchema;
