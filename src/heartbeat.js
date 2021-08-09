import WebSocket from "ws";

import config from "./utils/config";
import logger from "./utils/logger";

export default class Heartbeat {
  constructor(webSocket) {
    this.pingCount = 0;
    this.webSocket = webSocket;

    this.webSocket.on("pong", () => {
      this.pingCount = 0;
    });
    this.webSocket.on("close", () => this.stop());
  }

  /**
   * Start the heartbeat: send a ping to the client every SERVER_HEARTBEAT_INTERVAL and
   * disconnect the client if the SERVER_HEARTBEAT_THRESHOLD is ever reached
   */
  start() {
    const { interval, threshold } = config.server.heartbeat;

    this.timer = setInterval(() => {
      if (this.pingCount >= threshold || this.webSocket.readyState !== WebSocket.OPEN) {
        logger.info("Unresponsive WebSocket terminated");
        this.webSocket.terminate();
        return;
      }

      this.webSocket.ping();
      this.pingCount += 1;
    }, interval);
  }

  /**
   * Stop the heartbeat
   */
  stop() {
    clearInterval(this.timer);
  }
}
