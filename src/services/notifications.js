import notificationsDb from "../db/repositories/notifications.js";
import usersDb from "../db/repositories/users.js";
import logger from "../utils/logger.js";

const createNotification = async (userId, notification) => {
  let user = await usersDb.getUserById(userId);
  if (!user) {
    user = await usersDb.createUser(userId);
  }
  console.log("🚀 ~ createNotification ~ user:", user);
  const newNotification = await notificationsDb.createNewNotification({
    ...notification,
    userId: user._id,
  });

  user.notifications.push(newNotification._id);
  await user.save();

  logger.debug("newNotification: ", newNotification);
  return newNotification;
};

const addUserDevice = async (userId, newDeviceToken) => {
  let user = await usersDb.getUserById(userId);

  if (!user) {
    user = await usersDb.createUser(userId);
  }

  if (!user.devices.includes(newDeviceToken)) {
    console.log("🚀 ~ addUserDevice ~ newDeviceToken:", newDeviceToken);
    user = usersDb.addUserDevice(user, newDeviceToken);
    // user.devices.push(newDeviceToken);

    // await user.save();
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

export default {
  createNotification,
  addUserDevice,
  getUserById,
  getUserWithNotifications,
};
