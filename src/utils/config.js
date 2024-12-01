import "dotenv/config";

const PORT = process.env.PORT;

const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw Error("MONGODB_URI is undefined");
}

const SERVICE_ID = process.env.SERVICE_ID;
const REGISTRY_URL = process.env.REGISTRY_URL;

export default {
  PORT,
  MONGODB_URI,
  SERVICE_ID,
  REGISTRY_URL,
};
