var express = require('express');
var socket = require('socket.io');

// app setup
var app = express();

var server = app.listen(4000, function() {
    console.log("started server. listening for requests on port 4000...");
});

// tell express to serve static files such as index.html from the 'public' folder
app.use(express.static('public'));

// socket setup
var io = socket(server);

io.on('connection', function(socket) {
    console.log('made socket connection with client:', socket.id);

    // listen for emitted events

    socket.on('join', function (data) {
        io.sockets.emit('join', data); // emit to all connected sockets
    });

    socket.on('message', function (data) {
        io.sockets.emit('message', data); // emit to all connected sockets
    });
    
    socket.on('typing', function (data) {
        socket.broadcast.emit('typing', data); // emit to all sockets other than 'socket' (aka broadcast)
    });
});
