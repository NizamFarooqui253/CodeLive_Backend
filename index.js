const express=require('express');
const app=express();
const mongoose=require('mongoose')
const http=require('http')
const {Server} =require('socket.io')
const server=http.createServer(app);
const io=new Server(server);
const userSocketMap={};
require('dotenv').config(); // load variables from .env

const getAllConnectedClient=(roomId)=>{
  // ***always return socketId of that room
  //io.sockets.adapter.rooms.get('room1') => Set { 'abc123', 'xyz456'} set milega isko array me convert krenge 

return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId)=>{  //Yeh line check karti room h ya nhi agar room hogga toh sirf uss room me jitni bhi socket id hongi unko de dega 




  return {
    socketId,
    username:userSocketMap[socketId] // ab jo socket id mili hai upar wale steps se  unko userSocketMap me socket id k basis pr search krke username le lega qki userSocketMap me hazaro user data hogga par hume sirf jo isss room me bande h unka hi data chahiye
  }
}) 

}




// app.use(express.json())


// jab user connect ho
io.on("connection",(socket)=>{
  // console.log(`Use connected :${socket.id}`);




  socket.on("join",({roomId,username})=>{
    



    userSocketMap[socket.id]=username; 
    socket.join(roomId);

   

 
    const clients=getAllConnectedClient(roomId);
    //jitne bhi users room me unka data frontend pr bhejenge taaki pta chal sakke kitne connect hue users room me

//  clients= [
//   { socketId: 'mDuyhDGrlsn6WyDVAAAC', username: 'nizam' },
//   { socketId: 'w0kBbONXqxCMx8wpAAAD', username: 'Mkiii' }
// ]

    

    clients.forEach(({socketId})=>{
      io.to(socketId).emit("joined",{ // yaha se ek ek user jayega frontend pr  **important on the basis of socketid 
        clients, // Sabhi users ka list (new + old)
        username,// ye new user clients me bhi hogga phir q bhej rhe h qki isko identify kr paaye toast wagera me used krenge 
        socketId:socket.id, // ye id bhi new user ki h ye sab kuch clients me h par toast k liye krte h aisa 
        
      })
    })
    
    

  });


  socket.on("code_change",({code,roomId})=>{
  socket.in(roomId).emit("code_change",{code});
  })


socket.on("sync-code",({socketId,code})=>{
io.to(socketId).emit("code_change",{code})
})

 




socket.on("disconnecting", () => {
  // Room manually create nhi karna padta → jab tu socket.join("roomId") likhta hai, room ban jaata hai. 

  const rooms = [...socket.rooms];  // iss socket/user k room dedo 
 //Roooooom [ 'Pu5sChDe3I-DVhksAAAF', 'c048e2fd-c538-403f-b0e0-9fab3ab03b00' ]
  // roomId ,socket.id

  rooms.forEach((roomId) => { // iss room se current user ko disconnect krdo ur usko front pr bhi bhj do
    socket.in(roomId).emit("disconnected", {
      socketId: socket.id, // ye aur neeche wala toast me user remove ho gya usko dekhne k liye 
      username: userSocketMap[socket.id], // aur uska name
    });
  });

  delete userSocketMap[socket.id]; // uski entry bhi hta di
});



// console.log("rooooooom",socket.rooms);





})




// io.to(...) → sabko (khud ko bhi)

// socket.in(...) → sabko except khud 💥







  console.log("Database Connected Successfully");
    const port = process.env.PORT || 5000;
    server.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });


