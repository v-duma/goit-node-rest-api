import express from "express";

import {
  getAllContacts,
  deleteContact,
  createContact,
  updateContact,
  getOneContact,
  patchUpdateContact,
} from "../controllers/contactsControllers.js";

import validateBody from "../helpers/validateBody.js";
import {
  createdContactSchema,
  updatedContactSchema,
  patchSchema,
} from "../schemas/contactsSchemas.js";
import { isValidId } from "../helpers/isValidId.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", isValidId, deleteContact);

contactsRouter.post("/", validateBody(createdContactSchema), createContact);

contactsRouter.put("/:id", validateBody(updatedContactSchema), updateContact);

contactsRouter.patch(
  "/:id/favorite",
  validateBody(patchSchema),
  patchUpdateContact
);

export default contactsRouter;
