const userModel = require("../models/user.model");
const followModel = require("../models/follow.model");
const mongoose = require("mongoose");

async function getPublicProfile(req, res) {
    try {
        const { userId } = req.params;

        const user = await userModel
            .findById(userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Determine if visitor is the profile owner
        const isOwner = req.user && req.user.id === userId.toString();

        // Calculate follow counts
        const followersCount = await followModel.countDocuments({ following: userId });
        const followingCount = await followModel.countDocuments({ follower: userId });

        // Calculate isFollowing
        let isFollowing = false;
        if (req.user && !isOwner) {
            const follow = await followModel.findOne({
                follower: req.user.id,
                following: userId
            });
            isFollowing = !!follow;
        }

        // Build response - never include email in public profile
        const responseData = {
            message: "Profile fetched",
            isOwner: isOwner,
            user: {
                id: user._id,
                username: user.username,
                profilePhoto: user.profilePhoto,
                coverPhoto: user.coverPhoto,
                bio: user.bio,
                followersCount,
                followingCount,
                isFollowing
            }
        };

        // If viewing own profile via /:userId, include email
        if (isOwner) {
            responseData.user.email = user.email;
        }

        res.status(200).json(responseData);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function getOwnProfile(req, res) {
    try {
        const user = await userModel
            .findById(req.user.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Calculate follow counts
        const followersCount = await followModel.countDocuments({ following: req.user.id });
        const followingCount = await followModel.countDocuments({ follower: req.user.id });

        res.status(200).json({
            message: "Profile fetched",
            isOwner: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profilePhoto: user.profilePhoto,
                coverPhoto: user.coverPhoto,
                bio: user.bio,
                followersCount,
                followingCount,
                isFollowing: false
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function updateOwnProfile(req, res) {
    try {
        const { bio } = req.body;

        if (bio !== undefined) {
            if (typeof bio !== "string") {
                return res.status(400).json({
                    message: "Bio must be a string"
                });
            }

            if (bio.length > 500) {
                return res.status(400).json({
                    message: "Bio must not exceed 500 characters"
                });
            }
        }

        const user = await userModel.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (bio !== undefined) {
            user.bio = bio;
        }

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profilePhoto: user.profilePhoto,
                coverPhoto: user.coverPhoto,
                bio: user.bio
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function followUser(req, res) {
    try {
        const { userId } = req.params;
        const currentUserId = req.user.id;

        if (currentUserId === userId) {
            return res.status(400).json({
                message: "Cannot follow yourself"
            });
        }

        const targetUser = await userModel.findById(userId);
        if (!targetUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const follow = await followModel.create({
            follower: currentUserId,
            following: userId
        });

        res.status(201).json({
            message: "User followed successfully",
            follow: {
                id: follow._id,
                follower: follow.follower,
                following: follow.following,
                createdAt: follow.createdAt
            }
        });

    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Already following this user"
            });
        }
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function unfollowUser(req, res) {
    try {
        const { userId } = req.params;
        const currentUserId = req.user.id;

        const follow = await followModel.findOneAndDelete({
            follower: currentUserId,
            following: userId
        });

        if (!follow) {
            return res.status(404).json({
                message: "Not following this user"
            });
        }

        res.status(200).json({
            message: "User unfollowed successfully"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function getFollowers(req, res) {
    try {
        const { userId } = req.params;

        const page = Math.max(1, parseInt(req.query.page) || 1);
        let limit = Math.max(1, parseInt(req.query.limit) || 10);

        if (limit > 50) {
            limit = 50;
        }

        const skip = (page - 1) * limit;

        const targetUser = await userModel.findById(userId);
        if (!targetUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const follows = await followModel
            .find({ following: userId })
            .populate('follower', 'username profilePhoto coverPhoto bio')
            .sort({ createdAt: -1, _id: 1 })
            .skip(skip)
            .limit(limit);

        const totalItems = await followModel.countDocuments({ following: userId });
        const totalPages = Math.ceil(totalItems / limit);
        const hasNextPage = page < totalPages;

        const followers = follows
            .filter(follow => follow.follower !== null)
            .map(follow => ({
                id: follow.follower._id,
                username: follow.follower.username,
                profilePhoto: follow.follower.profilePhoto,
                coverPhoto: follow.follower.coverPhoto,
                bio: follow.follower.bio
            }));

        res.status(200).json({
            message: "Followers fetched",
            followers,
            pagination: {
                currentPage: page,
                limit,
                totalItems,
                totalPages,
                hasNextPage
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function getFollowing(req, res) {
    try {
        const { userId } = req.params;

        const page = Math.max(1, parseInt(req.query.page) || 1);
        let limit = Math.max(1, parseInt(req.query.limit) || 10);

        if (limit > 50) {
            limit = 50;
        }

        const skip = (page - 1) * limit;

        const targetUser = await userModel.findById(userId);
        if (!targetUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const follows = await followModel
            .find({ follower: userId })
            .populate('following', 'username profilePhoto coverPhoto bio')
            .sort({ createdAt: -1, _id: 1 })
            .skip(skip)
            .limit(limit);

        const totalItems = await followModel.countDocuments({ follower: userId });
        const totalPages = Math.ceil(totalItems / limit);
        const hasNextPage = page < totalPages;

        const following = follows
            .filter(follow => follow.following !== null)
            .map(follow => ({
                id: follow.following._id,
                username: follow.following.username,
                profilePhoto: follow.following.profilePhoto,
                coverPhoto: follow.following.coverPhoto,
                bio: follow.following.bio
            }));

        res.status(200).json({
            message: "Following fetched",
            following,
            pagination: {
                currentPage: page,
                limit,
                totalItems,
                totalPages,
                hasNextPage
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

module.exports = {
    getPublicProfile,
    getOwnProfile,
    updateOwnProfile,
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing
};
