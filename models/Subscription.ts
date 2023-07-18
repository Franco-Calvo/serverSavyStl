import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubscription extends Document {
  user: mongoose.Types.ObjectId;
  subscriptionType: "day" | "month" | "year";
  startDate: Date;
  endDate: Date;
  duration: number;
  _id?: String;
}

const subscriptionSchema: Schema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subscriptionType: {
      type: String,
      enum: ["day", "month", "year"],
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    duration: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Subscription: Model<ISubscription> = mongoose.model<ISubscription>(
  "Subscription",
  subscriptionSchema
);

export default Subscription;
