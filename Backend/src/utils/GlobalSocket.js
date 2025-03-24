import {userModel} from '../models/user-model.js'
import { CaptainModel } from '../models/captain-model.js'
import { RideModel } from '../models/ride-schema.js'    
import {Server} from 'socket.io'    
let io //global variable for circulating the socket accross the backend server
const initializeSocket=(server)=>{
     io=new Server(server,{
        cors:{
            origin:'*',
            methods:['GET',"POST"]
        }
    })


    io.on('connection',(socket)=>{
        // console.log(`Client connected: ${socket.id}`);
        
        //creating a specific event in which inserting of socket id is done
        socket.on('join',async(data)=>{
            const{userId,role}=data

            if(role==='user'){
                await userModel.findByIdAndUpdate(userId,{
                    socketId:socket.id
                })
            }
            else if(role==='captain'){
                // console.log(`Captain is connected ${userId}`);
                await CaptainModel.findByIdAndUpdate(userId,{
                    socketId:socket.id
                })
            }
        })
 

        socket.on('update-location',async(data)=>{
            const {location,id}=data
                
            if(!location || !location.lat || !location.lng ){
                socket.emit('error',{message:"Missing location field"})
            }
            // console.log(`Captian location ${location.lat} ${location.lng}`);
            await CaptainModel.findByIdAndUpdate(id,{
                location:{
                lat:location.lat,
                lng:location.lng
                }
            })


        })
        socket.on('disconnect',()=>{
            // console.log(`Client disconnected: ${socket.id}`);
        })
    })
    return io
}

const sendMessage=function(socketId,messageObj){
    if(io){
        io.to(socketId).emit(messageObj.event,messageObj.data)
    }
    else{
        throw new Error('Socket not Initialized')
    }
}
export{
    initializeSocket,
   sendMessage
}