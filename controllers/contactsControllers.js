import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
// import { updatedContactSchema } from "../schemas/contactsSchemas.js";

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

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const bodyCheck = Object.keys(req.body).length === 0;

    if (bodyCheck) {
      throw HttpError(400, "Body must have at least one field");
    }

    const result = await contactsService.updateContact(id, req.body);

    if (!result) {
      throw HttpError(404);
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
