const express = require("express");
const authMiddleware = require("../Middleware/authMiddleware");
const {
  createMessageTemplate,
  editMessageTemplate,
  deleteMessageTemplate,
  getMessageTemplate,
  getMessageTemplateForWorkspace,
} = require("../controllers/messageTemplateController");

const messageTemplateRouter = express.Router();

messageTemplateRouter.post("/create", authMiddleware, createMessageTemplate);
messageTemplateRouter.patch("/edit/:mtId", authMiddleware, editMessageTemplate);
messageTemplateRouter.delete(
  "/delete/:mtId",
  authMiddleware,
  deleteMessageTemplate
);
messageTemplateRouter.get("/get/:mtId", authMiddleware, getMessageTemplate);
messageTemplateRouter.get(
  "/getAll",
  authMiddleware,
  getMessageTemplateForWorkspace
);

module.exports = messageTemplateRouter;
