
const { PostgreSqlContainer } = require("@testcontainers/postgresql");
const { Client } = require("pg");

jest.setTimeout(60000);

describe("PostgreSQL Testcontainers Integration Test", () => {
  let container;
  let client;

  beforeAll(async () => {
    container = await new PostgreSqlContainer("postgres:16-alpine")
      .withDatabase("testdb")
      .withUsername("testuser")
      .withPassword("testpassword")
      .start();

    client = new Client({
      connectionString: container.getConnectionUri()
    });

    await client.connect();

    await client.query(`
      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        price NUMERIC(10, 2) NOT NULL CHECK (price > 0)
      )
    `);
  });

  afterAll(async () => {
    if (client) {
      await client.end();
    }

    if (container) {
      await container.stop();
    }
  });

  test("should insert and retrieve a product", async () => {
    const inserted = await client.query(
      "INSERT INTO products (name, price) VALUES ($1, $2) RETURNING id, name, price",
      ["Keyboard", 800]
    );

    expect(inserted.rows).toHaveLength(1);
    expect(inserted.rows[0].name).toBe("Keyboard");
    expect(Number(inserted.rows[0].price)).toBe(800);

    const retrieved = await client.query(
      "SELECT name, price FROM products WHERE id = $1",
      [inserted.rows[0].id]
    );

    expect(retrieved.rows[0].name).toBe("Keyboard");
    expect(Number(retrieved.rows[0].price)).toBe(800);
  });

  test("should reject a negative database price", async () => {
    await expect(
      client.query(
        "INSERT INTO products (name, price) VALUES ($1, $2)",
        ["Invalid Product", -10]
      )
    ).rejects.toThrow();
  });
});
