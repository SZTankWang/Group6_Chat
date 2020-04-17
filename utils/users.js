const users = [];
const user_id = [];

//Join user to chat

function userJoin(id, username, room) {
    const user = {id, username, room};

    users.push(user);
    user_id.push(id);
    // var include = rooms.includes(room);
    // if(include == false){
    //     rooms.push(room);
    // }
    return user;

}



//Get current user
function getCurrentUser(id){
    return users.find(user => user.id === id);
}

//socketid valid
function Valid_id(id){
    if(user_id.includes(id)){
        return true;
    };
}


//User leaves chat
function userLeave(id){
    const index = users.findIndex(user => user.id === id);
    user_id.splice(user_id.indexOf(id),1);

    if (index != -1){
        return users.splice(index,1)[0];
    };
}

// function EmptyRoom(room){
//     const

// }


//Get room users
function getRoomUsers(room){
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
    Valid_id

};