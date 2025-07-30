const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { default: mongoose } = require("mongoose");
const e = require("express");
const WorkspaceUser = require("../models/WorkspaceUser");

// SignUp
const signup = async (req, res) => {
  const { name, password, contactInfo } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      name: name,
      password: hashedPassword,
      contactInfo: contactInfo,
    });
    await user.save();
  } catch (err) {
    console.log(err);

    return res.status(400).json({ message: "email already exists" });
  }

  res.json({ message: "User registered!" });
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ "contactInfo.email": email });

  if (!user) {
    return res.status(400).json({ message: "User doesn't exist" });
  }

  isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ message: "login successful", token });
};

// Update user profile
const updateUserProfile = async (req, res) => {
  const userId = req.params.userId;
  const { name, contactInfo } = req.body;

  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.name = name;
    user.contactInfo = contactInfo;
    await user.save();
    res.json({ message: "User profile updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update user profile" });
  }
};

// Delete
const deleteUser = async (req, res) => {
  const userId = req.params.userId;
  const password = req.body.password;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "User doesn't exist" });
    }

    isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // deleting from everywhere, keep campaigns created by the user
    await User.deleteOne({ _id: userId });
    await WorkspaceUser.deleteMany({ userId });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};

module.exports = { login, signup, deleteUser, updateUserProfile };
