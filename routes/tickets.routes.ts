import express, { Router } from "express";
import TicketController from "../controllers/Tickets/Ticket.controller.js";
const router: Router = express.Router();

// router.post("/", validator(ticketSchema), createTicket);
// router.put("/:id", validator(ticketSchema), updateTicketStatus);
// router.post("/:id/messages", validator(ticketSchema), addMessageToTicket);

router.get("/:id", TicketController.getTicket);
router.get("/messages/:id", TicketController.getTicketMessages);
router.get("/recents/:id", TicketController.getRecentsTickets);

router.post("/", TicketController.createTicket);
router.post("/message", TicketController.addMessage);
router.post("/filtered", TicketController.getFilteredTickets);

router.put("/", TicketController.closeTicket);

export default router;
