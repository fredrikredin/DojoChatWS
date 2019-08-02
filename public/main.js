// make websocket connection

var socket = io.connect('http://localhost:4000');

// query dom

var username = document.getElementById('usernameInput');
//var joinBtn = document.getElementById('joinBtn');

var chatFeed = document.getElementById('chatFeed');
var chatFeedback = document.getElementById('chatFeedback');

var message = document.getElementById('msgInput');
var sendBtn = document.getElementById('sendBtn');

// emit events

sendBtn.addEventListener('click', function () {
    socket.emit('message', 
    {
        message: message.value,
        username: username.value
    });

    message.value = "";
});

message.addEventListener('keypress', function () {
    socket.emit('typing', username.value);
})

message.addEventListener('focusout', function () {
    socket.emit('typing', '');
})

// listen for events

socket.on('message', function (data) {
    chatFeed.innerHTML += '<p><strong>' + data.username + ': </strong>' + data.message + '</p>'; 
});

socket.on('typing', function (data) {

    if (data === '') {
        chatFeedback.innerHTML = "";
    }
    else {
        chatFeedback.innerHTML = '<p class="teal-text"><i>' + data + ' is typing a message...</i></p>';
    }
});