const express = require("express");
const Workspace = require("../models/Workspace");
const mongoose = require("mongoose");
const Admin = require("../models/Admin");
const WorkspaceUser = require("../models/WorkspaceUser");
const User = require("../models/User");

// Add member to a workspace (Admin only)
const addMember = async (req, res) => {
  const { workspaceId, userId } = req.body;

  let isAdmin = Admin.findOne({ _id: req.user.adminId });
  if (!isAdmin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    let workspace = await Workspace.findById(workspaceId);
    let workspaceUser = await WorkspaceUser.findOne({
      workspaceId,
      userId,
    });
    // console.log(workspace, workspaceUser);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // Check if the user is already a member
    if (workspaceUser) {
      return res.status(400).json({ message: "User is already a member" });
    }

    workspaceUser = new WorkspaceUser({
      _id: new mongoose.Types.ObjectId(),
      workspaceId,
      userId,
      permissions: {
        write: req.body.permissions.write,
        allowAdd: req.body.permissions.allowAdd,
      },
    });

    let user = await User.updateOne(
      { _id: userId },
      { $addToSet: { workspaces: workspaceId } },
      { new: true }
    );
    console.log(user);

    await workspaceUser.save();

    res.json({ message: "Member added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add member" });
  }
};

// Delete member from a workspace (Admin)
const deleteMember = async (req, res) => {
  const { workspaceId, userId } = req.body;

  let isAdmin = Admin.findOne({ _id: req.user.adminId });
  if (!isAdmin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const workspaceUser = await WorkspaceUser.findOneAndDelete({
      workspaceId,
      userId,
    });

    if (!workspaceUser) {
      return res.status(404).json({ message: "No such User in workspace" });
    }

    await WorkspaceUser.deleteOne({ workspaceId, userId });
    await User.updateOne(
      { _id: userId },
      { $pull: { workspaces: workspaceId } },
      { new: true }
    );

    res.json({ message: "Member deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete member" });
  }
};

//get all users in workspace
const getAllUsersOfWorkspace = async (req, res) => {
  const workspaceId = req.params.workspaceId;
  try {
    const workspaceUsers = await WorkspaceUser.find({ workspaceId })
      .populate("userId")
      .exec();
    const users = workspaceUsers.map((wu) => wu.userId);
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve users" });
  }
};

module.exports = {
  addMember,
  deleteMember,
  getAllUsersOfWorkspace,
};
