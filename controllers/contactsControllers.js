import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

import { updatedContactSchema } from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const result = await contactsService.listContacts();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsService.getContactById(id);
    if (!result) {
      throw HttpError(404);
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await contactsService.removeContact(id);
    if (!result) {
      throw HttpError(404);
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const newContact = await contactsService.addContact(name, email, phone);
    res.status(201).json(newContact);
    console.log(newContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
    next(error);
  }
};

export const updateContact = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  if (!name && !email && !phone && Object.keys(req.body).length === 0) {
    return res
      .status(400)
      .json({ message: "Body must have at least one field" });
  }
  const { error } = updatedContactSchema.validate({ name, email, phone });
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  const updatedContact = await contactsService.updateContactService(
    id,
    name,
    email,
    phone
  );

  if (updatedContact) {
    res.status(201).json(updatedContact);
  } else {
    res.status(404).json({ message: "Not found" });
  }
};

export const patchUpdateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { favorite } = req.body;

    if (typeof favorite !== "boolean") {
      return res
        .status(400)
        .json({ message: "Favorite must be a boolean value" });
    }

    const updatedContact = await contactsService.updateStatusContact(
      id,
      favorite
    );

    if (updatedContact) {
      res.status(200).json(updatedContact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    console.error(`Error updating contact status: ${error}`);
    res.status(500).json({ message: "Server error" });
  }
};
