import cors from "cors";
import express from "express";
import { Request, Response } from "express";
import listEndpoints from "express-list-endpoints";

import { HttpStatusCode as httpStatusCodes } from "./libs/HttpStatusCode";
import { Logger } from "./libs/log";
import { routes } from "./routes";

import { IConfig } from "./interfaces/config";
const config: IConfig = require("../config/config.json");

const { version } = require("../package.json");

const app = express();

app.use(cors({ origin: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Heartbeat
app.use("/ping", (_: Request, res: Response) => {
  res.status(httpStatusCodes.OK).end();
});

app.use("/api", routes);

// 404 Catcher
// app.use((_: Request, res: Response) => {
//   res.status(httpStatusCodes.NOT_FOUND).end();
// });

// Error Catcher
// app.use((err: Error, _: Request, res: Response) => {
//   res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).send(err);
// });

app.listen(config.server.port, config.server.host, () => {
  console.clear();
  console.log("Server working");
  Logger.log(
    `Backend v${version} is running: http://${config.server.host}:${config.server.port}`
  );
  console.log(listEndpoints(app));
});
