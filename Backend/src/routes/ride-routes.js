import e from "express";
import { body,query } from "express-validator";
import { cancelRide, confirmRide, createRide, endRide, getFare, makePayment, seeRides, startRide } from "../controllers/ride-controller.js";
import { authmiddlewareCap, authmiddlewareUser } from "../middleware/auth-middleware.js";

const rideRoute=e.Router()

rideRoute.post('/create',
    authmiddlewareUser,
    [
        body('pickUp').isString().isLength({min:3}),
        body('drop').isString().isLength({min:3}),
        body('vehicleType').isIn(['car','motorcycle','auto'])
    ],
   
    createRide
)

rideRoute.post('/getFares',authmiddlewareUser,
    [
        body('pickup').isString().isLength({min:3}),
        body('drop').isString().isLength({min:3}),
    ],
    getFare
)
rideRoute.post('/accept',
    authmiddlewareCap,
    [
        body("rideId").isMongoId().withMessage('Invalid Ride id')
    ],
    confirmRide
)


rideRoute.post('/start',
    authmiddlewareCap,
    [
        body('rideId').isMongoId().withMessage('Invalid Ride ID'),
        body('otp').isLength({min:6}).withMessage('Otp length should be 6')
    ],
    startRide
)


rideRoute.post('/ended',
    authmiddlewareCap,
    [        body('rideId').isMongoId().withMessage('Invalid Ride ID'),
    ],
    endRide
)


rideRoute.put('/payment',
    authmiddlewareUser,
    [
        body('paymentType').isIn(['cash','online']).withMessage('Payment should be online or cash'),
        body('rideId').isMongoId().withMessage('Invalid Ride ID')
    ],
    makePayment
)


rideRoute.get('/seeRides',
    authmiddlewareUser,
    [
        query('requirement').isLength({min:3}).withMessage('Provide proper requirement in the query')
    ],
    seeRides
)

rideRoute.put('/cancelRide',
    [
        body('rideId').isMongoId().withMessage('Invalid Ride ID')
    ],
    cancelRide
)

export default rideRoute