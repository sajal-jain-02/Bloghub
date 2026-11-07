const likeModel = require("../models/like.model");
const postModel = require("../models/post.model");
const userModel = require("../models/user.model");

async function likePost(req, res) {
    try {
        const postId = req.params.postId;
        const userId = req.user.id;

        const post = await postModel.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const like = await likeModel.create({
            post: postId,
            user: userId
        });

        return res.status(201).json({
            message: "Post liked successfully",
            like: {
                id: like._id,
                post: like.post,
                user: like.user,
                createdAt: like.createdAt
            }
        });

    } catch (error) {
        console.log("Like creation failed:", error);
        if (error.code === 11000) {
            return res.status(200).json({
                message: "Post already liked"
            });
        }
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function removeLike(req, res) {
    try {
        const postId = req.params.postId;
        const userId = req.user.id;

        const like = await likeModel.findOneAndDelete({
            post: postId,
            user: userId
        });

        const post = await postModel.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }


        if (!like) {
            return res.status(404).json({
                message: "Like not found"
            });
        }

        return res.status(200).json({
            message: "Like removed successfully"
        });

    } catch (error) {
        console.log("Like removal failed:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


module.exports = {
    likePost,
    removeLike
};
