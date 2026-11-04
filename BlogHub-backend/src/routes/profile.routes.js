const express = require("express");
const Router = express.Router();
const profileController = require("../controler/profile.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const optionalAuthMiddleware = require("../middlewares/optionalAuth.middleware");

// IMPORTANT: /me routes must be registered before /:userId to avoid route conflicts

Router.get("/me", authMiddleware, profileController.getOwnProfile);

Router.patch("/me", authMiddleware, profileController.updateOwnProfile);

Router.get("/:userId", optionalAuthMiddleware, profileController.getPublicProfile);

module.exports = Router;
