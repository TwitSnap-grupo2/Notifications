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
    createdBy: userId,
    seen: false,
  });

  user.notifications.push(newNotification._id);
  await user.save();

  await admin.messaging().sendEachForMulticast({
    tokens: user.devices,
    data: {
      url: notification.url,
      createdBy: userId,
    },
    notification: {
      title: notification.title,
      body: notification.body,
    },
  });

  return newNotification;
};

const tryAddUserDevice = async (userId, newDeviceToken) => {
  let user = await usersDb.getUserById(userId);

  if (!user) {
    user = await usersDb.createUser(userId);
  }

  if (!user.devices.includes(newDeviceToken)) {
    user = await usersDb.addUserDevice(user, newDeviceToken);

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
  const a = await notificationsDb.modifyNotification(
    notificationId,
    modifiedParts
  );
  return a;
};

const getUnseenNotificationCount = async (userId) => {
  return await usersDb.getUnseenNotificationCount(userId);
};

export default {
  createNotification,
  addUserDevice: tryAddUserDevice,
  getUserById,
  getUserWithNotifications,
  modifyNotification,
  getUnseenNotificationCount,
};
