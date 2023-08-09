import mongoose, { Document, Model, Schema } from "mongoose";

export type AuthorType = "user" | "admin";
type StatusTypes = "open" | "replied" | "user-reply" | "closed" | "approved";

export interface Ticket extends Document {
  title: string;
  status: StatusTypes;
  message: string;
  unreadMsg: Record<AuthorType, boolean>;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TicketServiceResponse = Ticket | null;

const ticketSchema: Schema<Ticket> = new Schema(
  {
    title: { type: String, required: true },
    status: { type: String, required: true },
    message: { type: String, required: false },
    userId: { type: String, required: true },
    unreadMsg: {
      admin: { type: Boolean, required: true },
      user: { type: Boolean, required: true },
    },
  },
  { timestamps: true }
);

ticketSchema.index({ createdAt: -1 });

export default (mongoose.models.tickets as Model<Ticket>) ||
  mongoose.model<Ticket>("tickets", ticketSchema);
