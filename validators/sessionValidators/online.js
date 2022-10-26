import Joi from "joi";

const onlineSchema = Joi.object({
  meetingLink: Joi.string().required(),
});

export default onlineSchema;
