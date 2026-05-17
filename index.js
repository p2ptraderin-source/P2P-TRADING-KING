<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Private Chat</title>
    <style>
        body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background: #f0f2f5; margin: 0; }
        #login-box, #chat-box { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); width: 300px; }
        .hidden { display: none; }
        input { width: 93%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 5px; }
        button { width: 100%; padding: 10px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; }
        #messages { height: 200px; overflow-y: auto; border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; border-radius: 5px; }
    </style>
</head>
<body>

    <!-- LOGIN SCREEN -->
    <div id="login-box">
        <h3>Private Login</h3>
        <input type="text" id="username" placeholder="Username">
        <input type="password" id="password" placeholder="Password">
        <button onclick="login()">Login</button>
    </div>

    <!-- CHAT SCREEN -->
    <div id="chat-box" class="hidden">
        <h3>Our Chat</h3>
        <div id="messages"></div>
        <input type="text" id="msg-input" placeholder="Type a message...">
        <button onclick="sendMessage()">Send</button>
    </div>

    <script src="/socket.io/socket.io.js"></script>
    <script>
        const socket = io();
        let myName = "";

        async function login() {
            const user = document.getElementById('username').value;
            const pass = document.getElementById('password').value;

            const res = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: user, password: pass })
            });
            const data = await res.json();

            if(data.success) {
                myName = user;
                document.getElementById('login-box').classList.add('hidden');
                document.getElementById('chat-box').classList.remove('hidden');
            } else {
                alert(data.message);
            }
        }

        function sendMessage() {
            const input = document.getElementById('msg-input');
            if(input.value.trim() !== "") {
                socket.emit('chat message', { user: myName, msg: input.value });
                input.value = "";
            }
        }

        socket.on('chat message', (data) => {
            const msgDiv = document.getElementById('messages');
            msgDiv.innerHTML += `<p><strong>${data.user}:</strong> ${data.msg}</p>`;
            msgDiv.scrollTop = msgDiv.scrollHeight;
        });
    </script>
</body>
</html>
               
