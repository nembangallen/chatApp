const app = require('./app/app');
const socket = require('socket.io');
//const redis = require('redis');

//const redisPort = process.env.PORT || 6379;
const port = process.env.PORT || 4040;
var clients = [];

//const redisClient = redis.createClient(redisPort);

const server = app.listen(port,()=>{
    console.log(`Listening to :${port}`);
});

var io = socket(server);


io.on('connection',(socket)=>{
    //Saving Active Clients
   // clients.push(socket.id);

    console.log('Someone Connected: ',socket.id)
    // returing client's Id And 
    // io.sockets.emit('connected',{
    //     socket_id:socket.id,
    //     clients:clients
    // });

    socket.on('disconnect',()=>{
        for(var i=0;i<clients.length;i++){
            if(clients[i].socket_id == socket.id){
                socket.broadcast.emit('offline',clients[i].username);
                clients.splice(i,1);
                socket.broadcast.emit('logged',clients);
                
                console.log('Someone Disconnectd',socket.id);
                break;
            }
        }
    })

    socket.on('logged',(data)=>{
       // socket.join(socket.id);
        var info = {
            username:data.username,
            socket_id:socket.id
        }
        clients.push(info);
        console.log(clients);
        socket.emit('logged',clients);
        socket.broadcast.emit('logged',clients);
    })

    //Handle chat event
    socket.on('chat',(data)=>{

        io.sockets.emit('chat',data);
    })

    //Handle private message
    socket.on('pchat',(data)=>{
        // var to = data.to;
        // var from = socket.id;
        // var room1 = to.concat(from);
        // var room2 = from.concat(to);

        // if(io.sockets.adapter.rooms(room1)){
        //     io.sockets.in(room1).emit('pchat',data);
        // }
        // else if(io.sockets.adapter.rooms(room2)){
        //     io.sockets.in(room2).emit('pchat',data);
        // }
        // else{
        //     socket.join(room1);
        //     io.sockets.in(room1).emit('pchat',data);

        // }
        // if(io.sockets.adapter.rooms[data.to]){
            
        // }
        //socket.join(data.to);
        
        io.to(data.to).in(socket.id).emit('pchat',data);
    })

    // //Handle chat event 
    // socket.on('chat',(data)=>{
    //     console.log('Somebody sent message')
    //     io.sockets.emit('chat',data);
    // })

    // //Handle keypress event 
    // socket.on('typing',(data)=>{
    //     socket.broadcast.emit('typing',data);
    // });
    // socket.on('focusout',(data)=>{
    //     socket.broadcast.emit('focusout',data);
    // });

})