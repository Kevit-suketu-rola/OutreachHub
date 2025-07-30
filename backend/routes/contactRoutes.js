const express = require("express");
const authMiddleware = require("../Middleware/authMiddleware");
const { getAllContactsOfUser, addContact, getAllContactsOfWorkspace, deleteContact, editContact, filterContacts } = require("../controllers/contactController");

const contactRouter = express.Router();

contactRouter.get(
  "/workspace_getAll",
  authMiddleware,
  getAllContactsOfWorkspace
);
contactRouter.get("/user_getAll", authMiddleware, getAllContactsOfUser);
contactRouter.post("/add", authMiddleware, addContact);
contactRouter.delete("/delete/:contactId", authMiddleware, deleteContact);
contactRouter.patch("/edit/:contactId", authMiddleware, editContact);
contactRouter.get("/filter", authMiddleware, filterContacts);

module.exports = contactRouter;
