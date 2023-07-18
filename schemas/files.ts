import Joi from "joi";

const schema = Joi.object({
  name: Joi.string().required().min(3).max(20).messages({
    "string.min": "El nombre debe contener al menos 3 caracteres",
    "string.max": "El nombre puede contener como máximo 20 caracteres",
    "string.empty": "El nombre no puede quedar vacío",
    "any.required": "El nombre es requerido",
  }),
  price: Joi.number().required().min(1).messages({
    "number.min": "El precio debe ser como mínimo 1",
    "number.empty": "El precio no puede quedar vacío",
    "any.required": "El precio es requerido",
  }),
  image: Joi.string().required().min(8).uri().messages({
    "string.min": "La url debe contener al menos 8 caracteres",
    "string.empty": "La imagen no puede quedar vacía",
    "any.required": "La imagen es requerida",
    "string.uri": "Debes introducir una URL válida",
  }),
  category: Joi.string().required().min(3).max(20).messages({
    "string.min": "La categoría debe contener como mínimo 3 caracteres",
    "string.max": "La categoría no puede contener más de 20 caracteres",
    "string.empty": "La categoría no puede quedar vacía",
    "any.required": "La categoría es requerida",
  }),
  description: Joi.string().required().min(20).max(200).messages({
    "string.min": "La descripción debe contener al menos 20 caracteres",
    "string.max": "La descripción no puede contener más de 200 caracteres",
    "string.empty": "La descripción no puede quedar en blanco",
    "any.required": "La descripción es requerida",
  }),
});

export default schema;
