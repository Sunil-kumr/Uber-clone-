import express from 'express'
import {body} from 'express-validator'
import { getProfile, loginUser, logoutUser, registerUser } from '../controllers/user-controllers.js'
import {  authmiddlewareUser } from '../middleware/auth-middleware.js'
// import { getNearbyCaptains } from '../controllers/captain-controllers.js'
const routes=express.Router()

routes.post('/register',[
    body('email').isEmail().withMessage("Invalid email"),
    body('fullname.firstname').isLength({min:3}).withMessage('Fullname should have more than 3 characters'),
    body('password').isLength({min:6}).withMessage("Password should contain 3 or more characters")
    //Checking the errors
],     registerUser  )
routes.post('/login',[
    body('email').isEmail().withMessage("Invalid email"),
    body('password').isLength({min:6}).withMessage('Password should contain 3 or more characters')
],
loginUser
)

routes.get('/profile',authmiddlewareUser,getProfile)
routes.get('/logout',authmiddlewareUser,logoutUser)


export {routes}