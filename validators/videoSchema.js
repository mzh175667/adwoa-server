import Joi from "joi";

const videoSchema = Joi.object({
  sessionId: Joi.string().required(),
  topic: Joi.string().min(3).max(30).required(),
  video_links: Joi.array().required(),
  video_category: Joi.string().required(),
  video_details: Joi.string().required(),
  price: Joi.number().required(),
});

export default videoSchema;
