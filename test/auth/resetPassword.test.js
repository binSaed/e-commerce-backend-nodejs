const app = require("../../src/app");
const User = require("../../src/models/user");
const request = require("supertest");
const emails = require("../../src/services/emails/emails");

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

describe("resetPassword", () => {
  test("should send resetPassword to email", async () => {
    emails.sendResetPassword = jest.fn();
    const response = await request(app)
      .post("/api/auth/resetPassword")
      .send(userData)
      .expect("Content-Type", /json/)
      .expect(200);

    const { body } = response;

    expect(body.status).toBe(true);

    expect(emails.sendResetPassword).toHaveBeenCalled();
  });
  test("should fail and not send resetPassword if email not found", async () => {
    userData.email = "notfound@gmail.com";
    emails.sendResetPassword = jest.fn();
    const response = await request(app)
      .post("/api/auth/resetPassword")
      .send(userData)
      .expect("Content-Type", /json/)
      .expect(422);

    const { body } = response;

    expect(body.status).toBe(false);

    expect(emails.sendResetPassword).toHaveBeenCalledTimes(0);
  });
});
describe("verifyResetPassword", () => {
  test("should get user token if resetPasswordToken is valid", async () => {
    emails.sendResetPassword = jest.fn();
    await request(app).post("/api/auth/resetPassword").send(userData);
    const {
      resetPasswordToken,
      code,
    } = emails.sendResetPassword.mock.calls[0][0];

    const response = await request(app)
      .get(
        `/api/auth/verifyResetPassword?resetPasswordToken=${resetPasswordToken}&code=${code}`
      )
      .expect("Content-Type", /json/)
      .expect(200);
    const { body } = response;
    expect(emails.sendResetPassword).toBeCalled();
    expect(body.status).toBe(true);
    expect(body.token).not.toBeNull();
  });
  test("should fail with wrong email", async () => {});
  test("should fail with wrong token and code", async () => {
    emails.sendResetPassword = jest.fn();
    await request(app).post("/api/auth/resetPassword").send(userData);
    const {
      resetPasswordToken,
      code,
    } = emails.sendResetPassword.mock.calls[0][0];

    const response = await request(app)
      .get(
        `/api/auth/verifyResetPassword?resetPasswordToken=${resetPasswordToken.replace(
          "a",
          "b"
        )}&code=${code}`
      )
      .expect("Content-Type", /json/)
      .expect(401);
    const { body } = response;

    expect(body.status).toBe(false);
  });
});
