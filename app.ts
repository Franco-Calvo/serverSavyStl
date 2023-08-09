import express from "express";
import { default as morgan } from "morgan";
import http from "http";
import path from "path";
import "./config/database.js";
import indexRouter from "./routes/index.routes.js";
import { __dirname } from "./utils.js";
import cors from "cors";
import { errorHandler, errorNotFound } from "./middlewares/response_handler.js";
import { logRequest } from "./logger.js";
import { initializeSocket } from "./config/socket.js";

const app = express();
const server = http.createServer(app);
initializeSocket(server);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logRequest);
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/", indexRouter);
app.use(errorNotFound);
app.use(errorHandler);

export default app;
