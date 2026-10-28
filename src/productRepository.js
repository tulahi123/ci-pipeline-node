
const { Pool } = require("pg");

function createProductRepository(pool = new Pool({
  connectionString: process.env.DATABASE_URL
})) {
  async function initialize() {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        price NUMERIC(10, 2) NOT NULL CHECK (price > 0)
      )
    `);
  }

  async function getAll() {
    const result = await pool.query(
      "SELECT id, name, price FROM products ORDER BY id"
    );

    return result.rows;
  }

  async function getById(id) {
    const result = await pool.query(
      "SELECT id, name, price FROM products WHERE id = $1",
      [id]
    );

    return result.rows[0] || null;
  }

  async function create(name, price) {
    const result = await pool.query(
      "INSERT INTO products (name, price) VALUES ($1, $2) RETURNING id, name, price",
      [name, price]
    );

    return result.rows[0];
  }

  return { initialize, getAll, getById, create, pool };
}

module.exports = { createProductRepository };
