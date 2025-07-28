const express = require("express");
const { login, signup } = require("../controllers/adminController");

const adminRouter = express.Router();

adminRouter.post("/signup", signup);
adminRouter.post("/login", login);

module.exports = adminRouter;
