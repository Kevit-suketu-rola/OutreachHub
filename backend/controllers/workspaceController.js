const express = require("express");
const jwt = require("jsonwebtoken");
const Workspace = require("../models/Workspace");
const mongoose = require("mongoose");
const Admin = require("../models/Admin");
const WorkspaceUser = require("../models/WorkspaceUser");
const User = require("../models/User");

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
  const userId = req.user.userId;
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

//edit workspace
const editWorkspace = async (req, res) => {
  const workspaceId = req.params.workspaceId;
  const adminId = req.user.adminId;

  let isAdmin = !!(await Admin.findOne({ _id: req.user.adminId }).select(
    "name"
  ));
  if (!isAdmin) return res.status(401).json({ message: "Unauthorized" });

  try {
    await Workspace.updateOne(
      { _id: workspaceId },
      {
        $set: {
          name: req.body.name,
          description: req.body.description,
        },
      }
    );
    res.status(200).json({ message: "Workspace edited successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to edit workspace" });
  }
};

//delete workspace
const deleteWorkspace = async (req, res) => {
  let isAdmin = !!(await Admin.findOne({ _id: req.user.adminId }).select(
    "name"
  ));
  if (!isAdmin) return res.status(401).json({ message: "Unauthorized" });

  const workspaceId = req.body.workspaceId;
  console.log(workspaceId);

  try {
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }
    //deleting from WorkspaceUser
    await WorkspaceUser.deleteMany({ workspaceId });
    //deleting from User
    await User.updateMany(
      { workspaces: workspaceId },
      { $pull: { workspaces: workspaceId } }
    );

    await Workspace.deleteOne({ _id: workspaceId });
    res.json({ message: "Workspace deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete workspace", error: err });
  }
};

//set workspace
const setWorkspace = async (req, res) => {
  const workspaceId = req.body.workspaceId;

  let tokenObject = {
    adminId: req.user.adminId,
    userId: req.user.userId,
    workspaceId: workspaceId,
  };
  try {
    if (!req.user.adminId) {
      const isInWorkspace = !!(await User.findOne({
        _id: new mongoose.Types.ObjectId(req.user.userId),
        workspaces: workspaceId,
      }).select("_id"));

      if (!isInWorkspace) {
        return res.status(401).json({ message: "Not in workspace" });
      }
      tokenObj = {
        userId: req.user.userId,
        workspaceId: workspaceId,
      };
    }
    // console.log(tokenObject);

    const token = jwt.sign(tokenObject, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Workspace set successfully", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to set workspace", err });
  }
};

//add tags to workspace
const addTagsToWorkspace = async (req, res) => {
  // may change
  const workspaceId = req.body.workspaceId;
  const tags = req.body.tags;
  let isAdmin = !!(await Admin.findOne({ _id: req.user.adminId }).select(
    "name"
  ));

  if (!isAdmin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    let workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      res.status(404).json({ message: "Workspace not found" });
    }

    for (let tag of tags) {
      // console.log(tag);
      if (!workspace.tags.includes(tag)) {
        workspace.tags.push(tag);
      }
    }

    await workspace.save();
    res.json({ message: "Tag added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to add tag" });
  }
};

// remove tags from workspace
const removeTagsFromWorkspace = async (req, res) => {
  let tags = req.body.tags;
  // may change
  const workspaceId = req.body.workspaceId;

  let isAdmin = !!(await Admin.findOne({ _id: req.user.adminId }).select(
    "name"
  ));
  if (!isAdmin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!tags || !workspaceId) {
    return res.status(400).json({ message: "Invalid request" });
  }
  let workspace = await Workspace.findById(workspaceId);

  try {
    for (let tag of tags) {
      if (workspace.tags.includes(tag)) {
        workspace.tags.splice(workspace.tags.indexOf(tag), 1);
      }
    }
    await workspace.save();
    res.json({ message: "Tags removed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove tags" });
  }
};

module.exports = {
  getAllWorkspacesForAdmin,
  getAllWorkspacesForUser,
  createWorkspace,
  editWorkspace,
  deleteWorkspace,
  setWorkspace,
  addTagsToWorkspace,
  removeTagsFromWorkspace,
};
