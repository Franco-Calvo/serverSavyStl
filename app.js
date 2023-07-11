import express from "express";
import { default as morgan } from "morgan";
import path from "path";
import "./config/database.js";
import { errorHandler, errorNotFound } from "./middlewares/error.js";
import indexRouter from "./routes/index.routes.js";
import { __dirname } from "./utils.js";
import cors from "cors";

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/", indexRouter);
app.use(errorNotFound);
app.use(errorHandler);

export default app;
