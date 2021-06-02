const request = require("supertest");
const app = require("../../../src/app");
const Category = require("../../../src/models/category");
const Item = require("../../../src/models/item");

const server = request(app);

beforeEach(async () => {
  await Category.deleteMany();
  await Item.deleteMany();
});
beforeAll(async () => {
  jest.resetAllMocks();
});

describe("getItems", () => {
  test("should return 422 with message if wrongMongoId", async () => {
    const wrongMongoId = "60a9fbad6c449219ggc9ec37";
    const response = await server
      .get(`/api/items/getAll/${wrongMongoId}`)
      .expect("Content-Type", /json/)
      .expect(422);

    const body = response.body;

    expect(body.status).toBeFalsy();
    expect(body).toHaveProperty("message");
  });
  test("should return 404 with message if notFoundCategoryID", async () => {
    const notFoundCategoryID = "60283da17a9e931be015420d";
    const response = await server
      .get(`/api/items/getAll/${notFoundCategoryID}`)
      .expect("Content-Type", /json/)
      .expect(404);

    const body = response.body;

    expect(body.status).toBeFalsy();
    expect(body).toHaveProperty("message");
  });
  test("should return list of items if category has", async () => {
    const category = new Category({
      name: { en: "categoryName", ar: "categoryName" },
    });

    const item = new Item({
      title: { en: "aa", ar: " bb" },
      disc: { en: "aa", ar: " bb" },
      units: [
        {
          name: { en: "aa", ar: " bb" },
          price: 1,
        },
      ],
    });

    const categoryID = category._id;
    const itemID = item._id;
    category.items.push(itemID);
    await item.save();
    await category.save();
    const response = await server
      .get(`/api/items/getAll/${categoryID}`)
      .expect("Content-Type", /json/)
      .expect(200);

    const { body } = response;
    console.log(body);
    expect(body.status).toBe(true);
    expect(body.items).toBeInstanceOf(Array);
    expect(body.items.length).toBe(1);
  });
  test("should return empty list if no items", async () => {
    const category = new Category({
      name: { en: "categoryName", ar: "categoryName" },
    });
    const categoryID = category._id;
    await category.save();

    const response = await server
      .get(`/api/items/getAll/${categoryID}`)
      .expect("Content-Type", /json/)
      .expect(200);

    const { body } = response;
    console.log(body);
    expect(body.status).toBe(true);
    expect(body.items).toBeInstanceOf(Array);
    expect(body.items.length).toBe(0);
  });
});
