import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { Users } from 'lucide-react';

export default function PlayersList() {
  const players = useGameStore((state) => state.players);
  const currentPlayer = useGameStore((state) => state.currentPlayer);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-blue-500" />
        <h2 className="text-lg font-semibold">Players Online</h2>
      </div>
      
      <div className="space-y-2">
        {players.map((player) => (
          <div
            key={player.id}
            className={`p-2 rounded-lg ${
              player.id === currentPlayer?.id
                ? 'bg-blue-50 border border-blue-200'
                : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="font-medium">
                {player.name}
                {player.id === currentPlayer?.id && ' (You)'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}