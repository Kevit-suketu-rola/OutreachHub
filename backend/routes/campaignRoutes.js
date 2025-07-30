const express = require("express");
const authMiddleware = require("../Middleware/authMiddleware");
const {
  createCampaign,
  deleteCampaign,
  editCampaign,
  getAllCampaignStatus,
  getCampaignById,
  getAllContactsByCampaignTag,
  getAllCampaignsOfUser,
  getAllCampaignsOfWorkspace,
} = require("../controllers/campaignController");

const campaignRouter = express.Router();

campaignRouter.post("/create", authMiddleware, createCampaign);
campaignRouter.delete("/delete/:campaignId", authMiddleware, deleteCampaign);
campaignRouter.patch("/edit/:campaignId", authMiddleware, editCampaign);
campaignRouter.get("/getAllStatus", authMiddleware, getAllCampaignStatus);
campaignRouter.get("/get/:campaignId", authMiddleware, getCampaignById);
campaignRouter.get("/user_getAll", authMiddleware, getAllCampaignsOfUser);
campaignRouter.get(
  "/workspace_getAll",
  authMiddleware,
  getAllCampaignsOfWorkspace
);
campaignRouter.get(
  "/filter/:campaignId",
  authMiddleware,
  getAllContactsByCampaignTag
);

module.exports = campaignRouter;
