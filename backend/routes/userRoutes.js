const express = require("express");
const {
  login,
  signup,
  deleteUser,
  updateUserProfile,
} = require("../controllers/userController");
const authMiddleware = require("../Middleware/authMiddleware");

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.put("/updateProfile/:userId", authMiddleware, updateUserProfile);
userRouter.delete("/delete/:userId", authMiddleware, deleteUser);

module.exports = userRouter;
