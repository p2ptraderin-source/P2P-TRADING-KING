const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3000;

const DB_FILE = path.join(__dirname, 'messages.json');

// File load logic - logic better cheshanu
let chatHistory = [];
function loadHistory() {
    try {
        if (fs.existsSync(DB_FILE)) {
            const data = fs.readFileSync(DB_FILE, 'utf8');
            chatHistory = data ? JSON.parse(data) : [];
        }
    } catch (err) {
        console.log("History load error:", err);
        chatHistory = [];
    }
}
loadHistory();

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    // Mobile lo reconnect ayina history vasthundi
    socket.emit('load history', chatHistory);

    socket.on('chat message', (data) => {
        io.emit('chat message', data);
        
        chatHistory.push(data);
        if(chatHistory.length > 200) chatHistory.shift(); 
        
        // Sync write vadithe fast ga save avthundi
        try {
            fs.writeFileSync(DB_FILE, JSON.stringify(chatHistory));
        } catch (err) {
            console.log("Save error:", err);
        }

        // Auto-reply logic
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
                fs.writeFileSync(DB_FILE, JSON.stringify(chatHistory));
            }, 2000);
        }
    });
});

http.listen(PORT, () => { console.log('Server running...'); });
