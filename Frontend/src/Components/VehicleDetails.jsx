import React, { useCallback, useContext, useEffect,useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Star, Users, Clock,MapPin } from 'lucide-react';
import axios from 'axios';
import { SocketContext, SocketProvider } from '../Context/SocketContext';

import { useNavigate } from 'react-router-dom';


function VehicleDetails({ vehicle, onBack, onConfirm }) {
  const token = localStorage.getItem('usertoken');
  const [isCancelling, setIsCancelling] = useState(false)
  const nav=useNavigate()
  const {socket}=useContext(SocketContext)
  const createRide = useCallback(async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/maps/getSuggestion`,
        null,
        {
          params: { input: vehicle.name },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response.data); // Handle the response as needed
    } catch (error) {
      console.error(error);
    }
  }, [token, vehicle.name]);
// console.log(vehicle);
  //Cancel ride with fine
  const cancelRide = useCallback(async () => {
    if (!vehicle._id) {
      console.error("No ride ID available")
      return
    }

    setIsCancelling(true)
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/ride/cancelRide`,
        { rideId: vehicle._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      console.log("Ride cancelled:", response.data)
       // Go back to the previous screen after cancelling
      nav('/home')
      } catch (error) {
      console.error("Error cancelling ride:", error)
    } finally {
      setIsCancelling(false)
    }
  }, [token, vehicle._id, onBack])

  const handleConfirm = () => {
    createRide(); // Call the API when confirm is clicked
    onConfirm(vehicle); // Call the onConfirm function passed as prop
  };
  const captain=vehicle.Captain
  

  useEffect(()=>{
    socket.on('start-ride',()=>{
      nav('/rideStarted',{state :{
        vehicle,
        captain
      }})
    })

    return ()=>{
      socket.off('start-ride')
    }
  },[socket,nav,vehicle,captain])
  return (
<motion.div
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: 50 }}
  transition={{ duration: 0.3 }}
  className="bg-white min-h-screen flex flex-col"
>
  <div className="p-4 border-b">
    <button onClick={onBack} className="flex items-center text-gray-600" aria-label="Go back">
      <ChevronLeft className="w-6 h-6 mr-2" />
      <span className="text-lg font-semibold">Trip details</span>
    </button>
  </div>

  <div className="flex-1 overflow-y-auto">
    <div className="p-4 space-y-6">

      {/* Captain Details */}
      <div className="px-6 bg-gray-50 p-4 rounded-lg">
        <h3 className=" font-semibold mb-1">Your captain</h3>
        <div className="flex items-center space-x-3">
          <div>
            <p className="font-medium mt-1">{`${captain?.fullname?.firstname || 'N/A'} ${captain?.fullname?.lastname || ''}`}</p>
            <p className="mt-2 text-sm">
          <span className="font-semibold">PLATE:</span> {captain.vehicle?.plate || 'N/A'}
        </p>
          </div>
        </div>
        <p className="mt-2 text-sm">
          <span className="font-semibold">OTP:</span> {vehicle?.otp || 'N/A'}
        </p>
      </div>

      {/* Pickup and Drop */}
      <div className="space-y-4">
        <div className="flex items-start">
          <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-1" />
          <div>
            <p className="text-sm text-gray-500">Pickup</p>
            <p className="font-medium">{vehicle.pickup || 'Loading pickup location...'}</p>
          </div>
        </div>
        <div className="flex items-start">
          <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-1" />
          <div>
            <p className="text-sm text-gray-500">Drop-off</p>
            <p className="font-medium">{vehicle.destination || 'Loading drop-off location...'}</p>
          </div>
        </div>
      </div>

      {/* Trip Info */}
      <div className="flex justify-between text-sm">
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-2 text-gray-400" />
          <span>{vehicle.duration || 'N/A'} min</span>
        </div>
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-2 text-gray-400" />
          <span>Up to 4 seats</span>
        </div>
      </div>

      {/* Fare Details */}
      <div>
        <h3 className="font-semibold mb-2">Fare breakdown</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Base fare</span>
            <span>₹{vehicle.fare || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Distance ({vehicle.distance || 'N/A'} km)</span>
            <span>₹50</span>
          </div>
          <div className="flex justify-between text-base font-semibold mt-2 pt-2 border-t">
            <span>Total</span>
            <span>₹{(vehicle.fare || 0) + 50}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Confirm Button */}
  {/* Confirm and Cancel Buttons */}
  <div className="p-4 border-t bg-white">
        <div className="flex space-x-4">
          <button
            className="flex-1 bg-red-500 text-white p-4 rounded-lg text-lg font-semibold disabled:opacity-50"
            onClick={cancelRide}
            disabled={isCancelling}
            aria-label="Cancel Ride"
          >
            {isCancelling ? "Cancelling..." : "Cancel Ride"}
          </button>
          <button
            className="flex-1 bg-black text-white p-4 rounded-lg text-lg font-semibold"
            onClick={handleConfirm}
            aria-label={`Confirm ${vehicle.name || "Ride"}`}
          >
            Confirm {vehicle.name || "Ride"}
          </button>
        </div>
      </div>
</motion.div>

  )}  
export default VehicleDetails;
