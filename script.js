let username = "";
let socket;

// Show the modal to ask for username
$(document).ready(function() {
    $('#usernameModal').modal({ backdrop: 'static', keyboard: false });
    $('#usernameModal').modal('show');
});

// Connect to WebSocket after entering username
$('#join-btn').click(function() {
    username = $('#username').val().trim();
    if (username === "") {
        alert("Please enter a valid name!");
        return;
    }
    $('#usernameModal').modal('hide');

    // Connect to WebSocket
    socket = new WebSocket("ws://127.0.0.1:8000/message");

    socket.onopen = function(event) {
        console.log("WebSocket connected!");
        appendMessage("🔗 Connected to chat as <b>" + username + "</b>", true); // Indicate it's a system message
    };

    // Receive messages
    socket.onmessage = function(event) {
        console.log("Received data:", event.data);
        const data = JSON.parse(event.data);
        if (data && data.message !== undefined && data.username !== undefined) {
            appendMessage(`<b>${data.username}:</b> ${data.message}`, data.username === username); // Pass isCurrentUser info
        } else {
            console.error("Invalid message format:", data);
            if (data.message === undefined){
              console.error("data.message is undefined")
            }
            if (data.username === undefined){
              console.error("data.username is undefined")
            }
        }
    };

    socket.onclose = function(event) {
        appendMessage("❗ Connection closed.", true); // Indicate it's a system message
    };
});

// Send message to WebSocket
$('#send-btn').click(function() {
    const message = $('#message').val().trim();
    if (message !== "" && socket.readyState === WebSocket.OPEN) {
        const data = { username: username, message: message };
        socket.send(JSON.stringify(data));
        $('#message').val('');
    }
});

// Append message to chat
function appendMessage(message, isCurrentUser) {
    const sender = isCurrentUser ? "You" : message.split('<b>')[1].split('</b>')[0];
    const actualMessage = isCurrentUser ? message : message.split('</b>')[1];
    const displayMessage = isCurrentUser ? message : `<b>${sender}:</b> ${actualMessage}`;
    $('#chat-box').append(`<div>${displayMessage}</div>`);
    $('#chat-box').scrollTop($('#chat-box')[0].scrollHeight);
}