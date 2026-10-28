
const path = require("path");
const {
  Pact,
  SpecificationVersion
} = require("@pact-foundation/pact");

const { getProduct } = require("../../src/consumer");

describe("Product Consumer Contract Test", () => {
  const provider = new Pact({
    consumer: "ProductConsumer",
    provider: "ProductProvider",
    dir: path.resolve(process.cwd(), "pacts"),
    spec: SpecificationVersion.SPECIFICATION_VERSION_V4,
    logLevel: "error"
  });

  test("consumer receives the expected product", async () => {
    await provider
      .addInteraction()
      .uponReceiving("a request for product 1")
      .withRequest("GET", "/products/1", (builder) => {
        builder.headers({ Accept: "application/json" });
      })
      .willRespondWith(200, (builder) => {
        builder.headers({
          "Content-Type": "application/json; charset=utf-8"
        });
        builder.jsonBody({
          id: 1,
          name: "Keyboard",
          price: 800
        });
      })
      .executeTest(async (mockServer) => {
        const product = await getProduct(mockServer.url, 1);

        expect(product).toEqual({
          id: 1,
          name: "Keyboard",
          price: 800
        });
      });
  });
});
