const request = require("supertest");
const app = require("../../../src/app");
const User = require("../../../src/models/user");

let userData = {
  email: "me@abdosaed.ml",
  password: "abdo1234",
  name: "abdelrahman",
  phone: "01151034858",
};
let token;
const wrongToken = () => token.replace("a", "b"); //to be wrong token
beforeEach(() => {
  userData = {
    email: "me@abdosaed.ml",
    password: "abdo1234",
    name: "abdelrahman",
    phone: "01151034858",
  };
});
beforeAll(async () => {
  await User.deleteMany();
  const user = await new User(userData).save();
  token = await user.generateJWT();
});

describe("profile", () => {
  test("should return user profile", async () => {
    const response = await request(app)
      .post("/api/auth/profile")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", /json/)
      .expect(200);

    const body = response.body;

    expect(body.status).toBe(true);

    expect(userData.name).toBe(body.user.name);
    expect(userData.email).toBe(body.user.email);
  });
  test("should fail not valid token", async () => {
    const response = await request(app)
      .post("/api/auth/profile")
      .set("Authorization", `Bearer ${wrongToken()}`)
      .expect("Content-Type", /json/)
      .expect(401);

    const { body } = response;

    expect(body.status).toBe(false);
  });
});
