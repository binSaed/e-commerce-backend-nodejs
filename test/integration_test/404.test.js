const request = require("supertest");
const app = require("../../src/app");

test("should get 404 api not found", async () => {
    const response = await request(app)
        .get("/randomRoute")
        .expect("Content-Type", /json/)
        .expect(404);
    const body = response.body;

    expect(body).toMatchObject({status: false});
});
