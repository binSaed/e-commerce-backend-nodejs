const app = require("../../src/app");
const User = require("../../src/models/user");
const request = require("supertest");

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

describe("updateProfile", () => {
  test("should update the user with valid data", async () => {
    const newName = "newname";
    const newEmail = "newemail";
    const newPhone = "newphone";
    const response = await request(app)
      .put("/api/auth/updateProfile")
      .set("Authorization", `Bearer ${token}`)
      .field("name", newName)
      .field("email", newEmail)
      .field("phone", newPhone)
      .expect("Content-Type", /json/)
      .expect(200);

    const { body } = response;
    expect(body.status).toBe(true);

    const { user } = body;
    expect(user.email).toEqual(newEmail);
    expect(user.name).toEqual(newName);
    expect(user.phone).toEqual(newPhone);
  });
  test("should be fail update the user with wrong token", async () => {
    const response = await request(app)
      .put("/api/auth/updateProfile")
      .set("Authorization", `Bearer ${wrongToken()}`)
      .expect("Content-Type", /json/)
      .expect(401);

    const { body } = response;
    expect(body.status).toBe(false);
  });
});
