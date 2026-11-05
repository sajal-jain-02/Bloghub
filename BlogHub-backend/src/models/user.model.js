const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique:true,
        trim:true
    },
    email:{
        type: String,
        required: true,
        unique:true,
        trim:true
    },
    password:{
        type: String,
        required: true
    },
    profilePhoto:{
        type: String,
        default: null
    },
    coverPhoto:{
        type: String,
        default: null
    },
    bio:{
        type: String,
        default: "",
        maxLength: 500
    },
    profilePhotoFileId: {
        type: String,
        default: null
    },

    coverPhotoFileId: {
        type: String,
        default: null
    }
    })

const userModel = mongoose.model("user", userSchema)
module.exports = userModel