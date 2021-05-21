const app = require("../../../src/app");
const User = require("../../../src/models/user");
const request = require("supertest");

let userData = {
  email: "me@abdosaed.ml",
  password: "abdo1234",
  name: "abdelrahman",
  phone: "01151034858",
};
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
});
afterEach(async () => {
  await User.deleteMany();
});

describe("register", () => {
  test("should fail register when body not send", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .expect("Content-Type", /json/)

      .expect(422);

    const { body } = response;

    expect(body.status).toBe(false);

    const emailNotValid = body.message
      .toString()
      .toLowerCase()
      .includes("email");
    expect(emailNotValid).toBe(true);
  });
  test("should fail register when body with not valid pram", async () => {
    userData.email = "abdo.ml";
    userData.password = "1234";
    userData.name = "al";
    const response = await request(app)
      .post("/api/auth/register")
      .send(userData)
      .expect("Content-Type", /json/)

      .expect(422);

    const { body } = response;

    expect(body.status).toBe(false);

    const emailNotValid = body.message
      .toString()
      .toLowerCase()
      .includes("email");
    const nameNotValid = body.message
      .toString()
      .toLowerCase()
      .includes("param name");
    const passwordNotValid = body.message
      .toString()
      .toLowerCase()
      .includes("param password");
    expect(emailNotValid).toBe(true);
    expect(nameNotValid).toBe(true);
    expect(passwordNotValid).toBe(true);
  });
  test("should register new user", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send(userData)
      .expect("Content-Type", /json/)
      .expect(200);

    const body = response.body;

    expect(body.status).toBe(true);

    expect(userData.name).toBe(body.user.name);
    expect(userData.email).toBe(body.user.email);
    expect(body.token.toString().split(".").length).toBe(3);
  });
  test("should fail register when email used before", async () => {
    await request(app).post("/api/auth/register").send(userData);
    const response = await request(app)
      .post("/api/auth/register")
      .send(userData)
      .expect("Content-Type", /json/)

      .expect(422);

    const { body } = response;

    expect(body.status).toBe(false);

    const emailNotValid = body.message
      .toString()
      .toLowerCase()
      .includes("email");
    expect(emailNotValid).toBe(true);
  });
  test("should not save fcmToken if it empty", async () => {
    const user = { ...userData };
    const response = await request(app)
      .post("/api/auth/register")
      .send(user)
      .expect("Content-Type", /json/)
      .expect(200);
    const { body } = response;
    const userInDB = await User.findById(body.user._id);

    expect(body.status).toBe(true);

    expect(userInDB.fcmTokens.length).toBe(0);
  });
  test("should save fcmToken if it not empty", async () => {
    const user = { ...userData, fcmToken: "token" };
    const response = await request(app)
      .post("/api/auth/register")
      .send(user)
      .expect("Content-Type", /json/)
      .expect(200);
    const { body } = response;
    const userInDB = await User.findById(body.user._id);

    expect(body.status).toBe(true);

    expect(userInDB.fcmTokens.length).toBe(1);
    expect(userInDB.fcmTokens[0]).toEqual(user.fcmToken);
  });
});
