const express = require('express');
const Router = express.Router();
const commentController = require('../controler/comment.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validateObjectId = require('../middlewares/validateObjectId.middleware')

Router.post('/:postId/Comments',authMiddleware, validateObjectId('postId'),commentController.createComment);
Router.get('/:postId/Comments', validateObjectId('postId'), commentController.getComments);
Router.delete('/:commentId',authMiddleware, validateObjectId('commentId'), commentController.deleteComments);
Router.patch('/:commentId',authMiddleware, validateObjectId('commentId'), commentController.updateComment);



module.exports = Router;