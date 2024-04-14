import express from "express";
import { contactsControllers } from "../controllers/contacts.js";
import { validateBody, validateJWT, isValidId } from "../middlewars/index.js";
import {
  createdContactSchema,
  updatedContactSchema,
  updateFavoriteSchema,
} from "../schemas/contactsSchemas.js";

const contactsRouter = express.Router();

contactsRouter.get("/", validateJWT, contactsControllers.getAllContacts);

contactsRouter.get(
  "/:id",
  validateJWT,
  isValidId,
  contactsControllers.getOneContact
);

contactsRouter.post(
  "/",
  validateJWT,
  validateBody(createdContactSchema),
  contactsControllers.createContact
);

contactsRouter.delete(
  "/:id",
  validateJWT,
  isValidId,
  contactsControllers.deleteContact
);

contactsRouter.put(
  "/:id",
  validateJWT,
  isValidId,
  validateBody(updatedContactSchema),
  contactsControllers.updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  validateJWT,
  validateBody(updateFavoriteSchema),
  isValidId,
  contactsControllers.updateFavorite
);

export default contactsRouter;
