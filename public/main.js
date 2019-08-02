// make websocket connection

var socket = io.connect('http://localhost:4000');

// query dom

var username = document.getElementById('usernameInput');
var joinBtn = document.getElementById('joinBtn');

var chatFeed = document.getElementById('chatFeed');

var message = document.getElementById('msgInput');
var sendBtn = document.getElementById('sendBtn');

// emit events

sendBtn.addEventListener('click', function () {
    socket.emit('chatMessage', 
    {
        message: message.value,
        username: username.value
    });
});

// listen for events

socket.on('chatMessage', function (data) {
    chatFeed.innerHTML += '<p><strong>' + data.username + ': </strong>' + data.message + '</p>'; 
});