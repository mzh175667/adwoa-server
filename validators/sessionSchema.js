import Joi from "joi";

const sessionSchema = Joi.object({
  session_title: Joi.string().required(),
  select_date: Joi.string().required(),
  class_time: Joi.string().required(),
  duration: Joi.number().required(),
  // session_type: Joi.string().required(),
  category: Joi.string().required(),
  details: Joi.string().required(),
  class_title: Joi.string().required(),
  equipment: Joi.array().required(),
  details: Joi.string().required(),
  price: Joi.number().required(),
  no_of_slots: Joi.number().required(),
  sports: Joi.string().required(),
  image: Joi.string().required(),
  session_type: Joi.array().required(),
});

export default sessionSchema;
