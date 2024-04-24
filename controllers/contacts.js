import { Contact } from "../models/contact.js";

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const result = await Contact.find({ owner }, "", {
    skip,
    limit: Number(limit),
  }).populate("owner", "name email");
  res.json(result);
};

const getOneContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findOne({ _id: id })
    .where("owner")
    .equals(owner);
  if (!result) {
    return res.status(404).json({ message: "Not found" });
  }
  res.status(200).json(result);
};

const createContact = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findByIdAndDelete(id)
    .where("owner")
    .equals(owner);
  if (!result) {
    return res.status(404).json({ message: "Not found" });
  }
  res.json({ message: "Delete success" });
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true })
    .where("owner")
    .equals(owner);
  if (!result) {
    return res.status(404).json({ message: "Not found" });
  }
  res.json(result);
};

const updateFavorite = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true })
    .where("owner")
    .equals(owner);
  if (!result) {
    return res.status(404).json({ message: "Not found" });
  }
  res.json(result);
};

export const contactsControllers = {
  getAllContacts,
  getOneContact,
  createContact,
  deleteContact,
  updateContact,
  updateFavorite,
};
