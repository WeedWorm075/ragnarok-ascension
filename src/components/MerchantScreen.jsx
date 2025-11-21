import React from 'react';
import { Coins } from 'lucide-react';
import { cardDatabase } from '../constants/cardDatabase';
import { getCardColor, getCardGlow, getCardPrice } from '../utils/cardHelpers';

const MerchantScreen = ({ gold, merchantCards, buyCard, deck, removeCard, continueToNextFloor }) => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-purple-300">Marchand Mystique</h2>
          <div className="flex items-center gap-2 bg-black/60 px-4 py-2 rounded-lg border border-yellow-500/30">
            <Coins className="text-yellow-400" size={20} />
            <span className="text-white font-semibold">{gold}</span>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-purple-300 mb-4">Cartes à Vendre</h3>
        <div className="grid grid-cols-3 gap-4 mb-8">
          {merchantCards.map((cardKey) => {
            const card = cardDatabase[cardKey];
            const price = getCardPrice(card.rarity);
            return (
              <div
                key={cardKey}
                onClick={() => buyCard(cardKey)}
                className={`bg-gradient-to-br from-gray-800 to-gray-900 border-2 ${getCardColor(card.rarity)} rounded-xl p-4 cursor-pointer hover:scale-105 transition-all shadow-lg ${getCardGlow(card.rarity)} ${gold < price ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-white font-bold text-sm">{card.name}</h4>
                  <div className="bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{card.cost}</span>
                  </div>
                </div>
                <p className="text-gray-300 text-xs mb-3">{card.desc}</p>
                <div className="flex justify-between items-center">
                  <div className="text-purple-400 text-xs uppercase">{card.rarity}</div>
                  <div className="flex items-center gap-1">
                    <Coins className="text-yellow-400" size={14} />
                    <span className="text-yellow-300 font-semibold text-sm">{price}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <h3 className="text-2xl font-semibold text-purple-300 mb-4">Retirer des Cartes (75 pièces)</h3>
        <div className="grid grid-cols-4 gap-3 mb-8">
          {deck.slice(0, 8).map((card) => (
            <div
              key={card.id}
              onClick={() => removeCard(card.id)}
              className={`bg-gradient-to-br from-gray-800 to-gray-900 border-2 ${getCardColor(card.rarity)} rounded-lg p-3 cursor-pointer hover:scale-105 transition-all ${gold < 75 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              <h4 className="text-white font-bold text-xs mb-1">{card.name}</h4>
              <p className="text-gray-400 text-xs">{card.cost} énergie</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={continueToNextFloor}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg shadow-purple-500/50 transition-all"
          >
            Continuer
          </button>
        </div>
      </div>
    </div>
  );
};
export default MerchantScreen;