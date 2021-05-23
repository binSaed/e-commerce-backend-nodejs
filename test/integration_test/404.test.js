const request = require("supertest");
const app = require("../../src/app");

const server = request(app);

describe("404", () => {
  test("should get 404 api not found", async (done) => {
    const response = await server
      .get("/randomRoute")
      .expect("Content-Type", /json/)
      .expect(404);

    const body = response.body;
    expect(body).toMatchObject({ status: false });
    done();
  });
});
