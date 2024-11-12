import Notification from "../models/Notification.js";

const createNewNotification = async (newNotification) => {
  const notification = new Notification(newNotification);
  return await notification.save();
};

const getUserNotifications = async (userId) => {
  return await Notification.findOne({ id: userId }).populate("notifications");
};

export default { createNewNotification, getUserNotifications };
