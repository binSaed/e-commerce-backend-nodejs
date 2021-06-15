const request = require("supertest");
const app = require("../../../src/app");
const Category = require("../../../src/models/category");
const Item = require("../../../src/models/item");
const TokenUtils = require("../../uitils/tokenUtils");

const server = request(app);
const item = {
  title: { en: "sdfsdf", ar: " vfddfdf" },
  disc: { en: "sdfsdf", ar: " vfddfdf" },
  unitName: { en: "sdfsdf", ar: " vfddfdf" },
  price: 1,
  categoryId: "60a94a17bddc6f1838b0e1d1",
  discount: "4",
  maxQuantityInOrder: "5",
};
const itemWithoutTitleArIntel = () => {
  const newItem = { ...item };
  newItem.title = { en: "sdfsdf" };
  return newItem;
};
const itemWithoutTitleEnIntel = () => {
  const newItem = { ...item };
  newItem.title = { ar: "sdfsdf" };
  return newItem;
};
const itemWithoutDiscArIntel = () => {
  const newItem = { ...item };
  newItem.disc = { en: "sdfsdf" };
  return newItem;
};
const itemWithoutDiscEnIntel = () => {
  const newItem = { ...item };
  newItem.disc = { ar: "sdfsdf" };
  return newItem;
};
const itemWithoutUnitNameArIntel = () => {
  const newItem = { ...item };
  newItem.unitName = { en: "sdfsdf" };
  return newItem;
};
const itemWithoutUnitNameEnIntel = () => {
  const newItem = { ...item };
  newItem.unitName = { ar: "sdfsdf" };
  return newItem;
};
const itemWithoutPrice = () => {
  const newItem = { ...item };
  delete newItem.price;
  return newItem;
};

const itemWithNotValidPrice = () => {
  const newItem = { ...item };
  newItem.price = "ss";
  return newItem;
};
const itemWithPriceUnderOne = () => {
  const newItem = { ...item };
  newItem.price = 0;
  return newItem;
};

beforeEach(async () => {
  await Category.deleteMany();
  await Item.deleteMany();
});

beforeAll(async () => {
  jest.resetAllMocks();
});
afterAll(async () => {});

describe("addCategory", () => {
  test("should create item when user has access", async () => {
    const response = await server
      .post(`/api/items/add`)
      .send(item)
      .set("Authorization", `Bearer ${await TokenUtils.ownerUserToken()}`)
      .expect("Content-Type", /json/)
      .expect(200);
    const body = response.body;

    expect(body.status).toBeTruthy();

    const items = await Item.find();

    expect(JSON.stringify(item.title).includes(items[0].title)).toBeTruthy();
    expect(JSON.stringify(item.disc).includes(items[0].disc)).toBeTruthy();
    expect(
      JSON.stringify(item.unitName).includes(items[0].units[0].name)
    ).toBeTruthy();
    expect(item.price).toEqual(items[0].units[0].price);
  });
  test("should create item and add to category when user has access", async () => {
    const category = new Category({
      name: { en: "categoryName", ar: "categoryName" },
    });
    await category.save();
    const categoryId = category._id;

    const response = await server
      .post(`/api/items/add`)
      .send({ ...item, categoryId })
      .set("Authorization", `Bearer ${await TokenUtils.ownerUserToken()}`)
      .expect("Content-Type", /json/)
      .expect(200);
    const body = response.body;

    expect(body.status).toBeTruthy();

    const items = await Item.find();
    const itemDB = items[0];
    expect(JSON.stringify(item.title).includes(itemDB.title)).toBeTruthy();
    expect(JSON.stringify(item.disc).includes(itemDB.disc)).toBeTruthy();
    expect(
      JSON.stringify(item.unitName).includes(itemDB.units[0].name)
    ).toBeTruthy();
    expect(item.price).toEqual(itemDB.units[0].price);

    const category2 = await Category.findById(categoryId);
    expect(category2.items[0]).toEqual(itemDB._id);
  });
  test("should not create item when token expired (Unauthorized)", async () => {
    const response = await server
      .post(`/api/items/add`)
      .send(item)
      .set("Authorization", `Bearer ${await TokenUtils.expiredOwnerToken()}`)
      .expect("Content-Type", /json/)
      .expect(401);
    const body = response.body;

    expect(body.status).toBeFalsy();
    expect(body).toHaveProperty("message");

    const items = await Item.find();
    expect(items).toHaveLength(0);
  });
  test("should not create item when user hasn't access (Forbidden)", async () => {
    const response = await server
      .post(`/api/items/add`)
      .send(item)
      .set("Authorization", `Bearer ${await TokenUtils.userToken()}`)
      .expect("Content-Type", /json/)
      .expect(403);
    const body = response.body;

    expect(body.status).toBeFalsy();
    expect(body).toHaveProperty("message");

    const items = await Item.find();
    expect(items.length).toBe(0);
  });
  test("should not create item when user not send data", async () => {
    const response = await server
      .post(`/api/items/add`)
      .set("Authorization", `Bearer ${await TokenUtils.ownerUserToken()}`)
      .expect("Content-Type", /json/)
      .expect(422);
    const body = response.body;

    expect(body.status).toBeFalsy();
    expect(body).toHaveProperty("message");

    const items = await Item.find();
    expect(items.length).toBe(0);
  });
  test("should not create item when data not valid", async () => {
    const response1 = await server
      .post(`/api/items/add`)
      .send(itemWithoutTitleArIntel())
      .set("Authorization", `Bearer ${await TokenUtils.ownerUserToken()}`)
      .expect("Content-Type", /json/)
      .expect(422);
    const body1 = response1.body;

    expect(body1.status).toBeFalsy();
    expect(body1).toHaveProperty("message");
    const items1 = await Item.find();
    expect(items1).toHaveLength(0);

    const response2 = await server
      .post(`/api/items/add`)
      .send(itemWithoutTitleEnIntel())
      .set("Authorization", `Bearer ${await TokenUtils.ownerUserToken()}`)
      .expect("Content-Type", /json/)
      .expect(422);
    const body2 = response2.body;

    expect(body2.status).toBeFalsy();
    expect(body2).toHaveProperty("message");
    const items2 = await Item.find();
    expect(items2).toHaveLength(0);

    const response3 = await server
      .post(`/api/items/add`)
      .send(itemWithoutDiscArIntel())
      .set("Authorization", `Bearer ${await TokenUtils.ownerUserToken()}`)
      .expect("Content-Type", /json/)
      .expect(422);
    const body3 = response3.body;

    expect(body3.status).toBeFalsy();
    expect(body3).toHaveProperty("message");
    const items3 = await Item.find();
    expect(items3).toHaveLength(0);

    const response4 = await server
      .post(`/api/items/add`)
      .send(itemWithoutDiscEnIntel())
      .set("Authorization", `Bearer ${await TokenUtils.ownerUserToken()}`)
      .expect("Content-Type", /json/)
      .expect(422);
    const body4 = response4.body;

    expect(body4.status).toBeFalsy();
    expect(body4).toHaveProperty("message");
    const items4 = await Item.find();
    expect(items4).toHaveLength(0);

    const response5 = await server
      .post(`/api/items/add`)
      .send(itemWithoutUnitNameArIntel())
      .set("Authorization", `Bearer ${await TokenUtils.ownerUserToken()}`)
      .expect("Content-Type", /json/)
      .expect(422);
    const body5 = response5.body;

    expect(body5.status).toBeFalsy();
    expect(body5).toHaveProperty("message");
    const items5 = await Item.find();
    expect(items5).toHaveLength(0);

    const response6 = await server
      .post(`/api/items/add`)
      .send(itemWithoutUnitNameArIntel())
      .set("Authorization", `Bearer ${await TokenUtils.ownerUserToken()}`)
      .expect("Content-Type", /json/)
      .expect(422);
    const body6 = response6.body;

    expect(body6.status).toBeFalsy();
    expect(body6).toHaveProperty("message");
    const items6 = await Item.find();
    expect(items6).toHaveLength(0);

    const response7 = await server
      .post(`/api/items/add`)
      .send(itemWithoutUnitNameEnIntel())
      .set("Authorization", `Bearer ${await TokenUtils.ownerUserToken()}`)
      .expect("Content-Type", /json/)
      .expect(422);
    const body7 = response7.body;

    expect(body7.status).toBeFalsy();
    expect(body7).toHaveProperty("message");
    const items7 = await Item.find();
    expect(items7).toHaveLength(0);

    const response8 = await server
      .post(`/api/items/add`)
      .send(itemWithoutPrice())
      .set("Authorization", `Bearer ${await TokenUtils.ownerUserToken()}`)
      .expect("Content-Type", /json/)
      .expect(422);
    const body8 = response8.body;

    expect(body8.status).toBeFalsy();
    expect(body8).toHaveProperty("message");
    const items8 = await Item.find();
    expect(items8).toHaveLength(0);

    const response9 = await server
      .post(`/api/items/add`)
      .send(itemWithNotValidPrice())
      .set("Authorization", `Bearer ${await TokenUtils.ownerUserToken()}`)
      .expect("Content-Type", /json/)
      .expect(422);
    const body9 = response9.body;

    expect(body9.status).toBeFalsy();
    expect(body9).toHaveProperty("message");
    const items9 = await Item.find();
    expect(items9).toHaveLength(0);

    const response10 = await server
      .post(`/api/items/add`)
      .send(itemWithPriceUnderOne())
      .set("Authorization", `Bearer ${await TokenUtils.ownerUserToken()}`)
      .expect("Content-Type", /json/)
      .expect(422);
    const body10 = response10.body;

    expect(body10.status).toBeFalsy();
    expect(body10).toHaveProperty("message");
    const items10 = await Item.find();
    expect(items10).toHaveLength(0);
  });
});
