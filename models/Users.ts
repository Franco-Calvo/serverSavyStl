import mongoose from "mongoose";

export interface IUser {
  is_online: Boolean;
  is_member: Boolean;
  is_admin: Boolean;
  email: String;
  password: string;
  name: String;
  last_name: String;
  subscription: null;
  timestamps: Boolean;
  _id?: String;
}

export const defaultUser: IUser = {
  is_online: false,
  is_member: false,
  is_admin: false,
  email: "",
  password: "",
  name: "",
  last_name: "",
  subscription: null,
  timestamps: true,
};

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
