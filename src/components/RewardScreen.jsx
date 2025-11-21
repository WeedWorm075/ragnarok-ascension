import React from 'react';
import { cardDatabase } from '../constants/cardDatabase';
import { getCardColor, getCardGlow } from '../utils/cardHelpers';

const RewardScreen = ({ addCardToDeck, skipCardReward }) => {
  const rewardCards = Object.keys(cardDatabase).sort(() => Math.random() - 0.5).slice(0, 3);
  
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black p-8 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        <h2 className="text-4xl font-bold text-purple-300 mb-8 text-center">Choisissez votre Récompense</h2>
        <div className="flex gap-6 justify-center mb-6">
          {rewardCards.map((cardKey) => {
            const card = cardDatabase[cardKey];
            return (
              <div
                key={cardKey}
                onClick={() => addCardToDeck(cardKey)}
                className={`bg-gradient-to-br from-gray-800 to-gray-900 border-2 ${getCardColor(card.rarity)} rounded-xl p-6 w-64 cursor-pointer hover:scale-105 transition-all shadow-lg ${getCardGlow(card.rarity)}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-white font-bold">{card.name}</h4>
                  <div className="bg-blue-600 rounded-full w-7 h-7 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{card.cost}</span>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-4">{card.desc}</p>
                <div className="text-purple-400 text-xs uppercase">{card.rarity}</div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center">
          <button
            onClick={skipCardReward}
            className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition-all"
          >
            Passer
          </button>
        </div>
      </div>
    </div>
  );
};

export default RewardScreen;