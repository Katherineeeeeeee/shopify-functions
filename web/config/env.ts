const portEnv = process.env.BACKEND_PORT || process.env.PORT;
if (!portEnv) {
  throw new Error("Set process.env.BACKEND_PORT or process.env.PORT");
}
const PORT = parseInt(portEnv, 10);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

console.log(STATIC_PATH);

const DB_PATH = `${process.cwd()}/database.sqlite`;

export { PORT, STATIC_PATH, DB_PATH };
