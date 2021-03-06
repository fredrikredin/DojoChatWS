// make websocket connection
//var socket = io.connect('http://localhost:4000');
//var socket = io.connect('https://dojochat.azurewebsites.net'); // process.env.PORT||4000
var socket = io.connect(window.location.href); 

// query dom

var username = document.getElementById('usernameInput');
var joinBtn = document.getElementById('joinBtn');

var chatFeed = document.getElementById('chatFeed');
var chatFeedback = document.getElementById('chatFeedback');

var message = document.getElementById('msgInput');
var sendBtn = document.getElementById('sendBtn');

// variables

let user = "";
sendBtn.disabled = true;

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
        sendBtn.disabled = false;
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
        sendBtn.disabled = true;
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

    if (user != "") 
    {
        if (event.keyCode === 13)
        {
            event.preventDefault();
            sendBtn.click();
            return;
        }

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

socket.on('connect', function () {
    console.log('connection made to server ' + window.location.href);
})

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
