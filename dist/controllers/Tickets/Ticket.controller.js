var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TICKET_ERRORS, errorsOnTicket, validateTicketMessage, } from "../../middlewares/Validators/Ticket.validator.js";
import { ERROR_MESSAGES, errorHandler, successHandler, } from "../../middlewares/response_handler.js";
import { secondsRequiredForSendMessage, } from "../../models/TicketResponse.model.js";
import TicketService, { defaultPagination, } from "../../services/TicketService.js";
// import { adminAddresses, sendMessageToAdmins } from "../helpers/relayers.js";
// import { emitEventToAddress } from "./SocketController.js";
const createTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ticketRequest = req.body;
    const errorsTicket = errorsOnTicket(ticketRequest);
    if (errorsTicket.includes(TICKET_ERRORS.not_error)) {
        const userTickets = yield TicketService.getTicketsByUser(ticketRequest.userId);
        const openedTickets = userTickets.filter((ticket) => ticket.status !== "closed");
        if (openedTickets.length < 3) {
            const ticket = yield TicketService.addTicket(ticketRequest);
            if (ticket) {
                // sendMessageToAdmins("updateTickets", {});
                return successHandler(ticket, req, res);
            }
        }
        else {
            return res
                .status(400)
                .send({ status: "failed", message: TICKET_ERRORS.max_open_tickets });
        }
    }
    else {
        return res.status(400).send({
            status: "failed",
            message: errorsTicket[0],
        });
    }
    return errorHandler(ERROR_MESSAGES.UNEXPECTED_ERROR, req, res);
});
const getPastTimeOfLastMessage = (ticketId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const lastMessages = yield TicketService.getTicketMessages(ticketId);
    if (!lastMessages.length ||
        ((_a = lastMessages[lastMessages.length - 1]) === null || _a === void 0 ? void 0 : _a.author) === "admin")
        return false;
    const pastTimeOfLastMessage = lastMessages.find((msg) => {
        const timeMsg = new Date(msg.createdAt).getTime();
        const actTime = Date.now();
        return (actTime - timeMsg < secondsRequiredForSendMessage &&
            msg.author == "user");
    });
    return pastTimeOfLastMessage ? pastTimeOfLastMessage : false;
});
const addMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const message = req.body;
    const validMessage = validateTicketMessage(message.text);
    if (validMessage) {
        const pastTimeOfLastMessage = yield getPastTimeOfLastMessage(message.ticketId);
        if (message.author !== "user" || !pastTimeOfLastMessage) {
            const new_message = yield TicketService.addMessageToTicket(message);
            if (new_message)
                return successHandler(new_message, req, res);
        }
        else {
            return res.status(400).send({
                status: "failed",
                message: TICKET_ERRORS.not_past_time,
            });
        }
    }
    return res.status(400).send({
        status: "failed",
        message: TICKET_ERRORS.invalid_message,
    });
});
const getTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Aquí el "id" sería el "userId" enviado desde el front
    const ticket = yield TicketService.getTicketByUserId(id);
    if (ticket) {
        try {
            // Aquí puedes agregar la lógica que desees para manejar el ticket obtenido por el userId
            return successHandler(ticket, req, res);
        }
        catch (err) {
            return errorHandler(ERROR_MESSAGES.INVALID_PARAMETERS, req, res);
        }
    }
    else {
        return errorHandler(ERROR_MESSAGES.NO_EXIST_ON_DATABASE, req, res);
    }
});
const closeTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ticketRequest = req.body;
    // if (
    //   !adminAddresses.includes(signatureAddress) &&
    //   ticketRequest.address !== signatureAddress
    // )
    //   return errorHandler(ERROR_MESSAGES.INVALID_SIGNATURE, req, res);
    const ticket_closed = yield TicketService.closeTicket(ticketRequest.userId, ticketRequest._id);
    if (!ticket_closed)
        return errorHandler(ERROR_MESSAGES.NO_EXIST_ON_DATABASE, req, res);
    // sendMessageToAdmins("updateTickets", {
    //   type: "closeTicket",
    //   payload: ticket_closed,
    // });
    // emitEventToAddress(getAddress(ticket_closed.address), "updateTickets", {
    //   type: "closeTicket",
    //   payload: ticket_closed,
    // });
    return successHandler(ticket_closed, req, res);
});
const getRecentsTickets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    // if (address !== signatureAddress)
    //   return errorHandler(ERROR_MESSAGES.INVALID_SIGNATURE, req, res);
    const tickets = yield TicketService.getRecentTicketsByUser(userId);
    if (tickets)
        return successHandler(tickets, req, res);
    return errorHandler(ERROR_MESSAGES.EMPTY_RESPONSE, req, res);
});
const getFilteredTickets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, page } = req.body;
    // if (address !== signatureAddress)
    //   return errorHandler(ERROR_MESSAGES.INVALID_SIGNATURE, req, res);
    try {
        const filterQuery = {
            userId,
        };
        const tickets = yield TicketService.getFilteredTickets(page, filterQuery);
        if (!tickets)
            return successHandler(defaultPagination, req, res);
        const size = page === 0 ? yield TicketService.getSizeDocuments(filterQuery) : -1;
        const message = {
            items: tickets,
            size,
        };
        return successHandler(message, req, res);
    }
    catch (err) {
        return errorHandler(ERROR_MESSAGES.INVALID_PARAMETERS, req, res);
    }
});
const getTicketMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ticketId = req.params.id;
    const messages = yield TicketService.getTicketMessages(ticketId);
    if (messages)
        return successHandler(messages, req, res);
    return errorHandler(ERROR_MESSAGES.EMPTY_RESPONSE, req, res);
});
export default {
    getTicket,
    createTicket,
    addMessage,
    closeTicket,
    getRecentsTickets,
    getTicketMessages,
    getFilteredTickets,
};
