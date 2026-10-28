
const {
  getProductById,
  addProduct
} = require("../../src/productService");

describe("Product Service Unit Tests", () => {
  test("should find a product by ID", () => {
    const products = [
      { id: 1, name: "Keyboard", price: 800 }
    ];

    expect(getProductById(products, 1)).toEqual({
      id: 1,
      name: "Keyboard",
      price: 800
    });
  });

  test("should return null for a missing product", () => {
    expect(getProductById([], 99)).toBeNull();
  });

  test("should add a valid product", () => {
    const products = [];

    const result = addProduct(products, {
      name: "Monitor",
      price: 5000
    });

    expect(result).toEqual({
      id: 1,
      name: "Monitor",
      price: 5000
    });
    expect(products).toHaveLength(1);
  });

  test("should reject an invalid product name", () => {
    expect(() => addProduct([], {
      name: "",
      price: 500
    })).toThrow("Product name is required");
  });

  test("should reject a non-positive price", () => {
    expect(() => addProduct([], {
      name: "Monitor",
      price: 0
    })).toThrow("Product price must be greater than zero");
  });
});
