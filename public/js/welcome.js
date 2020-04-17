// const {getRoom} = require('./utils/users');
// const loginForm = document.getElementById('login-form');
const roomlist = document.getElementById('rooms');
const socket = io();

socket.emit('GetRooms');

socket.on('OpenRooms', function(msg){
    console.log(msg);

    var rooms = [];
    for(var room in msg){
        var output = room + ':'+ ' '+ msg[room] + ' '+ 'users';
        rooms.push(output);
    };
    roomlist.innerHTML = `${rooms.map(roominfo => `<li>${roominfo}</li>`).join('')}`;
    // roomlist.innerHTML = `${msg.map(room => `<li>${room}</li>`).join('')}`;

})

socket.on('RoomChange',function(msg){
    console.log(msg);
    var rooms = [];
    for(var room in msg){
        var output = room + ':'+' '+ msg[room] + ' '+ 'users';
        rooms.push(output);
    };
    roomlist.innerHTML = `${rooms.map(roominfo => `<li>${roominfo}</li>`).join('')}`;
    
    //roomlist.innerHTML = `${msg.map(room => `<li>${room}</li>`).join('')}`;
})
//     // roomlist.innerHTML =  
//     // `${roomnum.map(room => `<li>${room}`+`: `+`${roomnum[room]}</li>`).join('')}`
//     // ;

// });

// function inform(){
//     socket.emit('LoginEnd');
// }

