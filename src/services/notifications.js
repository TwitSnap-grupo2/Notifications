import notificationsDb from "../db/repositories/notifications.js";
import usersDb from "../db/repositories/users.js";
import logger from "../utils/logger.js";
import admin from "firebase-admin";

const createNotification = async (userId, notification) => {
  let user = await usersDb.getUserById(userId);
  if (!user) {
    user = await usersDb.createUser(userId);
  }
  const newNotification = await notificationsDb.createNewNotification({
    ...notification,
    userId: user._id,
    seen: false,
  });

  user.notifications.push(newNotification._id);
  await user.save();

  await admin.messaging().sendEachForMulticast({
    tokens: user.devices,
    data: {
      url: notification.url,
    },
    notification: {
      title: notification.title,
      body: notification.body,
    },
  });

  logger.debug("newNotification: ", newNotification);
  return newNotification;
};

const addUserDevice = async (userId, newDeviceToken) => {
  let user = await usersDb.getUserById(userId);

  if (!user) {
    user = await usersDb.createUser(userId);
  }

  if (!user.devices.includes(newDeviceToken)) {
    user = usersDb.addUserDevice(user, newDeviceToken);

    logger.info(`Device token ${newDeviceToken} added for user ${userId}`);
  } else {
    logger.info(
      `Device token ${newDeviceToken} already exists for user ${userId}`
    );
  }

  return user;
};

const getUserById = async (id) => {
  let user = await usersDb.getUserById(id);

  if (!user) {
    user = await usersDb.createUser(id);
  }
  return user;
};

const getUserWithNotifications = async (id) => {
  let user = await usersDb.getUserWithNotifications(id);

  if (!user) {
    user = await usersDb.createUser(id);
  }

  return user.notifications;
};

const modifyNotification = async (notificationId, modifiedParts) => {
  return await notificationsDb.modifyNotification(
    notificationId,
    modifiedParts
  );
};

export default {
  createNotification,
  addUserDevice,
  getUserById,
  getUserWithNotifications,
  modifyNotification,
};
