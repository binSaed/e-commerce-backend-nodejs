const request = require("supertest");
const nodemailer = require("nodemailer");
const app = require("../../../src/app");
const User = require("../../../src/models/user");
const emails = require("../../../src/services/emails/emails");

const server = request(app);

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

describe("reSendConfirmEmail", () => {
  test("should send email", async () => {
    const sendMail = jest.fn().mockResolvedValue("done");
    nodemailer.createTransport = jest.fn().mockReturnValue({ sendMail });
    const response = await server
      .post("/api/auth/reSendConfirmEmail")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", /json/)
      .expect(200);

    const { body } = response;

    expect(body.status).toBe(true);
    expect(nodemailer.createTransport).toHaveBeenCalled();
  });
  test("should fail to send email not valid token", async () => {
    nodemailer.createTransport = jest.fn();
    const response = await server
      .post("/api/auth/reSendConfirmEmail")
      .set("Authorization", `Bearer ${wrongToken}`)
      .expect("Content-Type", /json/)
      .expect(401);

    const { body } = response;

    expect(body.status).toBe(false);
    expect(nodemailer.createTransport).toBeCalledTimes(0);
  });
});
describe("verifyEmail", () => {
  test("should set emailVerified to true", async () => {
    emails.sendConfirmEmail = jest.fn();
    await server
      .post("/api/auth/reSendConfirmEmail")
      .set("Authorization", `Bearer ${token}`);
    const { confirmEmailToken, code } =
      emails.sendConfirmEmail.mock.calls[0][0];

    const response = await server
      .get(
        `/api/auth/verifyEmail?confirmEmailToken=${confirmEmailToken}&code=${code}`
      )
      .expect("Content-Type", /json/)
      .expect(200);
    const { body } = response;

    expect(body.status).toBe(true);
    expect(body.user.emailVerified).toBe(true);
  });
  test("should fail with wrong token", async () => {
    emails.sendConfirmEmail = jest.fn();
    await server
      .post("/api/auth/reSendConfirmEmail")
      .set("Authorization", `Bearer ${wrongToken()}`)
      .expect(401);

    expect(emails.sendConfirmEmail).toBeCalledTimes(0);
  });
});
