import Joi from "joi";

const bookingSchema = Joi.object({
  sessionId: Joi.string().required(),
  trainerId: Joi.string().required(),
});

export default bookingSchema;
