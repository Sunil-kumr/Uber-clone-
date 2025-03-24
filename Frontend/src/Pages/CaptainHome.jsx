import React,{useEffect, useState} from 'react'
import { motion } from 'framer-motion';
import { MapPin, Clock, DollarSign, User, CheckCircle } from 'lucide-react';
import { DriverAcceptRide, Header } from '../Components';
import { useContext } from 'react';
import { CaptainContext, CaptainDataContext } from '../Context/CaptainContext';
import { SocketContext } from '../Context/SocketContext';
function CaptainHome() {
    const mockRideRequests = [
        { id: 1, pickup: "Central Park", dropoff: "Times Square", estimatedTime: 15, fare: 25, passengerName: "John Doe" },
        { id: 2, pickup: "Brooklyn Bridge", dropoff: "Statue of Liberty", estimatedTime: 30, fare: 40, passengerName: "Jane Smith" },
        { id: 3, pickup: "Empire State Building", dropoff: "Metropolitan Museum", estimatedTime: 20, fare: 30, passengerName: "Bob Johnson" },
      ];
    const [rideRequests, setRideRequests] = useState(mockRideRequests);
    const [rides, setRides] = useState({});
      const [acceptedRides,setAcceptedRides]=useState([])
    const handleAcceptRide = (rideId) => {
      const acceptedRide = rideRequests.find(ride => ride.id === rideId);
      setAcceptedRides([...acceptedRides, acceptedRide]);
      setRideRequests(rideRequests.filter(ride => ride.id !== rideId));
    };
const [location,setLocation]=useState()
const {captain}=useContext(CaptainDataContext)
const {socket}=useContext(SocketContext)

useEffect(()=>{
  // console.log('sending captian',`${captain}`)
socket.emit('join',{userId:captain._id,role:"captain"})

const sendLocation=function()
{
  // console.log('location gets called');
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(location=>
     {
      socket.emit('update-location',{
        id:captain._id,
        location:{
          lat:location.coords.latitude,
          lng:location.coords.longitude
        }
      })
     }
    )
  }
}



const locationDelay=setInterval(sendLocation,2000)//storing the delay in an variable so that unmounting can be easy
return()=>clearInterval(locationDelay)

},[captain])


socket.on('new-ride',(data)=>{
  console.log(data);
  setRides(data)
})


    return (
        <>
       <Header />
      {rides && <DriverAcceptRide rideData={rides} />}
      <div className="p-4 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Available Ride Requests</h1>
      </div>
      </>
    )
}

export default CaptainHome
