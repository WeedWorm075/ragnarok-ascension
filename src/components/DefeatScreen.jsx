
import React from 'react';
import { Skull } from 'lucide-react';

const DefeatScreen = ({ floor, act, startGame }) => {
  return (
    <div className="w-full h-screen bg-gradient-to-b from-gray-900 via-red-900 to-black flex items-center justify-center p-4">
      <div className="text-center">
        <Skull className="text-red-400 mx-auto mb-4" size={80} />
        <h1 className="text-5xl font-bold text-red-400 mb-4">Défaite</h1>
        <p className="text-gray-400 mb-8 text-lg">Vous avez succombé aux forces du Ragnarok...</p>
        <p className="text-gray-300 mb-8">Étage atteint: {floor} | Acte: {act}</p>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg shadow-purple-500/50 transition-all"
        >
          Recommencer
        </button>
      </div>
    </div>
  );
};

export default DefeatScreen;