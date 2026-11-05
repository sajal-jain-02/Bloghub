const postModel = require("../models/post.model");
const commentModel = require("../models/comment.model");
const bookmarkModel = require("../models/bookmark.model");
const mongoose = require("mongoose");
const { findExistingKey, createRequestHash, saveIdempotencyKey } = require("../services/idempotency.service");

async function respondWithExistingIdempotencyResult(res, userId, key, requestHash) {
    const existing = await findExistingKey(userId, key);
    if (!existing) {
        return false;
    }

    if (existing.requestHash !== requestHash) {
        res.status(409).json({
            message: "Idempotency key already used with different request data"
        });
        return true;
    }

    res.status(existing.responseStatus).json(existing.responseBody);
    return true;
}

async function recoverDuplicateIdempotencyKey(res, userId, key, requestHash) {
    try {
        return await respondWithExistingIdempotencyResult(res, userId, key, requestHash);
    } catch (error) {
        console.log("Failed to recover idempotency key:", error);
        return false;
    }
}

async function abortTransactionSafely(session) {
    if (!session?.inTransaction()) {
        return;
    }
    try {
        await session.abortTransaction();
    } catch (error) {
        console.log("Failed to abort transaction:", error);
    }
}

async function createPost(req, res) {
    const { title, content } = req.body || {};

    if(
        typeof title !== "string" ||
        typeof content !== "string" ||
        !title.trim() ||
        !content.trim()
    ) {
        return res.status(400).json({
            message:"Title and content are required"
        })
    }

    const requestHash = createRequestHash({ title, content });

    let session;

    try {
        if (await respondWithExistingIdempotencyResult(res, req.user.id, req.idempotencyKey, requestHash)) {
            return;
        }

        session = await mongoose.startSession();
        session.startTransaction();

        const [post] = await postModel.create(
            [{
                title: title.trim(),
                content: content.trim(),
                author: req.user.id
            }],
            { session }
        );

        const responseBody = {
            message:"Post created successfully",
            post:{
                title: post.title,
                content: post.content,
                author: post.author
            }
        };

        await saveIdempotencyKey(
            req.user.id,
            req.idempotencyKey,
            requestHash,
            201,
            responseBody,
            session
        );

        await session.commitTransaction();

        res.status(201).json(responseBody);

    } catch(error) {
        await abortTransactionSafely(session);

        if (error.code === 11000) {
            if (await recoverDuplicateIdempotencyKey(res, req.user.id, req.idempotencyKey, requestHash)) {
                return;
            }
        }

        console.log(error);
        return res.status(500).json({
            message:"Internal server error"
        })
    } finally {
        if (session) session.endSession();
    }
}

async function getAllPosts(req, res) {

    try{
        let page = Number(req.query.page ?? 1);
        if(!Number.isInteger(page) || page <=0 ){
            return res.status(400).json({
                message:"Invalid page number"
            })
        }
        let limit = Number(req.query.limit ?? 10);
        if(!Number.isInteger(limit) || limit <=0 ){
            return res.status(400).json({
                message:"Invalid limit"
            })
        }
        if(limit > 100){
            return res.status(400).json({
                message:"Limit cannot exceed 100"
            })
        }
        const sort = req.query.sort ?? "newest";

        if (!["newest", "oldest"].includes(sort)) {
            return res.status(400).json({
                message: "Invalid sort value"
            });
        }

        const sortDirection = sort === "newest" ? -1 : 1;

        const search = req.query.search;

        let filter = {};

        if (search !== undefined) {
            if (typeof search !== "string") {
                return res.status(400).json({
                    message: "Invalid search parameter"
                });
            }

            const trimmedSearch = search.trim();

            if (trimmedSearch.length === 0) {
                return res.status(400).json({
                    message: "Search parameter cannot be empty"
                });
            }

            if (trimmedSearch.length > 100) {
                return res.status(400).json({
                    message: "Search parameter is too long (maximum 100 characters)"
                });
            }

            const escapedSearch = trimmedSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            filter = {
                $or: [
                    { title: { $regex: escapedSearch, $options: 'i' } },
                    { content: { $regex: escapedSearch, $options: 'i' } }
                ]
            };
        }

        const posts = await postModel
        .find(filter)
        .sort({ createdAt: sortDirection })
        .skip((page - 1) * limit)
        .limit(limit);

        const totalPosts = await postModel.countDocuments(filter);
        const totalPages = Math.ceil(totalPosts / limit);


        res.status(200).json({
            message:"Posts fetched successfully",
            posts,
            totalPages: totalPages,
            totalPosts: totalPosts,
            currentPage: page
        })

    } catch(error){
        console.log(error);
        return res.status(500).json({
            message:"Internal server error",
        })
    }
}

async function getPostByID (req, res) {
    try{
        const { id } = req.params;
        const post = await postModel.findById(id);
        if(!post){
            return res.status(404).json({
                message:"Post not found"
            })
        }
        res.status(200).json({
            message:"Post fetched successfully",
            post
        })
    } catch(error){
        console.log(error);
        return res.status(500).json({
            message:"Internal server error",
        })
    }
}

async function updatePost(req, res) {
    const { id } = req.params;

    const title = req.body.title
    const content = req.body.content

    if (title === undefined && content === undefined) {
        return res.status(400).json({
            message: "At least one field (title or content) is required"
        });
    }

    if (
        (title !== undefined && (typeof title !== "string" || !title.trim())) ||
        (content !== undefined && (typeof content !== "string" || !content.trim()))
    ) {
        return res.status(400).json({
            message: "Invalid input"
        });
    }

    const requestHash = createRequestHash({ id, title, content });

    let session;

    try {
        if (await respondWithExistingIdempotencyResult(res, req.user.id, req.idempotencyKey, requestHash)) {
            return;
        }

        session = await mongoose.startSession();
        session.startTransaction();

        const post = await postModel.findById(id).session(session);

        if(!post){
            await session.abortTransaction();
            return res.status(404).json({
                message:"Post not found"
            })
        }

        if(post.author.toString() !== req.user.id.toString()){
            await session.abortTransaction();
            return res.status(403).json({
                message:"You are not authorized to update this post"
            })
        }

        if(title !== undefined){
            post.title = title.trim()
        }

        if(content !== undefined){
            post.content = content.trim()
        }

        await post.save({ session });

        const responseBody = {
            message:"Post updated successfully",
            post
        };

        await saveIdempotencyKey(
            req.user.id,
            req.idempotencyKey,
            requestHash,
            200,
            responseBody,
            session
        );

        await session.commitTransaction();

        return res.status(200).json(responseBody);

    } catch(error){
        await abortTransactionSafely(session);

        if (error.code === 11000) {
            if (await recoverDuplicateIdempotencyKey(res, req.user.id, req.idempotencyKey, requestHash)) {
                return;
            }
        }

        console.log(error);
        return res.status(500).json({
            message:"Internal server error",
        })
    } finally {
        if (session) session.endSession();
    }
}

async function deletePost(req, res) {
    const {id} = req.params;

    const requestHash = createRequestHash({ id });

    let session;

    try{
        if (await respondWithExistingIdempotencyResult(res, req.user.id, req.idempotencyKey, requestHash)) {
            return;
        }

        session = await mongoose.startSession();
        session.startTransaction();

        const post = await postModel.findById(id).session(session);

        if(!post){
            await session.abortTransaction();
            return res.status(404).json({
                message:"Post not found"
            })
        }

        if(post.author.toString() !== req.user.id.toString()){
            await session.abortTransaction();
            return res.status(403).json({
                message:"You are not authorized to delete this post"
            })
        }

        await commentModel.deleteMany({post: id}, {session});
        await bookmarkModel.deleteMany({post: id}, {session});
        await post.deleteOne({session});

        const responseBody = {
            message:"Post deleted successfully"
        };

        await saveIdempotencyKey(
            req.user.id,
            req.idempotencyKey,
            requestHash,
            200,
            responseBody,
            session
        );

        await session.commitTransaction();

        return res.status(200).json(responseBody);

    } catch(error){
        await abortTransactionSafely(session);

        if (error.code === 11000) {
            if (await recoverDuplicateIdempotencyKey(res, req.user.id, req.idempotencyKey, requestHash)) {
                return;
            }
        }

        console.log(error);
        return res.status(500).json({
            message:"Internal server error",
        })
    } finally {
        if (session) await session.endSession();
    }
}



module.exports = {
    createPost,
    getAllPosts,
    getPostByID,
    updatePost,
    deletePost
}
