import { CaptainModel } from "../models/captain-model.js";
import { RideModel } from "../models/ride-schema.js";
import { getDistanceandTime} from "./MapServices.js";
import crypto from 'crypto'



export async function calcFare(origin,destination) {

    
    if(!origin  || !destination){
        throw new Error('Origin or destination missing')
    }
    const fareDetails = {
        car: { baseFare: 50, ratePerKm: 15 },
        auto: { baseFare: 30, ratePerKm: 10 },
        motorcycle: { baseFare: 20, ratePerKm: 8 }
    };

    const distanceTime=await getDistanceandTime(origin,destination)
    
    if (!distanceTime || !distanceTime.rows || !distanceTime.rows[0].elements[0].distance) {
        throw new Error('Failed to retrieve distance and time');
    }

    // Extract distance and duration
    const distanceInKm = distanceTime.rows[0].elements[0].distance.value / 1000; // Convert meters to kilometers
    const durationInMins = Math.round(distanceTime.rows[0].elements[0].duration.value / 60);; // Convert seconds to minutes
        
    const fares={}

   for (const vehicleDetails in fareDetails) {
   const {baseFare,ratePerKm}=fareDetails[vehicleDetails]
   fares[vehicleDetails]=Math.round(baseFare+(ratePerKm*distanceInKm))
   }

   return { fares, distanceInKm, durationInMins };
}

export function generateOtp(num){
    //The num is the length of otp
    const otp = crypto.randomInt(0, Math.pow(10, num)).toString().padStart(num, '0');
    return otp;
}


export const getNearbyCaptains=async function(lat,lng,radius){
    if(!lat || !lng || !radius){
        throw new Error('Parameters missing')
    }
    //Radius is in km
    const nearbyCaptain=await CaptainModel.find({
        location:{
            $geoWithin:{
                $centerSphere:[[lat,lng],radius /6371]
            }
        }
     })

     if(!nearbyCaptain){
        return null
     }

     return nearbyCaptain
}


export const calcFine=(fare)=>{
    const fine = Math.round(fare * 0.1); // 10% of the fare
    return fine;
}

