const express = require("express");
const Router = express.Router();
const profileController = require("../controler/profile.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const optionalAuthMiddleware = require("../middlewares/optionalAuth.middleware");
const validateObjectId = require("../middlewares/validateObjectId.middleware");
const { uploadProfilePhoto, uploadCoverPhoto, handleMulterError } = require("../middlewares/upload.middleware");

// IMPORTANT: /me and /:userId/action routes must be registered before /:userId to avoid route conflicts

Router.get("/me", authMiddleware, profileController.getOwnProfile);
Router.patch("/me", authMiddleware, profileController.updateOwnProfile);
Router.post("/:userId/follow", authMiddleware, validateObjectId("userId"), profileController.followUser);
Router.delete("/:userId/follow", authMiddleware, validateObjectId("userId"), profileController.unfollowUser);
Router.post("/me/profile-photo", authMiddleware, uploadProfilePhoto, profileController.uploadProfilePhoto);
Router.post("/me/cover-photo", authMiddleware, uploadCoverPhoto, profileController.uploadCoverPhoto);
Router.get("/:userId/followers", optionalAuthMiddleware, validateObjectId("userId"), profileController.getFollowers);
Router.get("/:userId/following", optionalAuthMiddleware, validateObjectId("userId"), profileController.getFollowing);
Router.get("/:userId", optionalAuthMiddleware, validateObjectId("userId"), profileController.getPublicProfile);

Router.use(handleMulterError);

module.exports = Router;
