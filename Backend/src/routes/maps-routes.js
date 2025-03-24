import { getCoordinates, getDistance, getSuggestions } from "../controllers/maps-controller.js";
import express from 'express'
import { authmiddlewareUser } from "../middleware/auth-middleware.js";
import { body } from "express-validator";
const maproutes=express.Router()
import { query } from "express-validator";
maproutes.get('/getCo-ordinates',[
body('address').isString().isLength({min:3})
],getCoordinates)

maproutes.get('/getDistance',getDistance)
maproutes.post('/getSuggestion',[
    // body('input').isString().isLength({min:3}),
    query('input').isString().isLength({min:3}),
    
],authmiddlewareUser,getSuggestions)


export default maproutes