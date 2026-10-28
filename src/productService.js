
function getProductById(products, id) {
  return products.find((product) => product.id === Number(id)) || null;
}

function addProduct(products, product) {
  if (!product.name || typeof product.name !== "string") {
    throw new Error("Product name is required");
  }

  if (typeof product.price !== "number" || product.price <= 0) {
    throw new Error("Product price must be greater than zero");
  }

  const newProduct = {
    id: products.length + 1,
    name: product.name,
    price: product.price
  };

  products.push(newProduct);
  return newProduct;
}

module.exports = {
  getProductById,
  addProduct
};
