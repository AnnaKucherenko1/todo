import Joi from "joi"

const todoSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  deadline: Joi.date().iso().required(),
});

export default todoSchema;