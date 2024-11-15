import Notification from "../models/Notification.js";
import User from "../models/User.js";

const createNewNotification = async (newNotification) => {
  const notification = new Notification(newNotification);
  return await notification.save();
};

const modifyNotification = async (notificationId, modifiedParts) => {
  return await Notification.findByIdAndUpdate(
    notificationId,
    { $set: modifiedParts }, // dynamically set the fields to be updated
    { new: true } // return the updated document
  );
};

export default {
  createNewNotification,
  modifyNotification,
};
