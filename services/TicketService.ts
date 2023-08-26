import { FilterQuery } from "mongoose";
import TicketModel, {
  Ticket,
  TicketServiceResponse,
} from "../models/Ticket.model.js";
import { IMessageTicket } from "../models/TicketResponse.model.js";
import TicketResponseModel from "../models/TicketResponse.model.js";
import { emitEventToUser } from "../config/socket.js";

// import { sendMessageToAdmins } from "../helpers/relayers.js";
// import { emitEventToAddress } from "../controllers/SocketController.js";

export interface paginationType {
  items: any[];
  size: number;
  error?: {
    active: boolean;
    code?: string;
  };
}

export const defaultPagination: paginationType = {
  items: [],
  size: 0,
};

export const itemsPerPage: number = 7;

const addTicket = async (data: Ticket): Promise<TicketServiceResponse> => {
  if (data.userId) {
    try {
      const new_ticket: Ticket = new TicketModel(data);
      const result: Ticket = await new_ticket.save();

      return result;
    } catch (err) {
      console.log(err);
      return null;
    }
  } else {
    return null;
  }
};

const setRepliedByUser = async (message: IMessageTicket) => {
  const ticket: TicketServiceResponse = await TicketModel.findOneAndUpdate(
    {
      _id: message.ticketId,
    },
    { $set: { unreadMsg: { admin: true, user: false }, status: "user-reply" } }
  );
};

const setRepliedByAdmin = async (message: IMessageTicket) => {
  const ticket: TicketServiceResponse = await TicketModel.findOneAndUpdate(
    {
      _id: message.ticketId,
    },
    { $set: { unreadMsg: { admin: false, user: true }, status: "replied" } }
  );

  if (ticket) emitEventToUser(ticket.userId, "new_message", message);
};

const addMessageToTicket = async (
  message: IMessageTicket
): Promise<IMessageTicket | null> => {
  try {
    const new_message: IMessageTicket = new TicketResponseModel(message);
    const result: IMessageTicket = await new_message.save();

    if (result) {
      message.author == "admin"
        ? await setRepliedByAdmin(result)
        : await setRepliedByUser(result);

      return result;
    }
  } catch (err) {
    return null;
  }

  return null;
};

const getTicketMessages = async (
  ticketId: string
): Promise<IMessageTicket[]> => {
  try {
    const ticket_messages: IMessageTicket[] = await TicketResponseModel.find({
      ticketId,
    }).sort({ createdAt: 1 });

    return ticket_messages;
  } catch (err) {
    return [];
  }
};

const closeTicket = async (
  userId: string,
  _id: string
): Promise<TicketServiceResponse> => {
  try {
    const result: TicketServiceResponse = await TicketModel.findOneAndUpdate(
      {
        _id,
        userId,
      },
      { $set: { status: "closed" } },
      { new: true }
    );

    return result;
  } catch (err) {
    return null;
  }
};

const approvedTicket = async (
  userId: string,
  _id: string
): Promise<TicketServiceResponse> => {
  try {
    const result: TicketServiceResponse = await TicketModel.findOneAndUpdate(
      {
        _id,
        userId,
      },
      { $set: { status: "approved" } },
      { new: true }
    );

    return result;
  } catch (err) {
    return null;
  }
};

const getSizeDocuments = async (
  filters: FilterQuery<Ticket>
): Promise<number> => {
  const size: number = await TicketModel.countDocuments(filters);

  return size;
};

const getFilteredTickets = async (
  page: number,
  filters: FilterQuery<Ticket>
): Promise<Ticket[]> => {
  try {
    const result: Ticket[] = await TicketModel.find({})
      .sort({
        createdAt: -1,
      })
      .skip(itemsPerPage * page)
      .limit(itemsPerPage);

    return result;
  } catch (err) {
    console.log(err);
    return [];
  }
};

const getRecentTicketsByUser = async (
  userId: string
): Promise<paginationType> => {
  try {
    const filters = { userId };
    const result: Ticket[] = await getFilteredTickets(0, filters);
    const size: number = await getSizeDocuments(filters);

    return {
      items: result,
      size: size,
    };
  } catch (err) {
    console.log(err);
    return defaultPagination;
  }
};

const getTicket = async (_id: string): Promise<TicketServiceResponse> => {
  try {
    const result: TicketServiceResponse = await TicketModel.findOne({ _id });

    return result;
  } catch (err) {
    return null;
  }
};

const getTicketsByUser = async (userId: string): Promise<Ticket[]> => {
  try {
    const result: Ticket[] = await TicketModel.find({
      userId,
    }).sort({
      createdAt: -1,
    });

    return result;
  } catch (err) {
    console.log(err);
    return [];
  }
};

const getTicketByUserId = async (
  userId: string
): Promise<TicketServiceResponse> => {
  try {
    const result: TicketServiceResponse = await TicketModel.findOne({ userId });
    return result;
  } catch (err) {
    return null;
  }
};

const getAllTickets = async (): Promise<Ticket[]> => {
  try {
    const allTickets: Ticket[] = await TicketModel.find().sort({
      createdAt: -1,
    });
    return allTickets;
  } catch (err) {
    console.log(err);
    return [];
  }
};

export default {
  addTicket,
  addMessageToTicket,
  getTicketMessages,
  closeTicket,
  approvedTicket,
  getTicket,
  getTicketsByUser,
  getAllTickets,
  getFilteredTickets,
  getRecentTicketsByUser,
  getSizeDocuments,
  getTicketByUserId,
};
