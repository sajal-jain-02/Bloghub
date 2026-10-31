function idempotencyMiddleware(req, res, next) {
    const key = req.get("Idempotency-Key");

    if (!key || !key.trim()) {
        return res.status(400).json({
            message: "Idempotency-Key header is required"
        });
    }

    req.idempotencyKey = key.trim();

    next();
}

module.exports = idempotencyMiddleware;