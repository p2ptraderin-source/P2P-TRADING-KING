const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Meeru adigina login details
const USERS = {
    "P2P": "63743",  // 1st User
    "447": "447"     // 2nd User
};

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (USERS[username] && USERS[username] === password) {
        res.json({ success: true });
    } else {
        res.json({ success: false, message: "Invalid credentials!" });
    }
});

io.on('connection', (socket) => {
    socket.on('chat message', (data) => {
        io.emit('chat message', data); 
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
