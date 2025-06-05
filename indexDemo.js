const express=require('express');
const app=express();
const mongoose=require('mongoose')
const http=require('http')
const {Server} =require('socket.io')
const server=http.createServer(app);
const io=new Server(server);
const userSocketMap={};
// Aisa kuch hogga ye  userSocketMap  {"mnj_socket_id":"Nizam"}

const getAllConnectedClient=(roomId)=>{
return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId)=>{ // agar roomId exist krta h toh iss new user ko uss room list member me add krdo
  return {
    socketId,
    username:userSocketMap[socketId]
  }
})  // yaha new user ko add krke saare connected user return kr rhe h 

}




// app.use(express.json())

io.on("connection",(socket)=>{
  console.log(`Use connected :${socket.id}`);
  socket.on("join",({roomId,username})=>{
    userSocketMap[socket.id]=username; //{"mnj_socket_id":"Nizam"} // isliye krte h taaki offline / online me kisne join kiya aur kisne leave kiya ye ptachal sakke 
    socket.join(roomId)//Agar room pehle se exist karta hai to join kar lega. Agar nahi hai, to auto create ho jaata hai (Socket.IO me by default).


    /*
Jab tu ye likhta hai:
socket.join("room1");

Behind the scenes:
Socket.IO check karta hai:

io.sockets.adapter.rooms.has("room1")
Agar room1 nahi hai → create karta hai

Agar hai → usme socket.id add karta hai

*/



//     Agar roomId nayi hai (jo pehle nahi thi), toh socket.join(roomId) call karte hi Socket.IO wo room create kar deta hai.

// Isliye jab tum turant baad me getAllConnectedClient(roomId) call karte ho, toh woh room already exist karta hai aur usme tumhara socket bhi hota hai.






// ab agar roomId exist krta h toh user ko  add krenge 
    const clients=getAllConnectedClient(roomId);
    console.log(clients);

  });
})


mongoose
  .connect("mongodb://127.0.0.1/CodeComplierLive")
  .then(() => {
    console.log("Database Connected Successfully");
    const port = 8000;
    server.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch(() => {
    console.log("Database Connection Failed");
  });



