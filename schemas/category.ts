import Joi from "joi";

const schema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "El nombre no puede quedar vacío",
    "any.required": "El nombre es requerido",
  }),
});

export default schema;
