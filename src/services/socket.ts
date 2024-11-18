import { io } from 'socket.io-client';
import { useGameStore } from '../store/useGameStore';

const SOCKET_URL = 'http://localhost:3000';

class SocketService {
  private socket;
  
  constructor() {
    this.socket = io(SOCKET_URL);
    this.setupListeners();
  }

  private setupListeners() {
    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('player:self', (player) => {
      useGameStore.getState().setCurrentPlayer(player);
    });

    this.socket.on('players:update', (players) => {
      useGameStore.getState().setPlayers(players);
    });

    this.socket.on('player:joined', (player) => {
      useGameStore.getState().addPlayer(player);
    });

    this.socket.on('player:left', (playerId) => {
      useGameStore.getState().removePlayer(playerId);
    });

    this.socket.on('chat:message', (message) => {
      useGameStore.getState().addMessage(message);
    });
  }

  public joinGame(playerName: string) {
    this.socket.emit('player:join', { name: playerName });
  }

  public sendMessage(content: string) {
    const currentPlayer = useGameStore.getState().currentPlayer;
    if (!currentPlayer) return;

    const message = {
      id: crypto.randomUUID(),
      playerId: currentPlayer.id,
      playerName: currentPlayer.name,
      content,
      timestamp: Date.now(),
    };

    this.socket.emit('chat:message', message);
  }

  public disconnect() {
    this.socket.disconnect();
  }
}

export const socketService = new SocketService();