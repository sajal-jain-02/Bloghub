const express = require("express");
const Router = express.Router();
const postController = require("../controler/post.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validateObjectId = require("../middlewares/validateObjectId.middleware");
const idempotencyMiddleware = require("../middlewares/idempotency.middleware");

Router.post("/create", authMiddleware, idempotencyMiddleware, postController.createPost);
Router.get('/', postController.getAllPosts)
Router.get('/:id', validateObjectId('id'), postController.getPostByID)
Router.patch('/:id', authMiddleware, idempotencyMiddleware, validateObjectId('id'), postController.updatePost)
Router.delete('/:id', authMiddleware, idempotencyMiddleware, validateObjectId('id'), postController.deletePost)


module.exports = Router;