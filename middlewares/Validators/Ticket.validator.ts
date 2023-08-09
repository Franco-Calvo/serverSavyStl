import { Ticket } from "../../models/Ticket.model.js";

export const TICKET_TITLE_MAX_CHARS: number = 75;

export const regexMessage: RegExp =
  /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü0-9¿?¡!:;,.\-#"'()&\s]+$/;
export const regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü0123456789\s]+$/;

type TicketErrorsType = {
  userId: string;
  empty_title: string;
  empty_message: string;
  invalid_title: string;
  invalid_message: string;
  not_past_time: string;
  max_open_tickets: string;
  not_error: string;
};

export const TICKET_ERRORS: TicketErrorsType = {
  userId: "INVALID_ADDRESS",
  empty_title: "UNDEFINED_TITLE",
  empty_message: "UNDEFINED_MESSAGE",
  invalid_title: "INVALID_TITLE",
  invalid_message: "INVALID_MESSAGE",
  not_past_time: "INVALID_PAST_TIME",
  max_open_tickets: "MAX_OPEN_TICKETS",
  not_error: "NOT_ERROR",
};

export const validateTicketMessage = (message: string) => {
  const validLength: boolean = message.length > 0 && message.length < 999;
  return validLength && regexMessage.test(message);
};

export const errorsOnTicket = (ticket: Ticket) => {
  const { userId, title, message } = ticket;
  const errors: string[] = [];

  if (!userId.trim()) errors.push(TICKET_ERRORS.userId);

  if (!title.trim()) errors.push(TICKET_ERRORS.empty_title);

  // if (!message.trim()) errors.push(TICKET_ERRORS.empty_message);

  if (title.length > TICKET_TITLE_MAX_CHARS || !regexName.test(title.trim()))
    errors.push(TICKET_ERRORS.invalid_title);

  // if (!validateTicketMessage(message))
  //   errors.push(TICKET_ERRORS.invalid_message);

  return errors.length ? errors : [TICKET_ERRORS.not_error];
};
