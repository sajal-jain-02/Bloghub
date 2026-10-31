const express = require("express");
const Router = express.Router();
const authController = require("../controler/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

Router.post("/register", authController.registerUser);
Router.post("/login", authController.loginUser);

Router.get("/me", authMiddleware, authController.getMe);

module.exports = Router;