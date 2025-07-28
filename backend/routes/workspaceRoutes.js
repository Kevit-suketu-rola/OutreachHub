const express = require("express");
const {
  addMember,
  deleteMember,
  getAllWorkspacesForAdmin,
  getAllWorkspacesForUser,
  createWorkspace,
} = require("../controllers/workspaceController");
const authMiddleware = require("../Middleware/authMiddleware");

const workspaceRouter = express.Router();

// Admin routes (protected)
workspaceRouter.get("/getAll", authMiddleware, getAllWorkspacesForAdmin);
workspaceRouter.post("/create", authMiddleware, createWorkspace);

// User routes (protected)
workspaceRouter.get(
  "/user/workspaces",
  authMiddleware,
  getAllWorkspacesForUser
);

module.exports = workspaceRouter;
