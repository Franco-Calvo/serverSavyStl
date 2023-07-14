import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    is_online: { type: Boolean, required: true },
    is_admin: { type: Boolean, required: true },
    is_member: { type: Boolean, required: true },
    subscription: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription" },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("users", userSchema);

export default User;
