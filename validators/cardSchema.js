import Joi from "joi";

const categorySchema = Joi.object({
  card_number: Joi.number().required().min(12).max(12),
  exp_month: Joi.number().required().min(2).max(2),
  exp_year: Joi.number().required().min(2).max(4),
  cvc: Joi.number().required().min(3).max(4),
});

export default categorySchema;
