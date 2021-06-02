const request = require("supertest");
const app = require("../../../src/app");
const Category = require("../../../src/models/category");
const Item = require("../../../src/models/item");
const TokenUtils = require("../../uitils/tokenUtils");

const server = request(app);
const category = {
  name: { en: "categoryName", ar: "categoryName" },
};
const categoryWithoutArIntel = { name: { en: "categoryName" } };
const categoryWithoutEnIntel = { name: { ar: "categoryName" } };

beforeEach(async () => {
  await Category.deleteMany();
  await Item.deleteMany();
});

beforeAll(async () => {});
afterAll(async () => {
  jest.resetAllMocks();
});

describe("addCategory", () => {
  test("should create category when user has access", async () => {
    const response = await server
      .post(`/api/category/add`)
      .send(category)
      .set("Authorization", `Bearer ${await TokenUtils.ownerUserToken()}`)
      .expect("Content-Type", /json/)
      .expect(200);
    const body = response.body;

    expect(body.status).toBeTruthy();

    const categories = await Category.find();

    expect(
      JSON.stringify(category.name).includes(categories[0].name)
    ).toBeTruthy();
  });

  test("should not create category when token expired (Unauthorized)", async () => {
    const response = await server
      .post(`/api/category/add`)
      .send(category)
      .set("Authorization", `Bearer ${await TokenUtils.expiredOwnerToken()}`)
      .expect("Content-Type", /json/)
      .expect(401);
    const body = response.body;

    expect(body.status).toBeFalsy();
    expect(body).toHaveProperty("message");

    const categories = await Category.find();
    expect(categories.length).toBe(0);
  });
  test("should not create category when user hasn't access (Forbidden)", async () => {
    const response = await server
      .post(`/api/category/add`)
      .send(category)
      .set("Authorization", `Bearer ${await TokenUtils.userToken()}`)
      .expect("Content-Type", /json/)
      .expect(403);
    const body = response.body;

    expect(body.status).toBeFalsy();
    expect(body).toHaveProperty("message");

    const categories = await Category.find();
    expect(categories.length).toBe(0);
  });
  test("should not create category when user not send data", async () => {
    const response = await server
      .post(`/api/category/add`)
      .set("Authorization", `Bearer ${await TokenUtils.ownerUserToken()}`)
      .expect("Content-Type", /json/)
      .expect(422);
    const body = response.body;

    expect(body.status).toBeFalsy();
    expect(body).toHaveProperty("message");

    const categories = await Category.find();
    expect(categories.length).toBe(0);
  });
  test("should not create category when data not valid", async () => {
    const response1 = await server
      .post(`/api/category/add`)
      .send(categoryWithoutArIntel)
      .set("Authorization", `Bearer ${await TokenUtils.ownerUserToken()}`)
      .expect("Content-Type", /json/)
      .expect(422);
    const body1 = response1.body;

    expect(body1.status).toBeFalsy();
    expect(body1).toHaveProperty("message");

    const categories1 = await Category.find();
    expect(categories1.length).toBe(0);

    const response2 = await server
      .post(`/api/category/add`)
      .send(categoryWithoutEnIntel)
      .set("Authorization", `Bearer ${await TokenUtils.ownerUserToken()}`)
      .expect("Content-Type", /json/)
      .expect(422);
    const body2 = response2.body;

    expect(body2.status).toBeFalsy();
    expect(body2).toHaveProperty("message");

    const categories2 = await Category.find();
    expect(categories2.length).toBe(0);
  });
});
