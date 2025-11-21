import React from 'react';
import { Heart, Shield, Zap, Sword, Sparkles, Flame } from 'lucide-react';
import { getCardColor, getCardGlow } from '../utils/cardHelpers';

const CombatScreen = ({ 
  playerHealth, 
  playerMaxHealth, 
  playerBlock, 
  energy, 
  maxEnergy, 
  enemy, 
  combatLog, 
  hand, 
  playCard, 
  endTurn,
  drawPile,
  discardPile,
  deck
}) => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black p-4">
      <div className="max-w-6xl mx-auto">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-black/60 px-4 py-2 rounded-lg border border-red-500/30">
              <Heart className="text-red-400" size={20} />
              <span className="text-white font-semibold">{playerHealth}/{playerMaxHealth}</span>
            </div>
            {playerBlock > 0 && (
              <div className="flex items-center gap-2 bg-black/60 px-4 py-2 rounded-lg border border-blue-500/30">
                <Shield className="text-blue-400" size={20} />
                <span className="text-white font-semibold">{playerBlock}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 bg-black/60 px-4 py-2 rounded-lg border border-yellow-500/30">
            <Zap className="text-yellow-400" size={20} />
            <span className="text-white font-semibold">{energy}/{maxEnergy}</span>
          </div>
        </div>

        {/* Enemy */}
        {enemy && (
          <div className="mb-8 flex justify-center">
            <div className="bg-gradient-to-br from-red-900/40 to-purple-900/40 border-2 border-red-500/50 rounded-xl p-6 w-80">
              <h3 className="text-2xl font-bold text-red-300 mb-4 text-center">{enemy.name}</h3>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Heart className="text-red-400" size={20} />
                  <span className="text-white font-semibold">{enemy.health}/{enemy.maxHealth}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sword className="text-orange-400" size={20} />
                  <span className="text-white font-semibold">
                    {enemy.intent === 'attack' ? `${enemy.damage} dégâts` : 'Défense'}
                  </span>
                </div>
              </div>
              <div className="w-full bg-black/40 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-red-500 to-red-700 h-2 rounded-full transition-all"
                  style={{ width: `${(enemy.health / enemy.maxHealth) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Combat Log */}
        {combatLog.length > 0 && (
          <div className="mb-4 bg-black/40 border border-purple-500/30 rounded-lg p-3 max-h-24 overflow-y-auto">
            {combatLog.slice(-3).map((log, i) => (
              <p key={i} className="text-gray-300 text-sm">{log}</p>
            ))}
          </div>
        )}

        {/* Hand */}
        <div className="mb-4">
          <div className="flex gap-3 justify-center flex-wrap">
            {hand.map((card, index) => (
              <div
                key={index}
                onClick={() => playCard(card, index)}
                className={`bg-gradient-to-br from-gray-800 to-gray-900 border-2 ${getCardColor(card.rarity)} rounded-xl p-4 w-48 cursor-pointer hover:scale-105 transition-all shadow-lg ${getCardGlow(card.rarity)} ${
                  energy < card.cost ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-white font-bold text-sm">{card.name}</h4>
                  <div className="bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{card.cost}</span>
                  </div>
                </div>
                <p className="text-gray-300 text-xs mb-3">{card.desc}</p>
                <div className="flex gap-1">
                  {card.type === 'attack' && <Sword size={16} className="text-red-400" />}
                  {card.type === 'ability' && <Sparkles size={16} className="text-blue-400" />}
                  {card.type === 'consumable' && <Flame size={16} className="text-orange-400" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* End Turn Button */}
        <div className="flex justify-center">
          <button
            onClick={endTurn}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg shadow-purple-500/50 transition-all"
          >
            Terminer le Tour
          </button>
        </div>

        {/* Deck Info */}
        <div className="flex justify-center gap-6 mt-4 text-gray-400 text-sm">
          <div>Pioche: {drawPile.length}</div>
          <div>Défausse: {discardPile.length}</div>
          <div>Deck: {deck.length}</div>
        </div>
      </div>
    </div>
  );
};

export default CombatScreen;