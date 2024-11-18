import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const players = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('player:join', ({ name }) => {
    const player = {
      id: socket.id,
      name,
      isOnline: true
    };
    
    players.set(socket.id, player);
    
    // Send current player info back to the client
    socket.emit('player:self', player);
    
    // Broadcast to all clients
    io.emit('players:update', Array.from(players.values()));
    io.emit('player:joined', player);
  });

  socket.on('chat:message', (message) => {
    io.emit('chat:message', {
      ...message,
      timestamp: Date.now()
    });
  });

  socket.on('disconnect', () => {
    const player = players.get(socket.id);
    if (player) {
      players.delete(socket.id);
      io.emit('player:left', socket.id);
      io.emit('players:update', Array.from(players.values()));
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});