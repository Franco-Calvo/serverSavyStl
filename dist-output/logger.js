import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsDirectory = path.join(__dirname, "logs"); // Ruta del directorio logs
const logFilePath = path.join(logsDirectory, "server_logs.txt"); // Ruta del archivo de logs
// Función para crear el directorio logs si no existe
const createLogsDirectoryIfNotExists = () => {
    if (!fs.existsSync(logsDirectory)) {
        fs.mkdirSync(logsDirectory);
    }
};
export const logRequest = (req, res, next) => {
    const { method, url, headers } = req;
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp} - ${method} ${url} - ${JSON.stringify(headers)}\n`;
    createLogsDirectoryIfNotExists(); // Crear el directorio logs si no existe
    fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) {
            console.error("Error writing to log file:", err);
        }
    });
    next();
};
export default { logRequest };
