const ImageKit = require("imagekit");

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

/**
 * Upload a file to ImageKit
 * @param {Buffer} file - File buffer
 * @param {string} fileName - Name for the file in ImageKit
 * @param {string} folder - Folder path in ImageKit (optional)
 * @returns {Promise<Object>} ImageKit upload response with url and fileId
 */
async function uploadFile(file, fileName, folder = "profile-photos") {
    try {
        const uploadResponse = await imagekit.upload({
            file: file,
            fileName: fileName,
            folder: folder,
            useUniqueFileName: false
        });

        return {
            url: uploadResponse.url,
            fileId: uploadResponse.fileId
        };
    } catch (error) {
        console.error("ImageKit upload error:", error);
        throw new Error("Failed to upload image to ImageKit");
    }
}

/**
 * Delete a file from ImageKit
 * @param {string} fileId - ImageKit file ID to delete
 * @returns {Promise<boolean>} True if deletion succeeded
 */
async function deleteFile(fileId) {
    try {
        await imagekit.deleteFile(fileId);
        return true;
    } catch (error) {
        console.error("ImageKit deletion error:", error);
        // Don't throw error - deletion failures should be non-critical
        return false;
    }
}

module.exports = {
    uploadFile,
    deleteFile
};
