import fs from "fs/promises";
import crypto from "crypto";
import path from "path";

const contactsPath = path.join("db", "contacts.json");

async function listContacts() {
  try {
    return JSON.parse(await fs.readFile(contactsPath, "utf-8"));
  } catch (error) {
    return null;
  }
}

async function getAllContacts() {
  const contacts = await listContacts();

  return contacts;
}

async function getContactById(id) {
  try {
    const contacts = await listContacts();
    return contacts.find((contact) => contact.id === id) || null;
  } catch (error) {
    return null;
  }
}

async function addContact(name, email, phone) {
  try {
    const contacts = await listContacts();
    const newContact = {
      id: crypto.randomUUID(),
      name,
      email,
      phone,
    };
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null));
    return newContact;
  } catch (error) {
    return null;
  }
}

async function removeContact(id) {
  try {
    const contacts = await listContacts();
    const removedContact = contacts.find((contact) => contact.id === id);
    if (removedContact) {
      const updatedContacts = contacts.filter((contact) => contact.id !== id);
      await fs.writeFile(
        contactsPath,
        JSON.stringify(updatedContacts, null, 2)
      );
      return removedContact || null;
    }
  } catch (error) {
    return null;
  }
}

async function updateContact(id, body) {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex((contact) => contact.id === id);
    if (index !== -1) {
      const updatedContact = { ...contacts[index], ...body };
      contacts[index] = updatedContact;
      await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
      return updatedContact;
    }
  } catch (error) {
    return null;
  }
}

export default {
  listContacts,
  getAllContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
