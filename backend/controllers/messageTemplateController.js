const express = require("express");
const mongoose = require("mongoose");
const MessageTemplate = require("../models/MessageTemplate");
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

// create new message template - if "permissions.write":true
const createMessageTemplate = async (req, res) => {
  const workspaceId = req.user.workspaceId;

  await isAllowedUser(req, res);

  try {
    const messageTemplate = new MessageTemplate({
      _id: new mongoose.Types.ObjectId(),
      workspaceId,
      type: req.body.type,
      title: req.body.title,
      templateImage: req.body.templateImage,
      template: req.body.template,
    });

    await messageTemplate.save();
    res.status(201).json({ message: "Message template created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to create message template", err });
  }
};

// edit message template (Userld)
const editMessageTemplate = async (req, res) => {
  await isAllowedUser(req, res);

  try {
    await MessageTemplate.findOneAndUpdate(
      {
        _id: req.params.mtId,
      },
      {
        $set: {
          type: req.body.type,
          title: req.body.title,
          templateImage: req.body.templateImage,
          template: req.body.template,
        },
      }
    );
    res.status(201).json({ message: "Message template edited successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to edit message template" });
  }
};

// delete message template
const deleteMessageTemplate = async (req, res) => {
  const mtId = req.params.mtId;

  await isAllowedUser(req, res);

  try {
    await MessageTemplate.findByIdAndDelete(mtId);
    res.status(201).json({ message: "Message template deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete message template" });
  }
};

// get message template (templateld)
const getMessageTemplate = async (req, res) => {
  try {
    const mtId = req.params.mtId;
    const messageTemplate = await MessageTemplate.findById(mtId);
    res
      .status(201)
      .json({ message: "Message template found", messageTemplate });
  } catch (err) {
    res.status(500).json({ message: "Failed to find message template" });
  }
};

// get all message templates (workspaceld)
const getMessageTemplateForWorkspace = async (req, res) => {
  try {
    const workspaceId = req.user.workspaceId;
    const messageTemplates = await MessageTemplate.find({ workspaceId });
    res
      .status(201)
      .json({ message: "Message templates found", messageTemplates });
  } catch (err) {
    res.status(500).json({ message: "Failed to find message templates" });
  }
};

module.exports = {
  createMessageTemplate,
  editMessageTemplate,
  deleteMessageTemplate,
  getMessageTemplate,
  getMessageTemplateForWorkspace,
};
