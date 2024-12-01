import { Router } from "express";
import { z } from "zod";
import logger from "../utils/logger.js";
import notificationsService from "../services/notifications.js";
const router = Router();

const newNotificationSchema = z.object({
  url: z.string(),
  body: z.string(),
  title: z.string(),
});

const newDeviceSchema = z.object({
  device: z.string(),
});

const modifiedNotificationSchema = z.object({
  seen: z.boolean(),
});

const newApiKeySchema = z.object({
  apiKey: z.string(),
});

router.post("/:id/devices", async (req, res, next) => {
  try {
    const { device } = newDeviceSchema.parse(req.body);
    console.log("🚀 ~ router.post ~ device:", device);

    logger.info("Adding device token:", device);

    const userId = req.params.id;
    const updatedUser = await notificationsService.addUserDevice(
      userId,
      device
    );

    console.log("🚀 ~ router.post ~ updatedUser:", updatedUser);

    res.status(201).json({
      message: `Device token ${device} successfully added.`,
      user: updatedUser,
    });
  } catch (err) {
    logger.error("Error adding device:", err);
    next({ message: err.message, name: "DatabaseError" });
  }
});

router.post("/:id", async (req, res, next) => {
  try {
    const notificationData = newNotificationSchema.parse(req.body);
    logger.info("Notification: ");

    const userId = req.params.id; // The ID from the URL parameter

    const newNotification = await notificationsService.createNotification(
      userId,
      notificationData
    );
    return res.status(201).json(newNotification);
  } catch (err) {
    logger.error(err);
    next({ message: err.message, name: "DatabaseError" });
  }
});

router.get("/:id/devices", async (req, res, next) => {
  try {
    const userId = req.params.id;

    const user = await notificationsService.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        message: `User with ID ${userId} not found`,
      });
    }

    return res.status(200).json({
      devices: user.devices,
    });
  } catch (err) {
    logger.error("Error fetching devices:", err);
    next({ message: err.message, name: "DatabaseError" });
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const userId = req.params.id;

    const notifications =
      await notificationsService.getUserWithNotifications(userId);
    return res.status(200).json(notifications);
  } catch (err) {
    logger.error(err);
    next({ message: err.message, name: "DatabaseError" });
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const notificationId = req.params.id;
    const newStatus = modifiedNotificationSchema.parse(req.body);

    const modifiedNotification = await notificationsService.modifyNotification(
      notificationId,
      newStatus
    );

    if (!modifiedNotification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    return res.status(200).json(modifiedNotification);
  } catch (err) {
    logger.error(err);
    next({ message: err.message, name: "DatabaseError" });
  }
});

router.get("/:id/unseen", async (req, res, next) => {
  try {
    const userId = req.params.id;

    const unseenNotificationsCount =
      await notificationsService.getUnseenNotificationCount(userId);

    return res.status(200).json({ unseen: unseenNotificationsCount });
  } catch (err) {
    logger.error(err);
    next({ message: err.message, name: "DatabaseError" });
  }
});

router.put("/apiKey", async (req, res, next) => {
  try {
    const data = newApiKeySchema.parse(req.body);
    process.env["API_KEY"] = data.apiKey;
    console.log("New apiKey: ", process.env["API_KEY"]);
    res.status(200).json({ apiKey: data.apiKey });
  } catch (err) {
    next(err);
  }
});

export default router;
