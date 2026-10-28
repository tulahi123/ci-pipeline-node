
const express = require("express");
const {
  getProductById,
  addProduct
} = require("./productService");

function createApp() {
  const app = express();
  const products = [
    { id: 1, name: "Keyboard", price: 800 },
    { id: 2, name: "Mouse", price: 400 }
  ];

  app.use(express.json());

  app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.get("/products", (req, res) => {
    res.status(200).json(products);
  });

  app.get("/products/:id", (req, res) => {
    const product = getProductById(products, req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  });

  app.post("/products", (req, res) => {
    try {
      const product = addProduct(products, req.body);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  return app;
}

module.exports = { createApp };
