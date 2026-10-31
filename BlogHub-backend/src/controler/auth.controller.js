const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const MAX_PASSWORD_BYTES = 72;

async function registerUser(req, res) {
    try{
        
        const {username, email, password} = req.body;
        if(typeof username !== "string"
            || typeof email !== "string"
            || typeof password !== "string"
            || !username.trim() || !email.trim() || !password.trim())
            {
                return res.status(400).json({
                    message:"Invalid input"

                });
            }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({
                message:"Invalid email format"
            });
        }

        if (password.trim().length < 8) {
            return res.status(400).json({
                message:"Password must be at least 8 characters"
            });
        }

        if (Buffer.byteLength(password, "utf8") > MAX_PASSWORD_BYTES) {
            return res.status(400).json({
                message:"Password must not exceed 72 UTF-8 bytes"
            });
        }
    
        const isUserAlreadyRegistered = await userModel.findOne({
            $or: [
                {username},
                {email}
            ]
        });
    
        if(isUserAlreadyRegistered) {
            return res.status(409).json({
                message:"User already registered"
            });
        }
    
        const hash = await bcrypt.hash(password, 10);
    
        const user = await userModel.create({
            username,
            email,
            password: hash
        });
    
        res.status(201).json({
            message:"User registered successfully",
            user:{
                username,
                email
            }
        });

    } catch(err){
        console.log(err)
        if (err.code === 11000) {
        return res.status(409).json({
            message: "User already registered"
        });
    }
        return res.status(500).json({
            message:"Internal server error",
        });
    }
}

async function loginUser(req, res) {
    try{
        const {username , password, email} = req.body;
    
        const identify = username || email;
    
        if(typeof identify !== "string" || typeof password !== "string"
        || !identify.trim() || !password.trim()
        ) {
            return res.status(400).json({
                message:"Invalid input"
            });
        }

        if (Buffer.byteLength(password, "utf8") > MAX_PASSWORD_BYTES) {
            return res.status(400).json({
                message:"Password must not exceed 72 UTF-8 bytes"
            });
        }
    
        const user = await userModel.findOne({
            $or: [
                {username: identify},
                {email: identify}
            ]
        })
    
        if(!user) {
            return res.status(404).json({
                message:"User not found"
            });
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password);
    
        if(!isPasswordValid) {
            return res.status(401).json({
                message:"Invalid password"
            });
        }
    
        const token = jwt.sign({
            id: user.id
        } , process.env.JWT_SECRET, { expiresIn: '1h' })
    
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        })
    
        res.status(200).json({
            message:"User logged in successfully",
            user:{
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    } catch (err){
        console.log(err)
        return res.status(500).json({
            message:"Internal server error",
        });
    }

}

async function getMe(req, res) {
    try {
        const user = await userModel
        .findById(req.user.id)
        .select("-password")

        if(!user) {
            return res.status(404).json({
                message:"User not found"
            });
        }

        res.status(200).json({
            message:"User found",
            user:{
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

   } catch (error) {
       console.log(error)
    return res.status(500).json({
        message:"Internal server error",
    });
   }

}

module.exports = { registerUser, loginUser, getMe };
