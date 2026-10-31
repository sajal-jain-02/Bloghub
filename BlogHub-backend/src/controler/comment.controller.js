const commentModel = require("../models/comment.model");
const postModel = require("../models/post.model");

async function createComment(req,res) {

    try{
        const{ postId }= req.params;
        const {text} = req.body;
    
        if(typeof text !== 'string' || !text.trim()) {
            return res.status(400).json(
                { message: 'Comment text is required' }
            );
        }
    
        const post = await postModel.findById(postId);


        if(!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
    
        const comment = await commentModel.create({
            text: text.trim(),
            post: postId,
            author: req.user.id
        })
        
        return res.status(201).json({
            "message": "Comment created successfully",
            comment: comment
        });
        
    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }

}

async function getComments(req, res) {
    try {
        const { postId } = req.params;

        const post = await postModel.findById(postId);
        if(!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comments = await commentModel.find({ post: postId });
        return res.status(200).json({
            "message": "Comments fetched successfully",
            comments: comments
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }

}

async function deleteComments(req,res) {
    try {
        const { commentId } = req.params;
    
        const comment = await commentModel.findById(commentId);
        if(!comment) {
            return res.status(404).json({ message: 'Comments not found' });
        }

        if(comment.author.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'forbidden' });
        }

        await commentModel.findByIdAndDelete(commentId);
        return res.status(200).json({ message: 'Comment deleted successfully' });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
    
}

async function updateComment(req,res) {

    try{
        const {commentId} = req.params;
        
        const comment = await commentModel.findById(commentId);
        if(!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
    
        if(comment.author.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'forbidden' });
        }
    
        const { text } = req.body;
        if(typeof text !== 'string' || !text.trim()) {
            return res.status(400).json({ message: 'Comment text is required' });
        }
    
        comment.text = text.trim();
        await comment.save();
    
        return res.status(200).json({
            "message": "Comment updated successfully",
            comment: comment
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    createComment,
    getComments,
    deleteComments,
    updateComment
}