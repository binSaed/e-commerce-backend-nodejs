const request = require("supertest");
const app = require("../../../src/app");
const Category = require("../../../src/models/category");
const Item = require("../../../src/models/item");
const TokenUtils = require("../../uitils/tokenUtils");

jest.mock("multer", () => () => {
  return {
    array: jest.fn(() => (req, res, next) => next()),
    single: jest.fn(() => {
      return (req, res, next) => {
        req.body = {
          name: { en: "categoryName", ar: "categoryName" },
        };
        console.log("mockImplementation2", req.body);
        req.file = {
          imageHash: "sample.name",
          link: "sample.type",
          deletehash: "sample.url",
        };
        return next();
      };
    }),
  };
});

const server = request(app);
const category = {
  name: { en: "categoryName", ar: "categoryName" },
};

beforeEach(async () => {
  await Category.deleteMany();
  await Item.deleteMany();
});

beforeAll(async () => {});
afterAll(async () => {
  jest.resetAllMocks();
});

describe("addCategoryUploadImage", () => {
  test("should create category with image if user upload image", async () => {
    const response = await server
      .post(`/api/category/add`)
      .field("name", JSON.stringify(category.name))
      .attach("image", "test/fixtures/keys_bg.png")
      .set("Connection", "keep-alive")
      .set("Authorization", `Bearer ${await TokenUtils.ownerUserToken()}`)
      .expect("Content-Type", /json/)
      .expect(200);

    const body = response.body;
    console.log(body);
    expect(body.status).toBeTruthy();
  });

  test("should not create category when token expired (Unauthorized)", async () => {
    const response = await server
      .post(`/api/category/add`)
      .field("name", JSON.stringify(category.name))
      .attach("image", "test/fixtures/keys_bg.png")
      .set("Connection", "keep-alive")
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
      .field("name", JSON.stringify(category.name))
      .attach("image", "test/fixtures/keys_bg.png")
      .set("Connection", "keep-alive")
      .set("Authorization", `Bearer ${await TokenUtils.userToken()}`)
      .expect("Content-Type", /json/)
      .expect(403);
    const body = response.body;

    expect(body.status).toBeFalsy();
    expect(body).toHaveProperty("message");

    const categories = await Category.find();
    expect(categories.length).toBe(0);
  });
});
