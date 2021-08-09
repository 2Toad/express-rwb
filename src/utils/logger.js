import winston from "winston";
import SlackHook from "winston-slack-webhook-transport";
import config from "./config";

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const getTransports = () => {
  const output = [];

  output.push(
    new winston.transports.Console({
      stderrLevels: ["error"],
    })
  );

  if (config.logger.slack.webhook) {
    const transport = new SlackHook({
      webhookUrl: config.logger.slack.webhook,
      level: config.logger.slack.level,
    });

    output.push(transport);
  }

  return output;
};

const logger = winston.createLogger({
  level: config.env === "local" ? "debug" : "info",
  format: winston.format.combine(
    enumerateErrorFormat(),
    config.env === "local" ? winston.format.colorize() : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.printf(({ level, message }) => `${level}: ${message}`)
  ),
  exitOnError: () => config.env === "local",
  transports: getTransports(),
});

export default logger;
