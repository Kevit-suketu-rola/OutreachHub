const express = require("express");
const mongoose = require("mongoose");
const Campaign = require("../models/Campaign");
const { editContact } = require("./contactController");
const Workspace = require("../models/Workspace");
const WorkspaceUser = require("../models/WorkspaceUser");
const Contact = require("../models/Contact");
const MessageTemplate = require("../models/MessageTemplate");

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

const isValidUser = async (req, res) => {
  const userId = req.user.userId;
  const workspaceId = req.user.workspaceId;
  if (!(await WorkspaceUser.findOne({ workspaceId, userId }))) {
    return res.status(401).json({ message: "Invalid Request" });
  }
};

// create new campaign (user.userid)
const createCampaign = async (req, res) => {
  await isAllowedUser(req, res);

  let template = await MessageTemplate.findById(req.body.templateId);

  if (!template || template.workspaceId != req.user.workspaceId) {
    return res.status(401).json({ message: "Invalid template" });
  }

  try {
    const campaign = new Campaign({
      _id: new mongoose.Types.ObjectId(),
      workspaceId: req.user.workspaceId,
      creator: req.user.userId,
      lastModifiedBy: req.user.userId,
      templateId: req.body.templateId,
      name: req.body.name,
      tags: req.body.tags,
      status: "Draft",
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    });

    await campaign.save();

    res.status(201).json({ message: "Campaign created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to create campaign", err });
  }
};

// remove campaign
const deleteCampaign = async (req, res) => {
  const campaignId = req.params.campaignId;
  let campaign = await Campaign.findById(campaignId);

  await isAllowedUser(req, res);

  if (campaign.status == "Running") {
    return res.status(401).json({ message: "Campaign is running" });
  }
  try {
    await Campaign.findByIdAndDelete(campaignId);
    res.status(201).json({ message: "Campaign deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete campaign", err });
  }
};

// update campaign
const editCampaign = async (req, res) => {
  const campaignId = req.params.campaignId;
  const { name, tags, status, startDate, endDate, templateId } = req.body;

  await isAllowedUser(req, res);

  let campaign = await Campaign.findById(campaignId);

  if (!campaign) {
    return res.status(401).json({ message: "Invalid campaign" });
  }

  if (!(await MessageTemplate.findById(templateId))) {
    return res.status(401).json({ message: "Invalid template" });
  }

  if (status == "Running") {
    return res.status(401).json({ message: "Campaign is running" });
  }

  try {
    await Campaign.findOneAndUpdate(
      {
        _id: campaignId,
      },
      {
        $set: {
          templateId: templateId || campaign.templateId,
          lastModifiedBy: req.user.userId,
          name: name || campaign.name,
          tags: tags || campaign.tags,
          startDate: startDate || campaign.startDate,
          endDate: endDate || campaign.endDate,
        },
      }
    );
    res.status(201).json({ message: "Campaign edited successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to edit campaign" });
  }
};

// get all campaign status
const getAllCampaignStatus = async (req, res) => {
  const workspaceId = req.user.workspaceId;

  await isValidUser(req, res);

  try {
    let statuses = await Campaign.find({ workspaceId }, { status: 1, name: 1 });
    res.status(200).json({ message: "Got all", statuses });
  } catch (err) {
    res.status(500).json({ message: "Failed to get all" });
  }
};

// get campaign by id
const getCampaignById = async (req, res) => {
  const campaignId = req.params.campaignId;

  await isValidUser(req, res);

  try {
    let statuses = await Campaign.findOne(
      { _id: campaignId },
    );
    res.status(200).json({ message: "Got all", statuses });
  } catch (err) {
    res.status(500).json({ message: "Failed to get all" });
  }
};

// get all campaigns of a user
const getAllCampaignsOfUser = async (req, res) => {
  const userId = req.user.userId;

  await isValidUser(req, res);

  try {
    let campaigns = await Campaign.find({ creator: userId });
    res.status(200).json({ message: "Got all", campaigns });
  } catch (err) {
    res.status(500).json({ message: "Failed to get all" });
  }
};

// get all campaigns of a workspace
const getAllCampaignsOfWorkspace = async (req, res) => {
  const workspaceId = req.user.workspaceId;

  await isValidUser(req, res);

  try {
    let campaigns = await Campaign.find({ workspaceId });
    res.status(200).json({ message: "Got all", campaigns });
  } catch (err) {
    res.status(500).json({ message: "Failed to get all" });
  }
};

// get all contacts by campaign tag (open campaign page -> filtered contact by tag)
const getAllContactsByCampaignTag = async (req, res) => {
  await isValidUser(req, res);

  const campaignId = req.params.campaignId;
  const result = await Campaign.findOne(
    { _id: campaignId },
    { tags: 1, _id: 0 }
  );
  let tags = result.tags;

  try {
    let contacts = await Contact.find({ tags: { $in: tags } });
    res.status(200).json({ message: "Got all", contacts });
  } catch (err) {
    res.status(500).json({ message: "Failed to get all" });
  }
};

module.exports = {
  createCampaign,
  deleteCampaign,
  editCampaign,
  getAllCampaignStatus,
  getCampaignById,
  getAllCampaignsOfUser,
  getAllCampaignsOfWorkspace,
  getAllContactsByCampaignTag,
};
