const mongoose = require("mongoose");

function validateObjectId(paramName) {
    return (req, res, next) => {
        try{
            const id = req.params[paramName];
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    message: "Invalid ID"
                });
            }
            next();
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error"
            });
        }
    };
}

module.exports = validateObjectId;