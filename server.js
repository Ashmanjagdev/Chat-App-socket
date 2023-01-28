const express= require("express");
const app = express();
const http=require("http");
const socketIO = require("socket.io");
const server=http.createServer(app);

const io=socketIO(server);

io.on("connection",(socket)=>{
    socket.on('joined',({values})=>{
        if(values!="")
        {
users[socket.id]=values;
          console.log(`${values} has joined `);
          socket.join(221);
          socket.to(221).emit('userJoined',{user:"Global",message:` ${users[socket.id]} has joined`});
          socket.emit('welcome',{user:"Global",message:`Welcome to the chat, ${users[socket.id]} `})
        }
    });
var room1=221;
	socket.on("message",({message,id,room}) => {
        if(room === ""){
            socket.join(221);
            io.to(221).emit('sendMessage',{user:users[id],message,id});
        }
        else{
            room1=room;
            io.to(room).emit('sendMessage',{user:users[id],message,id});
        }
	});
    var prevroom=221;

    socket.on("room-joined",({room,id}) => {
        if(room === ""){
            socket.join(221);
            prevroom=221;
        }
        else{
            socket.leave(prevroom);
            io.to(prevroom).emit('leave',{user:"Global",message:`${users[socket.id]}  has left`});
            socket.join(room);
            socket.to(room).emit('entered-room',{user:"Global",message:` ${users[socket.id]} has joined the ${room}`});
            socket.emit('room-filled',{user:"Global",message:`you joined room ${room} `})
            prevroom=room;
        }
    });

	socket.on("disconnect",() => {
        if(users[socket.id]){
        io.to(room1).emit('leave',{user:"Global",message:`${users[socket.id]}  has left`});
        console.log(`user left`);
        }
	});


});



server.listen(5000,()=>{
    console.log(`Working`);
});
