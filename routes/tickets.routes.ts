import express, { Router } from "express";
import TicketController from "../controllers/Tickets/Ticket.controller.js";
const router: Router = express.Router();

router.get("/:id", TicketController.getTicket);
router.get("/messages/:id", TicketController.getTicketMessages);
router.get("/recents/:id", TicketController.getRecentsTickets);
router.get("/all", TicketController.getAllTickets)

router.post("/", TicketController.createTicket);
router.post("/message", TicketController.addMessage);
router.post("/filtered", TicketController.getFilteredTickets);

router.put("/", TicketController.closeTicket);

export default router;
