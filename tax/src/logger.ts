
import { createLogger, format, transports } from "winston";
import path from "path";

export const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`)
  ),
  transports: [
    new transports.File({ filename: path.join("logs", "error.log"), level: "error" }),
    new transports.File({ filename: path.join("logs", "combined.log") })
  ]
});
