import config from "./utils/config";
import logger from "./utils/logger";
import server from "./server";
import db from "./utils/database";

const init = async () => {
  // Log unhandled exceptions
  ["uncaughtException", "unhandledRejection"].forEach((event) => {
    process.on(event, (error) => logger.error(error));
  });

  // Exit gracefully when a shutdown signal is received
  ["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) => {
    process.on(signal, async () => {
      logger.info(`${signal} received: shutting down...`);

      await server.stop();
      await db.stop();

      process.exit(0);
    });
  });

  await db.start(config.database);
  await server.start(config.server.port);
};

init();
