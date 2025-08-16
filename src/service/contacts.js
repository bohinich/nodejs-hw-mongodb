import { ContactsCollection } from '../models/сontacts.js';

export const getAllContacts = async (
  page,
  perPage,
  sortBy,
  sortOrder,
  filter = {},
  userId,
) => {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const contactQuery = ContactsCollection.find({ userId });

  if (typeof filter.type !== 'undefined') {
    contactQuery.where('contactType').equals(filter.type);
  }
  if (typeof filter.isFavourite !== 'undefined') {
    contactQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const [total, contacts] = await Promise.all([
    ContactsCollection.countDocuments({ userId, ...filter }),
    contactQuery.sort({ [sortBy]: sortOrder }).skip(skip).limit(perPage),
  ]);

  const totalPage = Math.ceil(total / perPage);

  return {
    contacts,
    total,
    page,
    perPage,
    totalPage,
    hasNextPage: totalPage > page,
    hasPreviousPage: page > 1,
  };
};

export const getContactById = async (contactId, userId) => {
  return ContactsCollection.findOne({ _id: contactId, userId });
};

export const createContact = async (payload) => {
  return ContactsCollection.create(payload);
};

export const deleteContact = async (contactId, userId) => {
  return ContactsCollection.findOneAndDelete({ _id: contactId, userId });
};

export const updateContact = async (contactId, payload, userId) => {
  return ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    { new: true }
  );
};

export const replaceContact = async (contactId, payload, userId) => {
  const contact = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    { new: true, upsert: true, returnDocument: 'after' }
  );

  return {
    value: contact,
    updatedExisting: !!contact,
  };
};
