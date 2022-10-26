import Joi from "joi";

const reviewSchema = Joi.object({
  rating: Joi.number().required(),
  numReviews: Joi.number().required(),
  reviews: Joi.string().required(),
  duration: Joi.number().required(),
  session_type: Joi.string().required(),
  category: Joi.string().required(),
  details: Joi.string().min(5).max(30).required(),
  price: Joi.number().required(),
});

export default reviewSchema;
