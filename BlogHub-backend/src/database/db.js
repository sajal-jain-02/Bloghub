const mongoose = require("mongoose");

async function connectDB() {
    if (!process.env.MONGODB_URI) {
        console.error("ERROR: MONGODB_URI environment variable is not set");
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to database");
    } catch (error) {
        console.error("ERROR: Failed to connect to database:", error.message);
        process.exit(1);
    }
}

module.exports = {connectDB};
