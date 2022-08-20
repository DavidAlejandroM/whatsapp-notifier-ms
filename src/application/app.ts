import express, {Application, urlencoded} from "express";
import dotenv from "dotenv";
import * as http from "http";
import * as expressWinston from "express-winston";
import cors from "cors";
import debug from "debug";
import morgan from "morgan";
import {LoggerOptions} from "./config/logger";
import {mongoConnection} from "../infrastructure/driven-adapters/mongo-repository/config/mongo-config";
import router from "../infrastructure/entry-points/rest/config/routes-config";

const app: Application = express();
const server: http.Server = http.createServer(app);
const debugLog: debug.IDebugger = debug("app");

dotenv.config();

app.use(express.json());
app.use(cors());
app.use(urlencoded({extended: true}));
app.use(morgan("dev"));
app.use(expressWinston.logger(LoggerOptions.getLoggerOptions()));
app.use(router)

server.listen(process.env.PORT, () =>
    console.info(`Server running at http://localhost: ${process.env.PORT}`));

mongoConnection();
