import Joi from "joi";
const subscriptionSchema = Joi.object({
    user: Joi.string().required().messages({
        "any.required": "El campo 'user' es requerido.",
    }),
    subscriptionType: Joi.string()
        .valid("day", "month", "year")
        .required()
        .messages({
        "any.required": "El campo 'subscriptionType' es requerido.",
        "any.only": "El campo 'subscriptionType' debe ser 'day', 'month' o 'year'.",
    }),
    startDate: Joi.date().required().messages({
        "any.required": "El campo 'startDate' es requerido.",
    }),
    endDate: Joi.date().required().messages({
        "any.required": "El campo 'endDate' es requerido.",
    }),
});
export default subscriptionSchema;
