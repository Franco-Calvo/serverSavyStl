import mongoose, { Schema } from "mongoose";
const subscriptionSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subscriptionType: {
        type: String,
        enum: ["month", "semiannual", "year"],
        required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    duration: { type: Number, required: true },
}, {
    timestamps: true,
});
const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;
