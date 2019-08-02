// make websocket connection

// process.env.PORT||4000

// var socket = io.connect('http://localhost:4000');
var socket = io.connect('http://localhost:' + process.env.PORT||4000);

// query dom

var username = document.getElementById('usernameInput');
var joinBtn = document.getElementById('joinBtn');

var chatFeed = document.getElementById('chatFeed');
var chatFeedback = document.getElementById('chatFeedback');

var message = document.getElementById('msgInput');
var sendBtn = document.getElementById('sendBtn');

// variables

let user = "";

// emit events to server

joinBtn.addEventListener('click', function () {

    if (user === "" && username.value.trim()) {
        user = username.value.trim();

        socket.emit('join',
            {
                user: user,
                hasJoined: true
            });

        username.value = user;
        username.disabled = true;
        joinBtn.innerText = 'Leave chat';
        return;
    }

    if (user != "") {
        socket.emit('join',
            {
                user: user,
                hasJoined: false
            });

        user = "";
        username.value = "";
        username.disabled = false;
        joinBtn.innerText = 'Join chat';
    }
});

sendBtn.addEventListener('click', function () {

    if (user != "" && message.value.trim() != "") {
        socket.emit('message',
            {
                message: message.value.trim(),
                user: user
            });

        message.value = "";
    }
});

message.addEventListener('keyup', function (event) {

    if (user != "") {
        socket.emit('typing',
            {
                user: user,
                isTyping: message.value != ""
            });
    }
})

window.addEventListener("beforeunload", function (e) {
    if (user != "") {
        socket.emit('join',
            {
                user: user,
                hasJoined: false
            });
    }
}, false);

// listen for emitted events from server

socket.on('join', function (data) {
    if (data.hasJoined) {
        chatFeedback.innerHTML = '<p class="teal-text"><i>' + data.user + ' joined the chat</i></p>';
    }
    else {
        chatFeedback.innerHTML = '<p class="teal-text"><i>' + data.user + ' left the chat =(.</i></p>';
    }
});

socket.on('message', function (data) {
    chatFeed.innerHTML += '<p><strong>' + data.user + ': </strong>' + data.message + '</p>';
    chatFeedback.innerHTML = "";
});

socket.on('typing', function (data) {
    if (data.isTyping) {
        chatFeedback.innerHTML = '<p class="teal-text"><i>' + data.user + ' is typing a message...</i></p>';
    }
    else {
        chatFeedback.innerHTML = "";
    }
});
