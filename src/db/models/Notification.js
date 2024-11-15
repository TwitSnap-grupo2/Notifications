import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  url: { type: String, required: true },
  body: { type: String, required: true },
  title: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  seen: { type: Boolean, required: true },
});

notificationSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    // returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
