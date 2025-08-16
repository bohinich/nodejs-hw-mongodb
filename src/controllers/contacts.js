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
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const contacts = await getAllContacts(page, perPage, sortBy, sortOrder, filter, req.user.id);
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const contact = await getContactById(req.params.contactId, req.user.id);
  if (!contact) throw new createHttpError.NotFound('Contact not found');

  res.json({
    status: 200,
    message: `Successfully found contact with id ${req.params.contactId}`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const photoUrl = req.file ? (await uploadToCloudinary(req.file.path)).secure_url : null;

  const contact = await createContact({
    ...req.body,
    photo: photoUrl,
    userId: req.user.id,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const deleteContactController = async (req, res) => {
  const contact = await deleteContact(req.params.contactId, req.user.id);
  if (!contact) throw new createHttpError.NotFound('Contact not found');

  res.json({
    status: 200,
    message: `Successfully deleted contact with id ${req.params.contactId}`,
    data: contact,
  });
};

export const updateContactController = async (req, res) => {
  const contact = await updateContact(req.params.contactId, req.body, req.user.id);
  if (!contact) throw new createHttpError.NotFound('Contact not found');

  res.json({
    status: 200,
    message: 'Successfully updated a contact!',
    data: contact,
  });
};

export const replaceContactController = async (req, res) => {
  const { value, updatedExisting } = await replaceContact(req.params.contactId, req.body, req.user.id);

  res.status(updatedExisting ? 200 : 201).json({
    status: updatedExisting ? 200 : 201,
    message: updatedExisting ? 'Successfully updated a contact!' : 'Successfully created a contact!',
    data: value,
  });
};
