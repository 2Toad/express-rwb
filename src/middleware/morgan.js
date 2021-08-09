import morgan from "morgan";
import httpStatus from "http-status";

import config from "../utils/config";
import logger from "../utils/logger";

const getRemoteAddress = () => (config.env === "production" ? ":remote-addr - " : "");
const template = `${getRemoteAddress()}:method :url :status - :response-time ms`;

/**
 * Logs all HTTP requests with Status Codes < 400 as info
 */
const infoLogger = morgan(template, {
  skip: (_req, res) => res.statusCode >= httpStatus.BAD_REQUEST,
  stream: { write: (message) => logger.info(message.trim()) },
});

/**
 * Logs all HTTP requests with Status Codes >= 400 as error
 */
const errorLogger = morgan(template, {
  skip: (_req, res) => res.statusCode < httpStatus.BAD_REQUEST,
  stream: { write: (message) => logger.error(message.trim()) },
});

export default {
  infoLogger,
  errorLogger,
};
