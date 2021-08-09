/* eslint-disable jest/no-done-callback */
import request from "supertest";

import server from "../src/server";

describe("echo POST", () => {
  it("should return 200", (done) => {
    const input = "Hello World";

    request(server.httpServer)
      .post("/example/echo")
      .send({ input })
      .expect(200)
      .expect((res) => expect(res.text === input))
      .end(done);
  });
});

describe("auth/test GET", () => {
  it("should return 403", (done) => {
    request(server.httpServer).get("/example/auth/test").expect(403, done);
  });
});
