const multer = require("multer");

const ALLOWED_MIME_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif"
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed."), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: MAX_FILE_SIZE
    },
    fileFilter: fileFilter
});

const uploadProfilePhoto = upload.single("profilePhoto");

const uploadCoverPhoto = upload.single("coverPhoto");

const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                message: "File size exceeds 5MB limit."
            });
        }
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).json({
                message: "Unexpected file field."
            });
        }
        return res.status(400).json({
            message: err.message
        });
    }

    if (err && err.message === "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.") {
        return res.status(400).json({
            message: err.message
        });
    }

    if (err) {
        return res.status(400).json({
            message: err.message
        });
    }

    next();
};

module.exports = {
    uploadProfilePhoto,
    uploadCoverPhoto,
    handleMulterError
};
