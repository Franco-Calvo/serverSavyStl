/**
 * @schema es el schema de validacion de joi (es necesario importar el schema en el archivo donde se ejecute el middleware)
 * @validate es un método de joi para validar los datos del schema
 * requiere que invoquemos el schema de validacion y necesita dos parámetros para funcionar
 * req.body es el objeto que envía el usuario del formulario
 * { abortEarly:false }  es la configuracion necesaria para que se envíen todos los errores de validacion del formulario
 */
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
