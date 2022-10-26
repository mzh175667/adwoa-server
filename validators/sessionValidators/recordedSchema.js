import Joi from "joi";

const recordedSchema = Joi.object({
  videoLink: Joi.string().required(),
  recordCategory: Joi.string().required(),
  videoTitle: Joi.string().required(),
  no_of_play: Joi.string().required(),
  desc: Joi.string().required(),
});

export default recordedSchema;
