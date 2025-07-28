const express = require("express");
const Workspace = require("../models/Workspace");
const mongoose = require("mongoose");
const Admin = require("../models/Admin");
const WorkspaceUser = require("../models/WorkspaceUser");

// Admin: Get all workspaces
const getAllWorkspacesForAdmin = async (req, res) => {
  let isAdmin = Admin.findOne({ _id: req.user.adminId });
  if (!isAdmin) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const workspaces = await Workspace.find();
    res.json({ message: "Got all workspaces", workspaces });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve workspaces" });
  }
};

// User: Get all workspaces for a specific user ID
const getAllWorkspacesForUser = async (req, res) => {
  try {
    const workspaceUsers = await WorkspaceUser.find({ userId })
      .populate("workspaceId")
      .exec();
    const workspaces = workspaceUsers.map((wu) => wu.workspaceId);
    res.json(workspaces);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve workspaces" });
  }
};

//create workspaces
const createWorkspace = async (req, res) => {
  const adminId = req.user.adminId;
  try {
    const admin = await Admin.findById(adminId, { _id: 1 });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    const workspace = await Workspace.findOne(
      { name: req.body.name },
      { _id: 1 }
    );
    if (workspace) {
      return res.status(400).json({ message: "Workspace already exists" });
    }
    const newWorkspace = new Workspace({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      creator: adminId,
      description: req.body.description || "",
      tags: req.body.tags || [],
      creationDate: new Date(),
    });
    // const response = await newWorkspace.create(newWorkspace);
    const response = await newWorkspace.save();
    res
      .status(201)
      .json({ message: "Workspace created successfully", data: response });
  } catch (err) {
    res.status(500).json({ message: "Failed to create workspace", error: err });
  }
};

module.exports = {
  getAllWorkspacesForAdmin,
  getAllWorkspacesForUser,
  createWorkspace,
};
