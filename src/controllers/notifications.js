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

export default router;
