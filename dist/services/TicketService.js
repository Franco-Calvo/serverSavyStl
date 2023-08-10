var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import TicketModel from "../models/Ticket.model.js";
import TicketResponseModel from "../models/TicketResponse.model.js";
export const defaultPagination = {
    items: [],
    size: 0,
};
export const itemsPerPage = 7;
const addTicket = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (data.userId) {
        try {
            const new_ticket = new TicketModel(data);
            const result = yield new_ticket.save();
            return result;
        }
        catch (err) {
            console.log(err);
            return null;
        }
    }
    else {
        return null;
    }
});
const setRepliedByUser = (message) => __awaiter(void 0, void 0, void 0, function* () {
    const ticket = yield TicketModel.findOneAndUpdate({
        _id: message.ticketId,
    }, { $set: { unreadMsg: { admin: true, user: false }, status: "user-reply" } });
});
const setRepliedByAdmin = (message) => __awaiter(void 0, void 0, void 0, function* () {
    const ticket = yield TicketModel.findOneAndUpdate({
        _id: message.ticketId,
    }, { $set: { unreadMsg: { admin: false, user: true }, status: "replied" } });
});
const addMessageToTicket = (message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const new_message = new TicketResponseModel(message);
        const result = yield new_message.save();
        if (result) {
            message.author == "admin"
                ? yield setRepliedByAdmin(result)
                : yield setRepliedByUser(result);
            return result;
        }
    }
    catch (err) {
        return null;
    }
    return null;
});
const getTicketMessages = (ticketId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ticket_messages = yield TicketResponseModel.find({
            ticketId,
        }).sort({ createdAt: 1 });
        return ticket_messages;
    }
    catch (err) {
        return [];
    }
});
const closeTicket = (userId, _id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield TicketModel.findOneAndUpdate({
            _id,
            userId,
        }, { $set: { status: "closed" } }, { new: true });
        return result;
    }
    catch (err) {
        return null;
    }
});
const approvedTicket = (userId, _id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield TicketModel.findOneAndUpdate({
            _id,
            userId,
        }, { $set: { status: "approved" } }, { new: true });
        return result;
    }
    catch (err) {
        return null;
    }
});
const getSizeDocuments = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    const size = yield TicketModel.countDocuments(filters);
    return size;
});
const getFilteredTickets = (page, filters) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield TicketModel.find(filters)
            .sort({
            createdAt: -1,
        })
            .skip(itemsPerPage * page)
            .limit(itemsPerPage);
        return result;
    }
    catch (err) {
        console.log(err);
        return [];
    }
});
const getRecentTicketsByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = { userId };
        const result = yield getFilteredTickets(0, filters);
        const size = yield getSizeDocuments(filters);
        return {
            items: result,
            size: size,
        };
    }
    catch (err) {
        console.log(err);
        return defaultPagination;
    }
});
const getTicket = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield TicketModel.findOne({ _id });
        return result;
    }
    catch (err) {
        return null;
    }
});
const getTicketsByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield TicketModel.find({
            userId,
        }).sort({
            createdAt: -1,
        });
        return result;
    }
    catch (err) {
        console.log(err);
        return [];
    }
});
const getTicketByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield TicketModel.findOne({ userId });
        return result;
    }
    catch (err) {
        return null;
    }
});
export default {
    addTicket,
    addMessageToTicket,
    getTicketMessages,
    closeTicket,
    approvedTicket,
    getTicket,
    getTicketsByUser,
    getFilteredTickets,
    getRecentTicketsByUser,
    getSizeDocuments,
    getTicketByUserId,
};
