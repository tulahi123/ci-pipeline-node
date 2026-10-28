
async function getProduct(apiUrl, id) {
  const response = await fetch(`${apiUrl}/products/${id}`, {
    headers: { Accept: "application/json" }
  });

  if (!response.ok) {
    throw new Error(`Provider returned HTTP ${response.status}`);
  }

  return response.json();
}

module.exports = { getProduct };
