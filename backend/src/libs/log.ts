/**
 * Logs to files under /logs and to console.
 * Logs are rotating every 30 days and get zipped.
 */

import winston from "winston";
import WinstonDailyRotateFile from "winston-daily-rotate-file";
const { version } = require("../../package.json");

export type Level = "info" | "error";

const winstonTransport = new WinstonDailyRotateFile({
  filename: "%DATE%.log",
  dirname: "src/logs",
  level: "info",
  maxFiles: 30,
  zippedArchive: true,
});
winston.loggers.add("mainLogger", {
  format: winston.format.combine(
    winston.format.timestamp({ format: "DD.MM.YYYY HH:mm" }),
    winston.format.align(),
    winston.format.printf(
      (info) => `${info.timestamp} [${info.level}] ${info.message}`
    )
  ),
  transports: [
    winstonTransport,
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: "DD.MM.YYYY HH:mm" }),
        winston.format.printf(
          (info) => `${info.timestamp} [${info.level}] ${info.message}`
        )
      ),
    }),
  ],
});

export class Logger {
  private static logger = winston.loggers.get("mainLogger");

  static log = (msg: string, level?: Level) => {
    const _level: Level =
      level !== undefined && level !== null ? level : "info";
    Logger.logger.log(_level, `[v${version}] ${msg}`);
  };
}
