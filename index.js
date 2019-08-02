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
})
