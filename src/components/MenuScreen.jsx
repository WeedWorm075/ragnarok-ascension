import React from 'react';

const MenuScreen = ({ startGame }) => {
  return (
    <div className="w-full h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
          Ragnarok Ascension
        </h1>
        <p className="text-gray-400 mb-8 text-lg">Le crépuscule des dieux approche...</p>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 rounded-lg text-xl font-semibold shadow-lg shadow-purple-500/50 transition-all"
        >
          Commencer l'Ascension
        </button>
      </div>
    </div>
  );
};

export default MenuScreen;