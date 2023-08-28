import mongoose, { Schema } from "mongoose";
const ticketSchema = new Schema({
    title: { type: String, required: true },
    status: { type: String, required: true },
    message: { type: String, required: false },
    userId: { type: String, required: true },
    unreadMsg: {
        admin: { type: Boolean, required: true },
        user: { type: Boolean, required: true },
    },
}, { timestamps: true });
ticketSchema.index({ createdAt: -1 });
export default mongoose.models.tickets ||
    mongoose.model("tickets", ticketSchema);
