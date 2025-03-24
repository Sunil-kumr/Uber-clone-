import React, { useContext, useState,useEffect } from 'react';
import { Search, Car, Bike, Truck, Clock, Gift, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { VehicleDetails, LocationInput, RecentTrips, LookingForDriver,OffersSection } from '../Components';
import { SocketContext } from '../Context/SocketContext';
import { use } from 'react';
import { UserContext, UserDataContext } from '../Context/UserContext';
const RideTypeButton = ({ icon: Icon, label, onClick }) => (
  <button
    className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
    onClick={onClick}
  >
    <Icon className="w-6 h-6 mb-2" />
    <span className="text-sm font-medium">{label}</span>
  </button>
);



export default function UserHomePage() {
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [showDriverSearch, setShowDriverSearch] = useState(false);
  const {socket}=useContext(SocketContext)
  const {user}=useContext(UserDataContext)


  useEffect(()=>{
    // console.log("in home page"+user);
    socket.emit('join',{userId:user._id,role:'user'})
  },[user])
  const handleBack = () => {
    if (showDriverSearch) {
      setShowDriverSearch(false);
    }
  };

  const handlePickupChange = (value) => {
    setPickup(value);
  };

  const handleDropChange = (value) => {
    setDrop(value);
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-black text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Welcome, John</h1>
      </header>

      <main className="p-4 max-w-3xl mx-auto">
        {showDriverSearch ? (
          <motion.div key="driver-search">
            <LookingForDriver pickup={pickup} drop={drop} onBack={handleBack} />
          </motion.div>
        ) : (
          <motion.div key="main-view">
            <div className="mb-6">
              <LocationInput
                placeholder="Enter pickup location"
                icon={MapPin}
                value={pickup}
                onChange={handlePickupChange}
              />
              <LocationInput
                placeholder="Enter drop location"
                icon={MapPin}
                value={drop}
                onChange={handleDropChange}
              />
              <button
                className="w-full bg-black text-white p-3 rounded-lg mt-2 flex items-center justify-center"
                onClick={() => setShowDriverSearch(true)}
              >
                <Search className="w-5 h-5 mr-2" />
                Find a Ride
              </button>
            </div>

            <RecentTrips />
           
            <OffersSection />
          </motion.div>
        )}
      </main>
    </div>
  );
}

