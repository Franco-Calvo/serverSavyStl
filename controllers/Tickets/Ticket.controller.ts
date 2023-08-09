import { Request, Response } from "express";
import { FilterQuery } from "mongoose";
import {
  TICKET_ERRORS,
  errorsOnTicket,
  validateTicketMessage,
} from "../../middlewares/Validators/Ticket.validator.js";
import {
  ERROR_MESSAGES,
  errorHandler,
  successHandler,
} from "../../middlewares/response_handler.js";
import { Ticket, TicketServiceResponse } from "../../models/Ticket.model.js";
import {
  IMessageTicket,
  secondsRequiredForSendMessage,
} from "../../models/TicketResponse.model.js";
import TicketService, {
  defaultPagination,
  paginationType,
} from "../../services/TicketService.js";
// import { adminAddresses, sendMessageToAdmins } from "../helpers/relayers.js";
// import { emitEventToAddress } from "./SocketController.js";

const createTicket = async (req: Request, res: Response): Promise<Response> => {
  const ticketRequest: Ticket = req.body;

  const errorsTicket: string[] = errorsOnTicket(ticketRequest);

  if (errorsTicket.includes(TICKET_ERRORS.not_error)) {
    const userTickets: Ticket[] = await TicketService.getTicketsByUser(
      ticketRequest.userId
    );

    const openedTickets: Ticket[] = userTickets.filter(
      (ticket) => ticket.status !== "closed"
    );

    if (openedTickets.length < 3) {
      const ticket: TicketServiceResponse = await TicketService.addTicket(
        ticketRequest
      );

      if (ticket) {
        // sendMessageToAdmins("updateTickets", {});
        return successHandler(ticket, req, res);
      }
    } else {
      return res
        .status(400)
        .send({ status: "failed", message: TICKET_ERRORS.max_open_tickets });
    }
  } else {
    return res.status(400).send({
      status: "failed",
      message: errorsTicket[0],
    });
  }

  return errorHandler(ERROR_MESSAGES.UNEXPECTED_ERROR, req, res);
};

const getPastTimeOfLastMessage = async (
  ticketId: string
): Promise<IMessageTicket | boolean> => {
  const lastMessages: IMessageTicket[] = await TicketService.getTicketMessages(
    ticketId
  );

  if (
    !lastMessages.length ||
    lastMessages[lastMessages.length - 1]?.author === "admin"
  )
    return false;

  const pastTimeOfLastMessage: IMessageTicket | undefined = lastMessages.find(
    (msg) => {
      const timeMsg = new Date(msg.createdAt).getTime();
      const actTime = Date.now();

      return (
        actTime - timeMsg < secondsRequiredForSendMessage &&
        msg.author == "user"
      );
    }
  );

  return pastTimeOfLastMessage ? pastTimeOfLastMessage : false;
};

const addMessage = async (req: Request, res: Response): Promise<Response> => {
  const message = req.body;
  const validMessage: boolean = validateTicketMessage(message.text);

  if (validMessage) {
    const pastTimeOfLastMessage = await getPastTimeOfLastMessage(
      message.ticketId
    );

    if (message.author !== "user" || !pastTimeOfLastMessage) {
      const new_message: IMessageTicket | null =
        await TicketService.addMessageToTicket(message);

      if (new_message) return successHandler(new_message, req, res);
    } else {
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
};

const getTicket = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params; // Aquí el "id" sería el "userId" enviado desde el front
  const ticket: TicketServiceResponse = await TicketService.getTicketByUserId(
    id
  );

  if (ticket) {
    try {
      // Aquí puedes agregar la lógica que desees para manejar el ticket obtenido por el userId
      return successHandler(ticket, req, res);
    } catch (err) {
      return errorHandler(ERROR_MESSAGES.INVALID_PARAMETERS, req, res);
    }
  } else {
    return errorHandler(ERROR_MESSAGES.NO_EXIST_ON_DATABASE, req, res);
  }
};

const closeTicket = async (req: Request, res: Response): Promise<Response> => {
  const ticketRequest: Ticket = req.body;

  // if (
  //   !adminAddresses.includes(signatureAddress) &&
  //   ticketRequest.address !== signatureAddress
  // )
  //   return errorHandler(ERROR_MESSAGES.INVALID_SIGNATURE, req, res);

  const ticket_closed: TicketServiceResponse = await TicketService.closeTicket(
    ticketRequest.userId,
    ticketRequest._id
  );

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
};

const getRecentsTickets = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { userId } = req.body;

  // if (address !== signatureAddress)
  //   return errorHandler(ERROR_MESSAGES.INVALID_SIGNATURE, req, res);

  const tickets: paginationType = await TicketService.getRecentTicketsByUser(
    userId
  );

  if (tickets) return successHandler(tickets, req, res);

  return errorHandler(ERROR_MESSAGES.EMPTY_RESPONSE, req, res);
};

const getFilteredTickets = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { userId, page } = req.body;

  // if (address !== signatureAddress)
  //   return errorHandler(ERROR_MESSAGES.INVALID_SIGNATURE, req, res);

  try {
    const filterQuery: FilterQuery<Ticket> = {
      userId,
    };

    const tickets: Ticket[] = await TicketService.getFilteredTickets(
      page,
      filterQuery
    );

    if (!tickets) return successHandler(defaultPagination, req, res);

    const size: number =
      page === 0 ? await TicketService.getSizeDocuments(filterQuery) : -1;

    const message: paginationType = {
      items: tickets,
      size,
    };

    return successHandler(message, req, res);
  } catch (err) {
    return errorHandler(ERROR_MESSAGES.INVALID_PARAMETERS, req, res);
  }
};

const getTicketMessages = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const ticketId: string = req.params.id;

  const messages: IMessageTicket[] = await TicketService.getTicketMessages(
    ticketId
  );

  if (messages) return successHandler(messages, req, res);

  return errorHandler(ERROR_MESSAGES.EMPTY_RESPONSE, req, res);
};

export default {
  getTicket,
  createTicket,
  addMessage,
  closeTicket,
  getRecentsTickets,
  getTicketMessages,
  getFilteredTickets,
};
