import express from "express";

import notificationsRouter from "./notifications.js";

export const routes = express.Router();

routes.use("/notifications", notificationsRouter);
