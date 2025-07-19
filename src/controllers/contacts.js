import createHttpError from 'http-errors';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  replaceContact,
  updataContact,
} from '../services/contacts.js';

export const getContactsController = async (req, res) => {
  const contacts = await getAllContacts();
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (contact === null) {
    throw new createHttpError.NotFound('Contact not found');
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const contact = await createContact(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await deleteContact(contactId);

  if (contact === null) {
    throw createHttpError.NotFound('Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully delete contact id ${contactId}!`,
    data: contact,
  });
};

export const updataContactController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await updataContact(contactId, req.body);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: contact,
  });
};

export const replaceContactController = async (req, res) => {
  const contact = await replaceContact(req.params.id, req.body);
  if (!contact || !contact.value) {
    throw createHttpError(404, 'Contact not found');
  }
  if (contact.updatedExisting) {
    return res.json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: contact.value,
    });
  }
  return res.json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact.value,
  });
};