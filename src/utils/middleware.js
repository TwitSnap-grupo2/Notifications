import { z } from "zod";
import { createErrorResponse } from "./errors.js";
import logger from "./logger.js";

/**
 * Middleware to handle requests to unknown endpoints.
 *
 * This middleware is used when no other route matches the incoming request.
 * It responds with a 404 status and a standardized error response.
 *
 * @param {Request} request - The Express request object.
 * @param {Response} response - The Express response object.
 */
// Why isn't this middleware called first? Because it's differentiated by
// the arguments it receives
export const unknownEndpoint = (request, response) => {
  response
    .status(404)
    .send(
      createErrorResponse(
        "about:blank",
        "Unknown endpoint",
        404,
        "No endpoint matches the url",
        request.originalUrl
      )
    );
};

export const errorMiddleware = (err, req, res, _next) => {
  console.log("🚀 ~ errorMiddleware ~ err:", err);
  if (err instanceof z.ZodError) {
    logger.error("Error: ", err.flatten());

    let errDescription = "";
    // Flatten and then fielderrors gives you a dict of key, values, where keys are the field of which
    // validation has failed, and the value is an array with the information about that failed validation
    const errors = Object.entries(err.flatten().fieldErrors);
    errors.forEach(
      (keyVal) =>
        (errDescription +=
          keyVal[0] +
          ": " +
          keyVal[1]?.reduce((acc, curr) => acc + curr) +
          ". ")
    );

    res
      .status(400)
      .json(
        createErrorResponse(
          "about:blank",
          "Validation Error",
          400,
          errDescription,
          req.url
        )
      );
    return;
  } else if (err instanceof Error) {
    console.log("🚀 ~ errorMiddleware ~ err :", err);

    res
      .status(err.statusCode ?? 400)
      .json(
        createErrorResponse("about:blank", err.name, 400, err.message, req.url)
      );
    return;
  }
};

export const apiKeyValidationMiddleware = async (req, res, next) => {
  const apiKey = req.headers.authorization; // Ensure API key is sent in the Authorization header

  if (!apiKey) {
    return res.status(401).send({ detail: "Missing API Key" });
  }

  try {
    const response = await fetch(
      `https://services-registry.onrender.com/api/registry/validate?apiKey=${apiKey}`
    );

    if (!response.ok) {
      if (response.status === 401) {
        return res.status(401).send({ detail: "Invalid API Key" });
      }
      return res.status(response.status).send({ detail: "Validation error" });
    }

    next();
  } catch (error) {
    logger.error("API Key validation error:", error);
    return res
      .status(500)
      .send({ detail: "Internal server error during API key validation" });
  }
};
