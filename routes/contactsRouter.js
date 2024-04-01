import express from "express";

import {
  getAllContacts,
  deleteContact,
  createContact,
  updateContact,
  getOneContact,
} from "../controllers/contactsControllers.js";

import validateBody from "../helpers/validateBody.js";
import {
  createdContactSchema,
  updatedContactSchema,
} from "../schemas/contactsSchemas.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post("/", validateBody(createdContactSchema), createContact);

contactsRouter.put("/:id", validateBody(updatedContactSchema), updateContact);

export default contactsRouter;
