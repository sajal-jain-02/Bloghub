const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    
    text :{
        type:String,
        required:true,
        trim:true
    },

    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },

    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"post",
        required:true
    }
})

const commentModel = new mongoose.model("comments", commentSchema)
module.exports = commentModel