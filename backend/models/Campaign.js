const mongoose = require("mongoose");

const CampaignSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    required: true,
  },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MessageTemplate",
    required: true,
  },
  name: { type: String, required: true },
  creationDate: { type: Date, default: Date.now },
  tags: { type: [String], default: [] },
  status: {
    type: String,
    enum: ["Draft", "Running", "Completed"],
    default: "Draft",
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

module.exports = mongoose.model("Campaign", CampaignSchema);
