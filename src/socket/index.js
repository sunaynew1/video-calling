import {Server} from "socket.io"
import express from "express"
import dotenv from "dotenv"

dotenv.config({
    path:"./.env"
})

const app = express()

const server = https.createServer(app);

server.listen(process.env.PORT)

//initialising socket (settign cors to all for now going to update in the future for specific frontend url )

const socket =new Server(server,{
    cors :{
        origin : "*"
    },
    methods : ["GET","POST"]
})

const offers = [
    // offererUserName
    // offer
    // offerIceCandidates
    // answererUserName
    // answer
    // answererIceCandidates
];
const allSockets =[]


const userSocket = [
    //SocketId
    //username
    //roomId
]

const room = {
    //userSocket
    //Room ID
    //Current users connected 
}

const allRooms = [ 
    //all rooms
]

socket.on("connection", (s) => {

 userSocket.push({
    socketID : s.id,
    userName : s.userName
 })
 allSockets.push(userSocket)

 

 s.on("createRoom",()=>{

    if(!s.roomId){
    room = {
    roomId : crypto.randomUUID(),
    users : [],
    connectedUser : 0

 } 
 room.users.push(userSocket.id)
 room.connectedUser +=1;

 allRooms.push(room);
 console.log(`room created with id:- ${room.roomId}`)
    }else{
        const roomCheck = allRooms.find(r => r.roomId == s.roomId)
        
        if(roomCheck){
            console.log("room already exists!!!")
        }
    }
 })

s.on("joinRoom",(roomDetails)=>{
 const roomCheck = allRooms.find(r => r.roomId == s.roomId)

 if(roomCheck){
    console.log("room exists!!!!")
    
    if(roomCheck.connectedUser<=2){
          roomCheck.users.push(s.id)
          roomCheck.connectedUser+=1;
    }else{
        console.log("room is full!!!")
    }

 }
})

socket.on('newOffer',(offer)=>{
    if(offer){
        offers.push({
            roomId :s.roomId ,
            offererUserName: s.userName,
            offer : offer,
            offerICECandidate : [],
            answererUserName : null,
            answer : null,
            answererICECandidates : []
        })
        console.log("offer Recieved")
    }
})

socket.on('newAnswer',(offerObj,ackFunction) => {

    const roomCheck = allRooms.find(r => r.roomId == s.roomId)

    if(roomCheck){
        const otherUser = roomCheck.users.find(u => u.id != s.id)
        console.log("other User found")

        ackFunction(offerObj,offerICECandidate)
         const offerToUpdate = offers.find(o=>o.offererUserName === offerObj.offererUserName)
         
         if(offerToUpdate){
            offerToUpdate.answer = offerObj.answer
            offerToUpdate.answererUserName = offerObj.answererUserName
            socket.to(otherUser).emit('answerResponse',offerToUpdate)
         }
    } 

})

socket.on('sendIceCandidateToSignalingServer',iceCandidateObj => {
    const {didIOffer,iceUserName,iceCandidate,roomId}=iceCandidateObj;
    const roomCheck = allRooms.find(r => r.roomId == roomId)
    if(didIOffer){
       const offerInOffers = offers.find(o=>o.offererUserName === iceUserName);
       if(offerInOffers){
        offerInOffers.offerICECandidate.push(iceCandidate);
        console.log("recieved ice candidate from offerer side!")

        if(offerInOffers.answererUserName){
            const socketToSendTo = roomCheck.users.find(s=>s.userName === offerInOffers.answererUserName);
               
        
        }
       }
    }
})

})
