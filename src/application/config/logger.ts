import * as expressWinston from "express-winston";
import * as winston from "winston";

export class LoggerOptions {
  static getLoggerOptions(): expressWinston.LoggerOptions {
    const logger: expressWinston.LoggerOptions = {
      transports: [new winston.transports.Console()],
      format: winston.format.combine(
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.colorize({ all: true })
      ),
    };

    if (!process.env.DEBUG) {
      logger.meta = false; // when not debugging, log requests as one-liners
    }
    
    return logger;
  }
}