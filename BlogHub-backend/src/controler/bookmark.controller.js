const bookmarkModel = require("../models/bookmark.model");
const postModel = require("../models/post.model");
const likeModel = require("../models/like.model");
const commentModel = require("../models/comment.model");

async function bookmarkPost(req, res) {
    try{
        const postId = req.params.postId;
        const userId = req.user.id;

        const post = await postModel.findById(postId);

        if(!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const bookmark = await bookmarkModel.create({
            post: postId,
            user: userId
        });

        return res.status(201).json({
            message: "Post bookmarked successfully",
            bookmark: {
                id: bookmark._id,
                post: bookmark.post,
                user: bookmark.user,
                createdAt: bookmark.createdAt
            }
        });

    } catch (error) {
        console.log("Bookmark creation failed:", error);
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Post already bookmarked"
            });
        }
        return res.status(500).json({
            message: "Internal server error"
        });
    }

}

async function getBookmarks(req, res) {
    try{
        const userId = req.user.id;
        const bookmarks = await bookmarkModel
            .find({user: userId})
            .populate({
                path: 'post',
                populate: {
                    path: 'author',
                    select: 'username profilePhoto bio'
                }
            })
            .sort({createdAt: -1});

        const validBookmarks = bookmarks.filter((b) => b.post != null);

        const enhancedBookmarks = await Promise.all(
            validBookmarks.map(async (b) => {
                const postObj = b.post.toObject ? b.post.toObject() : b.post;
                const likesCount = await likeModel.countDocuments({
                    post: postObj._id
                });
                const commentsCount = await commentModel.countDocuments({
                    post: postObj._id
                });
                const isLiked = !!(await likeModel.exists({
                    user: userId,
                    post: postObj._id
                }));

                return {
                    ...b.toObject(),
                    post: {
                        ...postObj,
                        likesCount,
                        commentsCount,
                        isLiked,
                        isBookmarked: true
                    }
                };
            })
        );

        return res.status(200).json({
            message: "Bookmarks fetched successfully",
            bookmarks: enhancedBookmarks
        });

    } catch (error) {
        console.log("Bookmarks fetch failed:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function removeBookmark(req, res) {
    try{
        const postId = req.params.postId;
        const userId = req.user.id;

        const bookmark = await bookmarkModel.findOneAndDelete({
            post: postId,
            user: userId
        });

        if(!bookmark) {
            return res.status(404).json({
                message: "Bookmark not found"
            });
        }

        return res.status(200).json({
            message: "Bookmark removed successfully"
        });

    } catch (error) {
        console.log("Bookmark removal failed:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

module.exports = {
    bookmarkPost,
    getBookmarks,
    removeBookmark
}
