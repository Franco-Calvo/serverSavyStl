const validator = (schema) => [
    (req, res, next) => {
        const validation = schema.validate(req.body, { abortEarly: false });
        if (validation.error) {
            return res.status(400).json({
                success: false,
                message: validation.error.details.map((error) => {
                    switch (error.type) {
                        case "string.email":
                            return "Debes colocar un email válido";
                        default:
                            return error.message;
                    }
                }),
            });
        }
        return next();
    },
];
export default validator;
