const request = require("supertest");
const app = require("../../../src/app");
const Category = require("../../../src/models/category");
const Item = require("../../../src/models/item");
const TokenUtils = require("../../uitils/tokenUtils");

const server = request(app);

beforeEach(async () => {
  await Category.deleteMany();
  await Item.deleteMany();
});
afterAll(async () => jest.resetAllMocks());

describe("addItemToCategory", () => {
  test("should not add item to category when token expired (Unauthorized)", async () => {
    const category = new Category({
      name: { en: "categoryName", ar: "categoryName" },
    });
    await category.save();

    const item = new Item({
      title: { en: "itemTitle", ar: "itemTitle" },
      disc: { en: "itemDisc", ar: "itemDisc" },
    });
    await item.save();

    const response = await server
      .post(`/api/category/${category._id}/addItem`)
      .send({ itemId: item._id })
      .set("Authorization", `Bearer ${await TokenUtils.expiredOwnerToken()}`)
      .expect("Content-Type", /json/)
      .expect(401);

    const body = response.body;
    expect(body.status).toBe(false);
    expect(body).toHaveProperty("message");

    const categoryAfterInsert = await Category.findById(category._id);

    expect(categoryAfterInsert.items.includes(item._id)).toBe(false);
  });
  test("should not add item to category when user hasn't access (Forbidden)", async () => {
    const category = new Category({
      name: { en: "categoryName", ar: "categoryName" },
    });
    await category.save();

    const item = new Item({
      title: { en: "itemTitle", ar: "itemTitle" },
      disc: { en: "itemDisc", ar: "itemDisc" },
    });
    await item.save();

    const response = await server
      .post(`/api/category/${category._id}/addItem`)
      .send({ itemId: item._id })
      .set("Authorization", `Bearer ${await TokenUtils.userToken()}`)
      .expect("Content-Type", /json/)
      .expect(403);

    const body = response.body;
    expect(body.status).toBe(false);
    expect(body).toHaveProperty("message");

    const categoryAfterInsert = await Category.findById(category._id);

    expect(categoryAfterInsert.items.includes(item._id)).toBe(false);
  });
  test("should add item to category when user has access", async () => {
    const category = new Category({
      name: { en: "categoryName", ar: "categoryName" },
    });
    await category.save();

    const item = new Item({
      title: { en: "itemTitle", ar: "itemTitle" },
      disc: { en: "itemDisc", ar: "itemDisc" },
    });
    await item.save();

    const response = await server
      .post(`/api/category/${category._id}/addItem`)
      .send({ itemId: item._id })
      .set("Authorization", `Bearer ${await TokenUtils.ownerUserToken()}`)
      .expect("Content-Type", /json/)
      .expect(200);
    const body = response.body;

    expect(body.status).toBe(true);

    const categoryAfterInsert = await Category.findById(category._id);

    expect(categoryAfterInsert.items.includes(item._id)).toBe(true);
  });
  test("should return 404 with message if wrong categoryId", async () => {
    const item = new Item({
      title: { en: "itemTitle", ar: "itemTitle" },
      disc: { en: "itemDisc", ar: "itemDisc" },
    });
    await item.save();

    const wrongCategoryId = "60a9deeb06496a08843fa4a2";

    const response = await server
      .post(`/api/category/${wrongCategoryId}/addItem`)
      .send({ itemId: item._id })
      .set("Authorization", `Bearer ${await TokenUtils.ownerUserToken()}`)
      .expect("Content-Type", /json/)
      .expect(404);

    const body = response.body;

    expect(body.status).toBe(false);
    expect(body).toHaveProperty("message");
  });
});
