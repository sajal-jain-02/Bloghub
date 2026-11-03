const express = require("express");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.routes");
const postRouter = require("./routes/post.routes");
const commentRouter = require("./routes/comment.routes");
const bookmarkRouter = require("./routes/bookmark.routes");
const cors = require('cors');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true 
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);
app.use("/api/comment", commentRouter);
app.use("/api/bookmarks", bookmarkRouter);

module.exports = app;
