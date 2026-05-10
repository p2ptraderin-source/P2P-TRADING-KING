const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    socket.on('chat message', (data) => {
        io.emit('chat message', data);
        if (data.user === "CUSTOMER NO 447" && data.type === 'text' && !data.isAutoReply) {
            setTimeout(() => {
                io.emit('chat message', {
                    user: "P2P TRADER KING👑",
                    type: 'text',
                    content: "Please wait for a moment, I will try to reply you fast.",
                    isAutoReply: true
                });
            }, 2000);
        }
    });
});

http.listen(PORT, () => {
    console.log('Server is running...');
});
