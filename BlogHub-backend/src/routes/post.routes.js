const express = require("express");
const Router = express.Router();
const postController = require("../controler/post.controller");
const likeController = require("../controler/like.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const optionalAuthMiddleware = require("../middlewares/optionalAuth.middleware");
const validateObjectId = require("../middlewares/validateObjectId.middleware");
const idempotencyMiddleware = require("../middlewares/idempotency.middleware");

Router.post("/create", authMiddleware, idempotencyMiddleware, postController.createPost);
Router.get('/', optionalAuthMiddleware, postController.getAllPosts)
Router.get('/user/:userId', validateObjectId('userId'), optionalAuthMiddleware, postController.getUserPosts)
Router.get('/:id', validateObjectId('id'), optionalAuthMiddleware, postController.getPostByID)
Router.patch('/:id', authMiddleware, idempotencyMiddleware, validateObjectId('id'), postController.updatePost)
Router.delete('/:id', authMiddleware, idempotencyMiddleware, validateObjectId('id'), postController.deletePost)
Router.post('/:postId/like', authMiddleware, validateObjectId('postId'), likeController.likePost)
Router.delete('/:postId/like', authMiddleware, validateObjectId('postId'), likeController.removeLike)

module.exports = Router;