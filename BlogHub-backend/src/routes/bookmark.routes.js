const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const { bookmarkPost, removeBookmark, getBookmarks } = require("../controler/bookmark.controller");
const validateObjectId = require("../middlewares/validateObjectId.middleware");

router.post('/:postId', authMiddleware, validateObjectId('postId'), bookmarkPost)
router.get('/', authMiddleware, getBookmarks)
router.delete('/:postId', authMiddleware, validateObjectId('postId'), removeBookmark)



module.exports = router;