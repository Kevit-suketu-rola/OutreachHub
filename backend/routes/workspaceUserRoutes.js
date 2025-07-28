const express = require("express");

const authMiddleware = require("../Middleware/authMiddleware");
const {
  deleteMember,
  addMember,
  getAllUsersOfWorkspace,
} = require("../controllers/workspaceUserController");

const workspaceUserRouter = express.Router();

// Admin routes (protected)
workspaceUserRouter.get("/getUsers/:workspaceId", authMiddleware, getAllUsersOfWorkspace);
workspaceUserRouter.post("/addMember", authMiddleware, addMember);
workspaceUserRouter.delete("/deleteMember", authMiddleware, deleteMember);

module.exports = workspaceUserRouter;
