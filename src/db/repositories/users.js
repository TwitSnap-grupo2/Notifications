import User from "../models/User.js";

const getUserById = async (id) => {
  return await User.findOne({ id: id });
};

const createUser = async (id) => {
  const user = new User({ id: id, devices: [], notifications: [] });
  await user.save();
  return user;
};

const getUserWithNotifications = async (id) => {
  return await User.findOne({ id: id }).populate({
    path: "notifications",
    options: { sort: { createdAt: -1 } }, // Sort by createdAt in descending order
  });
};

const addUserDevice = async (user, deviceToken) => {
  user.devices.push(deviceToken);
  await user.save();
  return user;
};

const getUnseenNotificationCount = async (userId) => {
  const user = await User.findOne({ id: userId }).populate({
    path: "notifications",
    match: { seen: false }, // Only include notifications with seen: false
  });

  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }

  return user.notifications.length;
};

export default {
  getUserById,
  createUser,
  getUserWithNotifications,
  addUserDevice,
  getUnseenNotificationCount,
};
