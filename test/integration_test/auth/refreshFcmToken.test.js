const request = require("supertest");
const app = require("../../../src/app");
const User = require("../../../src/models/user");

const server = request(app);

let userData = {
  email: "me@abdosaed.ml",
  password: "abdo1234",
  name: "abdelrahman",
  phone: "01151034858",
};
let token;
const wrongToken = () => token.replace("a", "b"); //to be wrong token
beforeAll(async () => {
  await User.deleteMany();
  const user = await new User(userData).save();
  token = await user.generateJWT();
});

describe("refreshFcmToken", () => {
  test("should fail not valid token", async () => {
    const response = await server
      .post("/api/auth/refreshFcmToken")
      .set("Authorization", `Bearer ${wrongToken()}`)
      .expect("Content-Type", /json/)
      .expect(401);

    const { body } = response;

    expect(body.status).toBe(false);
  });

  test("should success valid fcmToken", async () => {
    const response = await server
      .post("/api/auth/refreshFcmToken")
      .send({ fcmToken: "fcmToken1234" })
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", /json/)
      .expect(200);

    const { body } = response;

    expect(body.status).toBe(true);
  });

  test("should fail not valid fcmToken", async () => {
    //valid fcmToken Length up to 8
    const response = await server
      .post("/api/auth/refreshFcmToken")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", /json/)
      .expect(422);

    const { body } = response;

    expect(body.status).toBe(false);
  });
});
