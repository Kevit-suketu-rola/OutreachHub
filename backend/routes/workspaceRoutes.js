const express = require("express");
const {
  addMember,
  deleteMember,
  getAllWorkspacesForAdmin,
  getAllWorkspacesForUser,
  createWorkspace,
  setWorkspace,
  deleteWorkspace,
  addTagsToWorkspace,
  removeTagsFromWorkspace,
} = require("../controllers/workspaceController");
const authMiddleware = require("../Middleware/authMiddleware");

const workspaceRouter = express.Router();

// Admin routes (protected)
workspaceRouter.get("/getAll", authMiddleware, getAllWorkspacesForAdmin);
workspaceRouter.post("/create", authMiddleware, createWorkspace);
workspaceRouter.delete("/delete", authMiddleware, deleteWorkspace);
workspaceRouter.post("/setWorkspace", authMiddleware, setWorkspace);
workspaceRouter.patch("/addTags", authMiddleware, addTagsToWorkspace);
workspaceRouter.patch("/removeTags", authMiddleware, removeTagsFromWorkspace);

// User routes (protected)
workspaceRouter.get("/getAll/:userId", authMiddleware, getAllWorkspacesForUser);

module.exports = workspaceRouter;
