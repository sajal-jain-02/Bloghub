const userModel = require("../models/user.model");
const mongoose = require("mongoose");

async function getPublicProfile(req, res) {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

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

        // Build response - never include email in public profile
        const responseData = {
            message: "Profile fetched",
            isOwner: isOwner,
            user: {
                id: user._id,
                username: user.username,
                profilePhoto: user.profilePhoto,
                coverPhoto: user.coverPhoto,
                bio: user.bio
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

        res.status(200).json({
            message: "Profile fetched",
            isOwner: true,
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

module.exports = {
    getPublicProfile,
    getOwnProfile,
    updateOwnProfile
};
