const portEnv = process.env.BACKEND_PORT || process.env.PORT;
if (!portEnv) {
  throw new Error("Set process.env.BACKEND_PORT or process.env.PORT");
}
const PORT = parseInt(portEnv, 10);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const DB_PATH = `${process.cwd()}/database.sqlite`;

const SHOPIFY_PRODUCT_DISCOUNT_TEST_ID =
  process.env.SHOPIFY_PRODUCT_DISCOUNT_TEST_ID;

if (!SHOPIFY_PRODUCT_DISCOUNT_TEST_ID) {
  throw new Error("Set SHOPIFY_PRODUCT_DISCOUNT_TEST_ID");
}

export { PORT, STATIC_PATH, DB_PATH, SHOPIFY_PRODUCT_DISCOUNT_TEST_ID };
