
const request = require("supertest");
const { createApp } = require("../../src/app");

describe("Product API Integration Tests", () => {
  let app;

  beforeEach(() => {
    app = createApp();
  });

  test("GET /health should return status ok", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  test("GET /products should return all products", async () => {
    const response = await request(app).get("/products");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].name).toBe("Keyboard");
  });

  test("GET /products/1 should return one product", async () => {
    const response = await request(app).get("/products/1");

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Keyboard");
  });

  test("GET a missing product should return 404", async () => {
    const response = await request(app).get("/products/999");

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Product not found");
  });

  test("POST /products should create a product", async () => {
    const response = await request(app)
      .post("/products")
      .send({ name: "Monitor", price: 5000 });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe("Monitor");
    expect(response.body.price).toBe(5000);
  });

  test("POST /products should reject invalid input", async () => {
    const response = await request(app)
      .post("/products")
      .send({ name: "Monitor", price: -10 });

    expect(response.status).toBe(400);
  });
});
