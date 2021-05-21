const request = require("supertest");
const app = require("../../../src/app");
const User = require("../../../src/models/user");

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
  const user = await new User(userData).save();
});
describe("login", () => {
  test("login should be fail when body not send", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .expect("Content-Type", /json/)
      .expect(422);
    const { body } = response;
    expect(body.status).toBe(false);
  });
  test("login should be fail when body with not valid pram", async () => {
    userData.email = "abdo.ml";
    userData.password = "1234";
    const response = await request(app)
      .post("/api/auth/login")
      .send(userData)
      .expect("Content-Type", /json/)
      .expect(422);

    const { body } = response;

    expect(body.status).toBe(false);

    expect(body.message).toContain("email");
    expect(body.message).toContain("param password");
  });
  test("login should be fail when email not found", async () => {
    userData.email = "wrongEmail";
    const response = await request(app)
      .post("/api/auth/login")
      .send(userData)
      .expect("Content-Type", /json/)
      .expect(422);

    const { body } = response;

    expect(body.status).toBe(false);
  });
  test("login should be fail when wrong password", async () => {
    userData.password = "wrongPassword";
    const response = await request(app)
      .post("/api/auth/login")
      .send(userData)
      .expect("Content-Type", /json/)
      .expect(422);

    const { body } = response;

    expect(body.status).toBe(false);
  });
  test("should login", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send(userData)
      .expect("Content-Type", /json/)
      .expect(200);

    const { body } = response;

    expect(body.status).toBe(true);

    expect(userData.name).toBe(body.user.name);
    expect(userData.email).toBe(body.user.email);
    expect(body.token.toString().split(".").length).toBe(3);
  });

  test("should save fcmToken when login", async () => {
    const user = { ...userData, fcmToken: "token" };

    const response = await request(app)
      .post("/api/auth/login")
      .send(user)
      .expect("Content-Type", /json/)
      .expect(200);

    const { body } = response;

    expect(body.status).toBe(true);

    const userInDB = await User.findById(body.user._id);

    expect(body.status).toBe(true);

    expect(userInDB.fcmTokens.length).toBe(1);
    expect(userInDB.fcmTokens[0]).toEqual(user.fcmToken);
  });
  test("should save fcmToken when login without duplicate", async () => {
    const user = { ...userData, fcmToken: "token" };
    await request(app).post("/api/auth/login").send(user);
    const response = await request(app)
      .post("/api/auth/login")
      .send(user)
      .expect("Content-Type", /json/)
      .expect(200);

    const { body } = response;

    expect(body.status).toBe(true);

    const userInDB = await User.findById(body.user._id);

    expect(body.status).toBe(true);

    expect(userInDB.fcmTokens.length).toBe(1);
  });
});
