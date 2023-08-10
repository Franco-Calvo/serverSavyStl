import mongoose, { Schema } from "mongoose";
export const secondsRequiredForSendMessage = 30 * 1000;
const ticketResponsesSchema = new Schema({
    ticketId: { type: String, required: true },
    author: { type: String, required: true },
    text: { type: String, required: true },
}, { timestamps: true });
ticketResponsesSchema.index({ createdAt: -1 });
export default mongoose.models.ticketResponses ||
    mongoose.model("ticketResponses", ticketResponsesSchema);
