import Joi from "joi";
const ticketSchema = Joi.object({
    title: Joi.string().messages({
        "any.required": "El campo 'title' es requerido.",
    }),
    message: Joi.string().required().messages({
        "any.required": "El campo 'message' es requerido.",
    }),
    status: Joi.string()
        .valid("open", "approved", "rejected", "closed")
        .messages({
        "any.required": "El campo 'status' es requerido.",
        "any.only": "El campo 'status' debe ser 'open', 'approved', 'rejected' o 'closed'.",
    }),
    userId: Joi.string().required().messages({
        "any.required": "El campo 'user' es requerido.",
    }),
    messages: Joi.array().items(Joi.object({
        sender: Joi.string().valid("client", "designer").required().messages({
            "any.required": "El campo 'sender' es requerido.",
            "any.only": "El campo 'sender' debe ser 'client' o 'designer'.",
        }),
        message: Joi.string().required().messages({
            "any.required": "El campo 'message' es requerido.",
        }),
        timestamp: Joi.date().default(Date.now).required().messages({
            "any.required": "El campo 'timestamp' es requerido.",
        }),
    })),
});
export default ticketSchema;
