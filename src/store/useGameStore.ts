import { create } from 'zustand';

interface GameState {
  players: Player[];
  messages: Message[];
  currentPlayer: Player | null;
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  setPlayers: (players: Player[]) => void;
  addMessage: (message: Message) => void;
  setCurrentPlayer: (player: Player) => void;
}

interface Player {
  id: string;
  name: string;
  isOnline: boolean;
}

interface Message {
  id: string;
  playerId: string;
  playerName: string;
  content: string;
  timestamp: number;
}

export const useGameStore = create<GameState>((set) => ({
  players: [],
  messages: [],
  currentPlayer: null,

  addPlayer: (player) =>
    set((state) => ({
      players: [...state.players, player],
    })),

  removePlayer: (playerId) =>
    set((state) => ({
      players: state.players.filter((p) => p.id !== playerId),
    })),

  setPlayers: (players) =>
    set(() => ({
      players,
    })),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  setCurrentPlayer: (player) =>
    set(() => ({
      currentPlayer: player,
    })),
}));