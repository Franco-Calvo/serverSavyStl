import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubscription extends Document {
  user: mongoose.Schema.Types.ObjectId;
  subscriptionType: "day" | "month" | "year";
  startDate: Date;
  endDate: Date;
  duration: number;
  _id?: mongoose.Schema.Types.ObjectId;
}

const subscriptionSchema: Schema<ISubscription> = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subscriptionType: {
      type: String,
      enum: ["month", "semiannual", "year"],
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
