const mongoose = require("mongoose");

const followSchema = new mongoose.Schema({
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    following: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
}, {
    timestamps: true
});

// Prevent self-follows
followSchema.pre("save", function() {
    if (this.follower.toString() === this.following.toString()) {
        throw new Error("Cannot follow yourself");
    }
});

// Unique index to prevent duplicate follow relationships
followSchema.index(
    { follower: 1, following: 1 },
    { unique: true }
);

// Index for followers pagination (find all followers of a user)
followSchema.index(
    { following: 1, createdAt: -1, _id: 1 }
);

// Index for following pagination (find all users a user follows)
followSchema.index(
    { follower: 1, createdAt: -1, _id: 1 }
);

const followModel = mongoose.model("follow", followSchema);

module.exports = followModel;
