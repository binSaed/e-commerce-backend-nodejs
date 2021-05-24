const request = require("supertest");
const app = require("../../../src/app");
const Category = require("../../../src/models/category");

const server = request(app);

beforeEach(() => {});
beforeAll(async () => {
  await Category.deleteMany();
});

describe("getCategories", () => {
  test("should return empty list if no Categories", async () => {
    const response = await server
      .get("/api/category/getAll")
      .expect("Content-Type", /json/)
      .expect(200);

    const body = response.body;

    expect(body.status).toBe(true);
    expect(body.categories).toBeInstanceOf(Array);
    expect(body.categories.length).toBe(0);
  });
  test("should return list of Categories if it has", async () => {
    const category = new Category({
      name: { en: "categoryName", ar: "categoryName" },
    });
    await category.save();

    const response = await server
      .get("/api/category/getAll")
      .expect("Content-Type", /json/)
      .expect(200);

    const { body } = response;

    expect(body.status).toBe(true);
    expect(body.categories).toBeInstanceOf(Array);
    expect(body.categories.length).toBe(1);
  });
});
