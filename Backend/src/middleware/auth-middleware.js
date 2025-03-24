import { blackListModel } from "../models/blacklistToken-model.js";
import { CaptainModel } from "../models/captain-model.js";
import { userModel } from "../models/user-model.js";
import { asyncHandler } from "../utils/Asynchandler.js";
import jwt from "jsonwebtoken";

export const authmiddlewareUser=async (req,res,next) => {
    try {
        const token=req.cookies.token || req.headers.authorization?.split(' ')[1]
        if(!token){
            return res.status(400).json({
                message:"Token not found Unauthorized"
            })
        }
        const isTokenBlacklisted=await blackListModel.findOne({token})

        if(isTokenBlacklisted){
            res.status(404).
            json({
                message:"Token not valid"
            })
        }
        const verifyToken=jwt.verify(token,process.env.TOKEN_SECRET)
        const user=await userModel.findById(verifyToken._id).select('-__v')
        if(!user){
            return res.status(400).json({
                message:"User not found"
            })
        }
        req.user=user
        next()
    } catch (error) {
        console.log(error);
        return res.status(400).
        json({
            message:"Unauthorized"
        })
    }
}


export const authmiddlewareCap=async (req,res,next) => {
    try {
        const token=req.cookies.token || req.headers.authorization.split(' ')[1]
    
        if(!token){
            return res.status(400)
            .json({
                message:"Token not found"
            })
        }
    
        const isTokenBlacklisted=await blackListModel.findOne({token})
    
      
        if(isTokenBlacklisted){
            res.status(404).
            json({
                message:"Token not invalid"
            })
        }
    
        const verifyToken=jwt.verify(token,process.env.TOKEN_SECRET)
        if(!verifyToken){
            res.status(404).
            json({
                message:"Unauthorized user"
            })
        }
    
        const captain=await CaptainModel.findById(verifyToken._id).select('-__v')
        req.captain=captain
        next()
    } catch (error) {
        res.status(400)
        .json({
            message:"Unauthorized user"
        })
    }
}