const mongoose = require("mongoose");

const idempotencyKeySchema = new mongoose.Schema(
    {
        key: {
            type: String,
            required: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },

        requestHash: {
            type: String,
            required: true
        },

        responseStatus: {
            type: Number
        },

        responseBody: {
            type: mongoose.Schema.Types.Mixed
        }
    },
    {
        timestamps: true,
        expires: 86400 // Auto-delete after 24 hours (in seconds)
    }
);

idempotencyKeySchema.index(
    { user: 1, key: 1 },
    { unique: true }
);

const idempotencyKeyModel = mongoose.model("idempotencyKey", idempotencyKeySchema);

module.exports = idempotencyKeyModel;