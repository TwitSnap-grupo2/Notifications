import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: { type: String, required: true },
  devices: [{ type: String }],
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notification" }]
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    // returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const User = mongoose.model("User", userSchema);

export default User;