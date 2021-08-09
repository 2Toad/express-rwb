import knex from "knex";
import { v4 as uuid } from "uuid";

import logger from "./logger";

class Db {
  /**
   * Initialize database connection
   * @param {*} config options for the database connection
   */
  async start(config) {
    if (this.instance) return;

    this.instance = knex({
      client: config.type,
      connection: {
        host: config.host,
        port: config.port,
        database: config.name,
        user: config.username,
        password: config.password,
        filename: "file:SQLiteExampleDb?mode=memory&cache=shared", // SQLite example
      },
      pool: {
        min: config.pool.min,
        max: config.pool.max,
      },
      useNullAsDefault: config.type === "sqlite",
      debug: config.logging,
    });

    // Since we are using connection pools, an initial connection will not be made until a
    // query is run against the database. We run the below query to test the connection
    logger.debug("Connecting to database...");
    await this.instance.schema.hasTable(uuid().replace(/-/g, ""));
    logger.info(`Connected to ${config.type} database ${config.host || ""} ${config.port || ""}`);
  }

  /**
   * Close all database connections
   */
  async stop() {
    if (!this.instance) return;

    await this.instance.destroy();
    this.instance = null;
  }
}

const db = new Db();
export default db;
