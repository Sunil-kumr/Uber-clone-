import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Car, Bike, ChevronLeft } from 'lucide-react';
import WaitingScreen from './WaitingScreen.jsx';
import axios from 'axios';

function LookingForDriver({ onBack, pickup, drop }) {
  const [selectedVehicleDetails, setSelectedVehicleDetails] = useState(null);
  const [bookingStage, setBookingStage] = useState('selection');
  const [fare, setFare] = useState({});
  const [distance, setDistance] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');

  useEffect(() => {
    const getFares = async () => {
      const token = localStorage.getItem('usertoken');
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/ride/getFares`,
          { pickup, drop },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          setFare(response.data.fares);
          setEstimatedTime(response.data.estimatedTime);
          setDistance(response.data.distance);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getFares();
  }, [pickup, drop]);

  const handleConfirmVehicle = (vehicleType, icon) => {
    const vehicleFare = fare[vehicleType.toLowerCase()];
    setSelectedVehicleDetails({
      name: vehicleType,
      fare: vehicleFare,
      distance,
      estimatedTime,
      icon,
      pickup,
      drop
    });
    setBookingStage('waiting');
  };

  const handleBackToSelection = () => {
    setBookingStage('selection');
    setSelectedVehicleDetails(null);
  };

  if (bookingStage === 'waiting') {
    return (
      <WaitingScreen
        vehicle={selectedVehicleDetails}
        onBack={handleBackToSelection}
      />
    );
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <button className="mb-4 flex items-center text-gray-600" onClick={onBack}>
        <ChevronLeft className="w-5 h-5 mr-1" />
        Back
      </button>

      <h1 className="text-xl font-bold mb-4">Select Vehicle Type</h1>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 gap-4 mb-8"
      >
        <motion.button
          className="w-full flex items-center justify-between p-4 bg-gray-100 rounded-lg hover:bg-gray-200"
          onClick={() => handleConfirmVehicle('Car', Car)}
        >
          <div className="flex flex-col items-start mb-2">
            <Car className="w-8 h-8 mb-2" />
            <span>Car</span>
            <span className="text-sm text-gray-500">Distance: {distance} Km</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold">Fare: ₹{fare?.car}</span>
          </div>
        </motion.button>

        <motion.button
          className="w-full flex items-center justify-between p-4 bg-gray-100 rounded-lg hover:bg-gray-200"
          onClick={() => handleConfirmVehicle('Motorcycle', Bike)}
        >
          <div className="flex flex-col items-start mb-2">
            <Bike className="w-8 h-8 mb-2" />
            <span>Motorcycle</span>
            <span className="text-sm text-gray-500">Distance: {distance} Km</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold">Fare: ₹{fare?.motorcycle}</span>
          </div>
        </motion.button>

        <motion.button
          className="w-full flex items-center justify-between p-4 bg-gray-100 rounded-lg hover:bg-gray-200"
          onClick={() => handleConfirmVehicle('Auto', 'auto-icon')}
        >
          <div className="flex flex-col items-start mb-2">
            <img
              src="https://cdn-icons-png.flaticon.com/128/4682/4682997.png"
              className="w-8 h-8 mb-2"
              alt="Auto"
            />
            <span>Auto</span>
            <span className="text-sm text-gray-500">Distance: {distance} Km</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold">Fare: ₹{fare?.auto}</span>
          </div>
        </motion.button>
      </motion.div>
    </div>
  );
}

export default LookingForDriver;
