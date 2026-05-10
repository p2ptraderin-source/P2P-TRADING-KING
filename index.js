const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3000;

const DB_FILE = './messages.json';

// Load History
let chatHistory = [];
try {
    if (fs.existsSync(DB_FILE)) {
        chatHistory = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    }
} catch (err) { chatHistory = []; }

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    // Send history to new user
    socket.emit('load history', chatHistory);

    socket.on('chat message', (data) => {
        io.emit('chat message', data);
        
        chatHistory.push(data);
        if(chatHistory.length > 100) chatHistory.shift(); 
        fs.writeFileSync(DB_FILE, JSON.stringify(chatHistory, null, 2));

        // Auto-Reply for Customer 447
        if (data.user === "CUSTOMER NO 447" && !data.isAutoReply) {
            setTimeout(() => {
                const reply = {
                    user: "P2P TRADER KING👑",
                    type: 'text',
                    content: "Please wait for a moment, I will try to reply you fast.",
                    isAutoReply: true
                };
                io.emit('chat message', reply);
                chatHistory.push(reply);
                fs.writeFileSync(DB_FILE, JSON.stringify(chatHistory, null, 2));
            }, 2000);
        }
    });
});

http.listen(PORT, () => { console.log('Server is live!'); });
