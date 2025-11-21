
import React from 'react';
import { Sparkles } from 'lucide-react';

const VictoryScreen = ({ startGame }) => {
  return (
    <div className="w-full h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black flex items-center justify-center p-4">
      <div className="text-center">
        <Sparkles className="text-yellow-400 mx-auto mb-4 animate-pulse" size={80} />
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
          Victoire!
        </h1>
        <p className="text-gray-400 mb-8 text-lg">Vous avez survécu au Ragnarok et êtes devenu légendaire!</p>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg shadow-purple-500/50 transition-all"
        >
          Nouvelle Ascension
        </button>
      </div>
    </div>
  );
};

export default VictoryScreen;