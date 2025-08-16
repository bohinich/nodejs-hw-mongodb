import createHttpError from 'http-errors';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  replaceContact,
  updateContact,
} from '../service/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const contacts = await getAllContacts(
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    req.user.id
  );

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId, req.user.id);

  if (!contact) {
    throw new createHttpError.NotFound('Contact not found');
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const contactData = {
    ...req.body,
    userId: req.user.id,
  };

  if (req.file && req.file.path) {
    contactData.photo = req.file.path;
  }

  const contact = await createContact(contactData);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await deleteContact(contactId, req.user.id);

  if (!contact) {
    throw new createHttpError.NotFound('Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully deleted contact id ${contactId}!`,
    data: contact,
  });
};

export const updateContactController = async (req, res) => {
  const { contactId } = req.params;
  const updateData = { ...req.body };

  if (req.file && req.file.path) {
    updateData.photo = req.file.path;
  }

  const contact = await updateContact(contactId, updateData, req.user.id);

  if (!contact) {
    throw new createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: 'Successfully updated contact!',
    data: contact,
  });
};

export const replaceContactController = async (req, res) => {
  const { contactId } = req.params;
  const updateData = { ...req.body };

  if (req.file && req.file.path) {
    updateData.photo = req.file.path;
  }

  const { value, updatedExisting } = await replaceContact(
    contactId,
    updateData,
    req.user.id
  );

  if (updatedExisting) {
    return res.json({
      status: 200,
      message: 'Successfully replaced a contact!',
      data: value,
    });
  }

  return res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: value,
  });
};
