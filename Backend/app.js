import express from 'express'
import dotenv from 'dotenv'
dotenv.config({
    path:'./.env'
})
import cors from 'cors'
import cookieparser from 'cookie-parser'
import { routes } from './src/routes/user-routes.js'
import Captainroute from './src/routes/captain-routes.js'
import maproutes from './src/routes/maps-routes.js'
import rideRoute from './src/routes/ride-routes.js' 




const userRoutes=routes
const app=express()
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from this URL
  }));
app.use(express.json())
app.use(cookieparser())
app.use('/user',userRoutes)
app.use('/captain',Captainroute)
app.use('/maps',maproutes)
app.use('/ride',rideRoute)

export {app} 
