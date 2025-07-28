const mongoose = require("mongoose");

const MessageTemplateSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    required: true,
  },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: { type: String, enum: ["text", "text-image"], default: "text" },
  title: { type: String, required: true },
  campaignImage: {
    type: String,
  },
  template: { type: String, required: true },
});

module.exports = mongoose.model("MessageTemplate", MessageTemplateSchema);
