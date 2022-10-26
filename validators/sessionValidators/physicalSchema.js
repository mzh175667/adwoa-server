import Joi from "joi";

const physicalSchema = Joi.object({
  lat: Joi.number().required(),
  lng: Joi.number().required(),
});

export default physicalSchema;
