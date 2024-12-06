import Notification from "../models/Notification.js";
import logger from "../../utils/logger.js";
const createNewNotification = async (newNotification) => {
  const notification = new Notification(newNotification);
  return await notification.save();
};

const modifyNotification = async (notificationId, modifiedParts) => {
  try {
    return await Notification.findByIdAndUpdate(
      notificationId,
      { $set: modifiedParts }, // dynamically set the fields to be updated
      { new: true } // return the updated document
    );
  } catch (err) {
    logger.error(
      `Error modifying notification with id: ${notificationId}`,
      err
    );
    return null;
  }
};

const getNotificationById = async (id) => {
  return await Notification.findById({ id: id });
};

// Testing purposes
const deleteAllNotifications = async () => {
  await Notification.deleteMany();
};
export default {
  createNewNotification,
  modifyNotification,
  deleteAllNotifications,
  getNotificationById,
};
