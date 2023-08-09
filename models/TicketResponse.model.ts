import mongoose, { Document, Model, Schema } from "mongoose";

export const secondsRequiredForSendMessage = 30 * 1000;
type AuthorType = "user" | "admin";

export interface IMessageTicket extends Document {
  ticketId: string;
  author: AuthorType;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const ticketResponsesSchema: Schema<IMessageTicket> = new Schema(
  {
    ticketId: { type: String, required: true },
    author: { type: String, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

ticketResponsesSchema.index({ createdAt: -1 });

export default (mongoose.models.ticketResponses as Model<IMessageTicket>) ||
  mongoose.model<IMessageTicket>("ticketResponses", ticketResponsesSchema);
