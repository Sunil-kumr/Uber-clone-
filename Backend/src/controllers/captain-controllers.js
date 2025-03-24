import { blackListModel } from "../models/blacklistToken-model.js";
import { CaptainModel } from "../models/captain-model.js";
import { RideModel } from "../models/ride-schema.js";
import { asyncHandler } from "../utils/Asynchandler.js";
import { validationResult } from "express-validator";


export const registerCaptain=asyncHandler(async (req,res) => {
    const errors=validationResult(req)
    //Handling the express validator errors
    if(!errors.isEmpty()){
        return res.status(400)
        .json({
            errors:errors.array()
        })
    }

    const {
        fullname,
        email,
        password,
       vehicle
    }=req.body

    if( !fullname.firstname  || !email  ||!password || !vehicle){
        throw new Error("All fields are required")
    }
    const existedCap=await CaptainModel.findOne({email})
    if(existedCap){
        return res.status(400).json({
            message:"Captain already exists",
            existedCap
        })
    }
    const newCap=await CaptainModel.create({
        fullname:{
            firstname:fullname.firstname,
            lastname:fullname.lastname
        },
        email,
        password,
        vehicle:{
           color:vehicle.color,
            plate:vehicle.plate,
            capacity:vehicle.capacity,
            vehicleType:vehicle.vehicleType
        }
    })
    const token=newCap.generateAuthToken()
    const options={
        httpOnly:true,
        secure:true
    }

    res.cookie("token",token,options)
    return res.status(201).json({
        message:"Captain created",
        newCap,
        token:token
    })


})


export const loginCaptain =asyncHandler(async (req,res,next) => {
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            error:errors.array()
        })
    }
    const {email,password}=req.body

    if(!email ||!password){
        throw new Error("All fields are required")
    }

    const captain=await CaptainModel.findOne({email}).select('+password')
    if(!captain){
        res.status(400).json({
            message:"Captain not found"
        })
    }

    const checkPassword=await captain.checkPassword(password)

    if(!checkPassword){
        res.status(400).json({
            message:"Incorrect password"
        }) 
    }

    const token=captain.generateAuthToken()
    const options={
        httpOnly:true,
        secure:true
    }
    res.cookie("token",token,options)
    return res.status(200)
    .json({
        message:"Captain login successfull",
        token:token
    })
})


export const getCapProfile=asyncHandler(async (req,res) => {
    const cap=req.captain
    res.status(200).json({
        cap
    })
})


export const logoutCap=asyncHandler(async (req,res) => {
    const token=req.cookies.token || req.headers.authorization?.split(' ')[1]
    const options={
        httpOnly:true,
        secure:true
    }
    await blackListModel.create({token})
    res.clearCookie(token,options)
    res.status(200).json({
        message:"Logout Success"
    })
})


