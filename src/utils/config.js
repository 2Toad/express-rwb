import dotenv from "dotenv";
import path from "path";
import Joi from "joi";

dotenv.config({ path: path.join(path.resolve(), ".env") });

// Define the schema for our configuration
const schema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid("local", "development", "test", "production").required(),
    SERVER_PORT: Joi.number().default(3000),
    SERVER_HEARTBEAT_INTERVAL: Joi.number().default(2500),
    SERVER_HEARTBEAT_THRESHOLD: Joi.number().default(2),
    LOGGER_SLACK_WEBHOOK: Joi.string(),
    LOGGER_SLACK_LEVEL: Joi.string().default("error"),
    DB_TYPE: Joi.string(),
    DB_HOST: Joi.string(),
    DB_PORT: Joi.number(),
    DB_NAME: Joi.string(),
    DB_USERNAME: Joi.string(),
    DB_PASSWORD: Joi.string(),
    DB_POOL_MIN: Joi.number().default(1),
    DB_POOL_MAX: Joi.number().default(10),
    DB_LOGGING: Joi.boolean().default(process.env.NODE_ENV === "local"),
  })
  .unknown();

// Validate our config schema against available environment variables, and set defaults if the
// environment variable doesn't exist
const { value: envVars, error } = schema.prefs({ errors: { label: "key" } }).validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// Create a config object using environment variables defaults from the schema
const config = {
  env: envVars.NODE_ENV,
  server: {
    port: envVars.SERVER_PORT,
    heartbeat: {
      interval: envVars.SERVER_HEARTBEAT_INTERVAL,
      threshold: envVars.SERVER_HEARTBEAT_THRESHOLD,
    },
  },
  logger: {
    slack: {
      webhook: envVars.LOGGER_SLACK_WEBHOOK,
      level: envVars.LOGGER_SLACK_LEVEL,
    },
  },
  database: {
    type: envVars.DB_TYPE,
    host: envVars.DB_HOST,
    port: envVars.DB_PORT,
    name: envVars.DB_NAME,
    username1: envVars.DB_USERNAME,
    password: envVars.DB_PASSWORD,
    pool: {
      min: envVars.DB_POOL_MIN,
      max: envVars.DB_POOL_MAX,
    },
    logging: envVars.DB_LOGGING,
  },
};

export default config;
