const express = require("express");
const mongoose = require("mongoose");
const Contact = require("../models/Contact");
const WorkspaceUser = require("../models/WorkspaceUser");

const isAllowedUser = async (req, res) => {
  const workspaceId = req.user.workspaceId;
  const userId = req.user.userId;

  let isWriteTrue = !!(await WorkspaceUser.findOne({
    workspaceId,
    userId,
    "permissions.write": true,
  }));

  let isInsideWorkspace = req.user.workspaceId;

  if (!isWriteTrue && !isInsideWorkspace) {
    return res.status(401).json({ message: "Permission denied" });
  }
};

// get all contacts by workspace
const getAllContactsOfWorkspace = async (req, res) => {
  const workspaceId = req.user.workspaceId;
  try {
    const contacts = await Contact.find({ workspaceId });
    res.status(200).json({ message: "Got all ", contacts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve contacts" });
  }
};

// get all contacts of user
const getAllContactsOfUser = async (req, res) => {
  const userId = req.user.userId;
  try {
    const contacts = await Contact.find({ creator: userId });
    res.status(200).json({ message: "Got all ", contacts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve contacts" });
  }
};

// add new contact
const addContact = async (req, res) => {
  const workspaceId = req.user.workspaceId;
  const userId = req.user.userId;

  await isAllowedUser(req, res);

  try {
    const contact = new Contact({
      _id: new mongoose.Types.ObjectId(),
      workspaceId,
      creator: userId,
      name: req.body.name,
      profilePicture: req.body.profilePicture,
      contactInfo: {
        email: req.body.contactInfo.email,
        phoneNo: req.body.contactInfo.phoneNo,
        countryCode: req.body.contactInfo.countryCode,
      },
      tags: req.body.tags,
      company: req.body.company,
      jobTitle: req.body.jobTitle,
    });
    await contact.save();

    res.status(201).json({ message: "Contact added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to add contact", err });
  }
};

// remove contact
const deleteContact = async (req, res) => {
  const userId = req.user.userId;

  await isAllowedUser(req, res);

  try {
    const contact = await Contact.findOneAndDelete({
      _id: req.params.contactId,
      creator: userId,
    });

    res.status(201).json({ message: "Contact deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete contact", err });
  }
};

// edit contact
const editContact = async (req, res) => {
  const contactId = req.params.contactId;
  const { name, profilePicture, contactInfo, company, jobTitle } = req.body;

  await isAllowedUser(req, res);

  try {
    const contact = await Contact.findOneAndUpdate(
      {
        _id: contactId,
      },
      {
        $set: {
          name: name,
          profilePicture: profilePicture,
          contactInfo: {
            email: contactInfo.email,
            phoneNo: contactInfo.phoneNo,
            countryCode: contactInfo.countryCode,
          },
          company: company,
          jobTitle: jobTitle,
        },
        $push: {
          tags: req.body.tags,
        },
      }
    );
    res.status(201).json({ message: "Contact edited successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to edit contact" });
  }
};

// filter contact by tags
const filterContacts = async (req, res) => {
  let tags = req.query.tags?.split(",") || [];
  const workspaceId = req.user.workspaceId;

  try {
    const contacts = await Contact.find({ workspaceId, tags: { $all: tags } });
    res.status(200).json({ message: "Got all", contacts });
  } catch (err) {
    res.status(500).json({ message: "Failed to filter contacts", err });
  }
};

module.exports = {
  getAllContactsOfWorkspace,
  getAllContactsOfUser,
  addContact,
  deleteContact,
  editContact,
  filterContacts,
};
