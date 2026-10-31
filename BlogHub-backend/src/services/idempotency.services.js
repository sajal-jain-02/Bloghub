const idempotencyKeyModel = require("../models/idempotencyKey.model");
const crypto = require("crypto");

async function findExistingKey(userId, key) {
    return idempotencyKeyModel.findOne({
        user: userId,
        key: key
    });
}

function createRequestHash(data) {
    return crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex");
}

async function saveIdempotencyKey(userId, key, requestHash, responseStatus, responseBody, session) {
    return idempotencyKeyModel.create(
        [
            {
                key,
                user: userId,
                requestHash,
                responseStatus,
                responseBody
            }
        ],
        { session }
    );
}

module.exports = {
    findExistingKey,
    createRequestHash,
    saveIdempotencyKey
};