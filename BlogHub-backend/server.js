require("dotenv").config();

const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = require("./src/app");
const { connectDB } = require("./src/database/db");

async function startServer() {
    try {
        await connectDB();
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("ERROR: Failed to start server:", error.message);
        process.exitCode = 1;
    }
}

startServer();
