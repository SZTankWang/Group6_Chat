const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers,Valid_id } = require('./utils/users')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'AnyChat Bot';
room_track = {};
roomlist = [];
online_users = [];
//Run when a client connects
io.on('connection', socket => {
    
    socket.on('joinRoom', ({username, room}) => {
        const user = userJoin(socket.id,username, room);
        //console.log(user.username);

        socket.join(user.room);

        //determine the num of users in a room so that we could delete it when empty
        if(!(room in room_track)){
            // room_num.room ++;
            //roomlist.push(room);
            room_track[room] = 1;
            io.emit('RoomChange',room_track);
        // } else{
        //     room_num.room = 1; //a new room was created

            // var msg_array = [];
            // for(let i in room_num){
            //     var obj = {
            //         roomname: i,
            //         user: room_num[i]
            //     }
            //     msg_array.push(obj);
            // }
            // console.log('available room:'+ msg_array);

            // if(socket.emit('RoomChange')){
            //     console.log('room change informed');
            //}; //Emit change in rooms when a new user has joined
        }else{
            room_track[room] ++;
            io.emit('RoomChange',room_track);
        };

        // if(roomlist.includes(room)==false){
        //     roomlist.push(room);
        // };
        
        //Welcome current user
        socket.emit('message', formatMessage(botName,'Welcome! Chat around! '));

        //Broadcast when a user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(botName,`${user.username} has joined the chat`));
        // Send user and room info
        io.to(user.room).emit('roomUsers', {
            room:user.room,
            users: getRoomUsers(user.room)
        });

    });

    // formal get room method, replace with Event RoomChange
    socket.on('GetRooms',() =>{
        io.emit('OpenRooms',room_track);
    });



    //Listen for chatmessage
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username,msg));
    });
    // Runs when client disconnects
    socket.on('disconnect', () => {
        if(Valid_id(socket.id)){
            const user = userLeave(socket.id);

            if(user) {
                io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`));
    
            };
            // Send user and room info
            io.to(user.room).emit('roomUsers', {
                room:user.room,
                users: getRoomUsers(user.room)
            });

            var room = user.room;
            room_track[room] = room_track[room]-1;
            if(room_track[room]==0){
                delete room_track[room];
            };
            
            io.emit('RoomChange',room_track);


            // room_num.room = room_num.room - 1;
            // if(room_num.room == 0){
            //     roomlist.splice(roomlist.indexOf(room),1);
            //     socket.emit('RoomChange',roomlist);
            //     console.log('available room decreased');
            // };
        };
    });
    
});
const PORT = process.env.PORT || 3000 ;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

