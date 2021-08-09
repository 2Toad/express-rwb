import express from "express";
import http from "http";
import WebSocket from "ws";
import { v4 as uuid } from "uuid";
import helmet from "helmet";
import xss from "xss-clean";
import compression from "compression";
import cors from "cors";

import * as controllers from "./controllers";
import logger from "./utils/logger";
import Heartbeat from "./heartbeat";
import { ServerStatus } from "./enums";
import morgan from "./middleware/morgan";

class Server {
  constructor() {
    this.status = ServerStatus.Stopped;
    this.express = express();

    this.express.use(helmet());
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(xss());
    this.express.use(compression());
    this.express.use(cors());
    this.express.options("*", cors());
    this.express.use(morgan.infoLogger);
    this.express.use(morgan.errorLogger);

    this.httpServer = http.createServer(this.express);
    this.httpServer.on("close", async () => {
      this.status = ServerStatus.Stopped;
      logger.info("Server stopped");
    });

    this.webServerInit();
    this.webSocketServerInit();
  }

  /**
   * Start listening for HTTP requests and start accepting WebSocket connections
   * @param {number} port the port to listen for HTTP requests on
   */
  async start(port) {
    if (this.status !== ServerStatus.Stopped) {
      return;
    }
    this.status = ServerStatus.Starting;

    this.httpServer.listen(port);
    logger.info(`Server listening on: ${port}`);

    this.status = ServerStatus.Started;
  }

  /**
   * Closes all existing HTTP requests and WebSocket connections, and stop listening for
   * HTTP requests and stop accepting WebSocket connections
   */
  async stop() {
    if (this.status !== ServerStatus.Started) {
      return;
    }
    this.status = ServerStatus.Stopping;

    await new Promise((resolve) => {
      this.httpServer.close(resolve);
    });
  }

  /**
   * Terminate an incoming connection
   * @param {*} socket the WebSocket to close
   * @param {string} reason the reason for terminating the connection
   */
  terminateIncomingConnection(socket, reason) {
    logger.warn(`Incoming connection terminated: ${reason}`);
    socket.terminate();
  }

  /**
   * Initialize the HTTP server
   */
  webServerInit() {
    logger.debug("Server: Adding controllers...");

    Object.keys(controllers).forEach((key) => {
      // eslint-disable-next-line no-new
      new controllers[key](this.express);
    });
  }

  /**
   * Initialize the WebSocket server
   */
  webSocketServerInit() {
    const webSocketServer = new WebSocket.Server({ server: this.httpServer });

    webSocketServer.on("connection", (socket, incoming) => {
      const sessionId = uuid();
      logger.info(`[${sessionId}] WebSocket connected - URL: ${incoming.url}`);

      const heartbeat = new Heartbeat(socket);
      heartbeat.start();

      socket.on("message", (message) => {
        logger.info(`[${sessionId}] WebSocket message: ${message}`);
      });

      socket.on("close", () => {
        heartbeat.stop();
        logger.info(`[${sessionId}] WebSocket closed`);
      });
    });
  }
}

export default new Server();
