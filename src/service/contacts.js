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
    ContactsCollection.find().countDocuments(contactQuery),
    contactQuery
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(perPage),
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
  const contacts = await ContactsCollection.findOne({ _id: contactId, userId });
  return contacts;
};

export const createContact = async (payload) => {
  const contact = await ContactsCollection.create(payload);
  return contact;
};
export const deleteContact = async (contactId, userId) => {
  const contact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });
  return contact;
};
export const updataContact = async (contactId, payload, userId) => {
  const contact = await ContactsCollection.findByIdAndUpdate(
    contactId,
    payload,
    userId,
    { new: true },
  );
  return contact;
};

export const replaceContact = async (contactId, payload, userId) => {
  const contact = await ContactsCollection.findByIdAndUpdate(
    contactId,
    payload,
    userId,
    { new: true, upsert: true },
  );
  return {
    value: contact,
    updatedExisting: contact.lastErrorObject.updatedExisting,
  };
};