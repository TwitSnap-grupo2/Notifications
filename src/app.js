import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "./swagger_output.json" assert { type: "json" };
import { routes } from "./controllers/index.js";
import {
  errorMiddleware,
  unknownEndpoint,
  apiKeyValidationMiddleware,
} from "./utils/middleware.js";
import logger from "./utils/logger.js";
import mongoose from "mongoose";
import config from "./utils/config.js";
import { firebase } from "./utils/firebase.js";

dotenv.config();

console.log(firebase.name);

const app = express();
// logger
if (!(process.env.NODE_ENV === "test")) {
  app.use(morgan("combined"));
}

app.use(express.json());

app.post("/ping", async (req, res) => {
  res.status(200).json({ message: "pong" });
});

if (process.env.NODE_ENV !== "test") {
  app.use(apiKeyValidationMiddleware);
}

app.use("/", routes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOutput));

app.use(errorMiddleware);
app.use(unknownEndpoint);

const connectToMongoDB = async () => {
  try {
    logger.info("Connecting to MongoDB...");
    await mongoose.connect(config.MONGODB_URI);
    logger.info("Connected to MongoDB");
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      logger.error("Error connecting to MongoDB: ", error.message);
    }
    process.exit(1);
  }
};

connectToMongoDB();

export default app;
