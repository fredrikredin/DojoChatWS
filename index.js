var express = require('express');
var socket = require('socket.io');

// app setup
var app = express();
var port = process.env.PORT || 4000;

var server = app.listen(port, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('started express server. listening on http://' + host + ':' + port);
});

// tell express to serve static files such as index.html from the 'public' folder
app.use(express.static('public'));

// socket setup
var io = socket(server);

io.on('connection', function(socket) {
    console.log('made socket connection with client:', socket.id);

    // listen for emitted events

    socket.on('join', function (data) {
        console.log('recieved join event', data);
        io.sockets.emit('join', data); // emit to all connected sockets
    });
    
    socket.on('message', function (data) {
        console.log('recieved message event', data);
        io.sockets.emit('message', data); // emit to all connected sockets
    });
    
    socket.on('typing', function (data) {
        //console.log('recieved typing event', data);
        socket.broadcast.emit('typing', data); // emit to all sockets other than 'socket' (aka broadcast)
    });
});
