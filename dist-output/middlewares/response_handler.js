import createHttpError from "http-errors";
export const ERROR_MESSAGES = {
    INVALID_PARAMETERS: {
        status: 400,
        message: "The parameters sent are incorrect",
    },
    NO_EXIST_ON_DATABASE: {
        status: 204,
        message: "The item does not exist in the database",
    },
    EXIST_ON_DATABASE: {
        status: 400,
        message: "It already exists in the database",
    },
    FAILED_UPLOAD_IMAGE: {
        status: 500,
        message: "Error processing the image on the server or database",
    },
    EMPTY_RESPONSE: {
        status: 204,
        message: "The request has not taken effect on the server",
    },
    ORDER_NOT_EXIST: {
        status: 404,
        message: "The requested payment does not exist",
    },
    UNEXPECTED_ERROR: {
        status: 500,
        message: "Error inesperado",
    },
};
export function errorHandler(err, req, res) {
    return res.status(err.status || 500).send({
        status: "failed",
        message: err.message,
    });
}
export function successHandler(message, req, res) {
    return res.status(200).send(message);
}
export const handleErrorMessage = (err, req, res) => {
    const message = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ message });
};
export function errorNotFound(req, res, next) {
    next(createHttpError(404, res.status));
}
