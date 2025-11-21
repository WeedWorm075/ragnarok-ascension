import React from 'react';
import { Heart, Coins, Sparkles } from 'lucide-react';

const MapScreen = ({ act, floor, playerHealth, playerMaxHealth, gold, mapNodes, selectNode }) => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-purple-300">Acte {act} - Étage {floor}/15</h2>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-lg border border-red-500/30">
              <Heart className="text-red-400" size={20} />
              <span className="text-white font-semibold">{playerHealth}/{playerMaxHealth}</span>
            </div>
            <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-lg border border-yellow-500/30">
              <Coins className="text-yellow-400" size={20} />
              <span className="text-white font-semibold">{gold}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          {mapNodes.map((node) => (
            <div
              key={node.floor}
              className={`p-6 rounded-lg border-2 transition-all ${
                node.floor === floor
                  ? 'bg-purple-900/40 border-purple-400 cursor-pointer hover:bg-purple-800/60'
                  : node.floor < floor
                  ? 'bg-gray-800/40 border-gray-600 opacity-50'
                  : 'bg-black/40 border-gray-700 opacity-30'
              }`}
              onClick={() => selectNode(node)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">
                    {node.type === 'combat' && '⚔️'}
                    {node.type === 'elite' && '👹'}
                    {node.type === 'merchant' && '🪙'}
                    {node.type === 'event' && '🎲'}
                    {node.type === 'boss' && '💀'}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-300">
                      Étage {node.floor}
                    </h3>
                    <p className="text-gray-400">
                      {node.type === 'combat' && 'Combat'}
                      {node.type === 'elite' && 'Élite'}
                      {node.type === 'merchant' && 'Marchand'}
                      {node.type === 'event' && 'Événement'}
                      {node.type === 'boss' && 'Boss'}
                    </p>
                  </div>
                </div>
                {node.floor === floor && (
                  <Sparkles className="text-purple-400 animate-pulse" size={24} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapScreen;