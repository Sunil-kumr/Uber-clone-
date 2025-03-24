import { asyncHandler } from "../utils/Asynchandler.js";
import axios from 'axios'
import { validationResult } from "express-validator";
// import { getRoute } from "../utils/getDistance.js";
import { getDistanceandTime,getLatLng,getSuggestion } from "../utils/MapServices.js";

export const getCoordinates=asyncHandler(async (req,res) => {
    const validationErr=validationResult(req)
    if(!validationErr.isEmpty()){
        return res.status(200)
        .json({
            error:validationErr.array()
        })
    }
    

    const {address}=req.body
    if(!address){
        throw new Error("Provide address")
    }
    const response=await getLatLng(address)
    if(response===null){
        return res.status(400)
        .json({
            message:"Address not found"
        })
    }
    const{latitude,longitude}=response
    
    
    return res.status(200)
    .json({
        longitude,
        latitude
    })


})


export const getDistance=async (req,res) => {
   try {
     const {origin,destination}=req.body
//  console.log(origin);
     if(!origin || !destination){
         throw new Error('Please provide both location')
     }
     const response=await getDistanceandTime(origin,destination)
     return res.status(200)
     .json({
      Distance:response
     })
 
   } catch (error) {
    console.log(error);
   }

}
export const  getSuggestions=asyncHandler(async (req,res) => {
  const {input}=req.query
  const validationErr=validationResult(req)
  if(!validationErr.isEmpty()){
    return res.status(400).
    json({
        error:validationErr.array()
    })
  }
  if(!input){
    throw new Error('Provide address to get Suggestions')
  }

  const suggestions=await getSuggestion(input)
  return res.status(200)
  .json({
    suggestions
  })

})