import createHttpError from 'http-errors';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  replaceContact,
  updataContact,
} from '../service/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

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
    req.user.id,
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
  const result = await uploadToCloudinary(req.file.path);
  console.log(result);

  const contact = await createContact({
    ...req.body,
    photo: result.secure_url, //: `http://localhost:5010/photos/${req.file.filename}`,
    userId: req.user.id,
  });
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await deleteContact(contactId, req.user.id);

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
  const contact = await updataContact(contactId, req.body, req.user.id);
  if (contact === null) {
    throw new createHttpError(404, 'Contact not found');
  }
  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: contact,
  });
};

export const replaceContactController = async (req, res) => {
  const { contactId } = req.params;
  const { value, updatedExisting } = await replaceContact(
    contactId,
    req.body,
    req.user.id,
  );

  if (updatedExisting === true) {
    return res.json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: value,
    });
  }
  return res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: value,
  });
};