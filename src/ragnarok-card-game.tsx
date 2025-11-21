import React, { useState, useEffect } from 'react';
import { Skull, Heart, Zap, Shield, Coins, Sword, Flame, Wind, Droplet, Sparkles } from 'lucide-react';

const RagnarokAscension = () => {
  const [gameState, setGameState] = useState('menu');
  const [playerHealth, setPlayerHealth] = useState(80);
  const [playerMaxHealth, setPlayerMaxHealth] = useState(80);
  const [playerBlock, setPlayerBlock] = useState(0);
  const [gold, setGold] = useState(100);
  const [energy, setEnergy] = useState(3);
  const [maxEnergy] = useState(3);
  const [deck, setDeck] = useState([]);
  const [hand, setHand] = useState([]);
  const [discardPile, setDiscardPile] = useState([]);
  const [drawPile, setDrawPile] = useState([]);
  const [enemy, setEnemy] = useState(null);
  const [floor, setFloor] = useState(1);
  const [act, setAct] = useState(1);
  const [mapNodes, setMapNodes] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [merchantCards, setMerchantCards] = useState([]);
  const [eventChoice, setEventChoice] = useState(null);
  const [combatLog, setCombatLog] = useState([]);

  const cardDatabase = {
    // Attack Cards
    strike: { name: 'Frappe', type: 'attack', cost: 1, damage: 6, desc: 'Inflige 6 dégâts', rarity: 'common' },
    heavyBlow: { name: 'Coup Lourd', type: 'attack', cost: 2, damage: 12, desc: 'Inflige 12 dégâts', rarity: 'common' },
    thunderStrike: { name: 'Foudre de Thor', type: 'attack', cost: 2, damage: 10, desc: 'Inflige 10 dégâts. Pioche 1 carte.', rarity: 'uncommon', draw: 1 },
    dragonBreath: { name: 'Souffle du Dragon', type: 'attack', cost: 3, damage: 18, desc: 'Inflige 18 dégâts', rarity: 'rare' },
    
    // Ability Cards
    defend: { name: 'Défense', type: 'ability', cost: 1, block: 5, desc: 'Gagne 5 de Bouclier', rarity: 'common' },
    ironWall: { name: 'Mur de Fer', type: 'ability', cost: 2, block: 11, desc: 'Gagne 11 de Bouclier', rarity: 'common' },
    odinsBlessing: { name: 'Bénédiction d\'Odin', type: 'ability', cost: 1, block: 8, desc: 'Gagne 8 de Bouclier. Gagne 1 énergie.', rarity: 'uncommon', energy: 1 },
    meditation: { name: 'Méditation', type: 'ability', cost: 0, desc: 'Gagne 2 énergie', rarity: 'uncommon', energy: 2 },
    
    // Consumable Cards
    healthPotion: { name: 'Potion de Vie', type: 'consumable', cost: 0, heal: 15, desc: 'Restaure 15 PV. Disparaît après usage.', rarity: 'common' },
    elixirOfPower: { name: 'Élixir de Puissance', type: 'consumable', cost: 0, desc: 'Tous vos dégâts sont doublés ce tour. Disparaît après usage.', rarity: 'rare', powerBoost: true },
    ancientScroll: { name: 'Parchemin Ancien', type: 'consumable', cost: 0, desc: 'Pioche 3 cartes. Disparaît après usage.', rarity: 'uncommon', draw: 3 },
  };

  const enemyDatabase = {
    // Common Enemies
    draugr: { name: 'Draugr', health: 30, maxHealth: 30, damage: 6, block: 0, intent: 'attack', gold: 15 },
    fenrisWolf: { name: 'Loup de Fenrir', health: 25, maxHealth: 25, damage: 8, block: 0, intent: 'attack', gold: 18 },
    yokai: { name: 'Yokai Errant', health: 28, maxHealth: 28, damage: 7, block: 0, intent: 'attack', gold: 16 },
    
    // Elite Enemies
    valkyrie: { name: 'Valkyrie Déchue', health: 50, maxHealth: 50, damage: 12, block: 5, intent: 'attack', gold: 35 },
    jiangshi: { name: 'Jiangshi', health: 55, maxHealth: 55, damage: 10, block: 8, intent: 'defend', gold: 40 },
    
    // Boss
    jormungandr: { name: 'Jörmungandr', health: 120, maxHealth: 120, damage: 15, block: 0, intent: 'attack', gold: 100 },
    susanoo: { name: 'Susanoo', health: 110, maxHealth: 110, damage: 18, block: 5, intent: 'attack', gold: 100 },
  };

  const startGame = () => {
    const starterDeck = [
      { ...cardDatabase.strike, id: 1 },
      { ...cardDatabase.strike, id: 2 },
      { ...cardDatabase.strike, id: 3 },
      { ...cardDatabase.strike, id: 4 },
      { ...cardDatabase.defend, id: 5 },
      { ...cardDatabase.defend, id: 6 },
      { ...cardDatabase.defend, id: 7 },
      { ...cardDatabase.heavyBlow, id: 8 },
    ];
    
    setDeck(starterDeck);
    setPlayerHealth(80);
    setPlayerMaxHealth(80);
    setGold(100);
    setFloor(1);
    setAct(1);
    generateMap();
    setGameState('map');
  };

  const generateMap = () => {
    const nodes = [];
    const floors = 15;
    
    for (let i = 0; i < floors; i++) {
      let nodeType;
      if (i === 0) nodeType = 'combat';
      else if (i === floors - 1) nodeType = 'boss';
      else if (i % 5 === 4) nodeType = 'merchant';
      else if (i % 4 === 0) nodeType = 'event';
      else nodeType = Math.random() > 0.3 ? 'combat' : 'elite';
      
      nodes.push({ floor: i + 1, type: nodeType, completed: false });
    }
    
    setMapNodes(nodes);
    setCurrentPath([]);
  };

  const selectNode = (node) => {
    if (node.floor !== floor) return;
    
    setCurrentPath([...currentPath, node]);
    
    if (node.type === 'combat' || node.type === 'elite') {
      startCombat(node.type);
    } else if (node.type === 'merchant') {
      openMerchant();
    } else if (node.type === 'event') {
      triggerEvent();
    } else if (node.type === 'boss') {
      startCombat('boss');
    }
  };

  const startCombat = (type) => {
    let enemyData;
    
    if (type === 'combat') {
      const commonEnemies = ['draugr', 'fenrisWolf', 'yokai'];
      const randomEnemy = commonEnemies[Math.floor(Math.random() * commonEnemies.length)];
      enemyData = { ...enemyDatabase[randomEnemy] };
    } else if (type === 'elite') {
      const eliteEnemies = ['valkyrie', 'jiangshi'];
      const randomEnemy = eliteEnemies[Math.floor(Math.random() * eliteEnemies.length)];
      enemyData = { ...enemyDatabase[randomEnemy] };
    } else if (type === 'boss') {
      const bosses = ['jormungandr', 'susanoo'];
      const randomBoss = bosses[Math.floor(Math.random() * bosses.length)];
      enemyData = { ...enemyDatabase[randomBoss] };
    }
    
    setEnemy(enemyData);
    setPlayerBlock(0);
    setCombatLog([]);
    
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDrawPile(shuffled);
    setHand([]);
    setDiscardPile([]);
    setEnergy(maxEnergy);
    
    setGameState('combat');
    
    setTimeout(() => {
      drawCards(5, shuffled);
    }, 100);
  };

  const drawCards = (count, currentDrawPile = drawPile) => {
    let newHand = [...hand];
    let newDrawPile = [...currentDrawPile];
    let newDiscardPile = [...discardPile];
    
    for (let i = 0; i < count; i++) {
      if (newDrawPile.length === 0) {
        if (newDiscardPile.length === 0) break;
        newDrawPile = [...newDiscardPile].sort(() => Math.random() - 0.5);
        newDiscardPile = [];
      }
      
      const card = newDrawPile.pop();
      if (card) newHand.push(card);
    }
    
    setHand(newHand);
    setDrawPile(newDrawPile);
    setDiscardPile(newDiscardPile);
  };

  const playCard = (card, index) => {
    if (energy < card.cost) return;
    
    let newHand = [...hand];
    newHand.splice(index, 1);
    setHand(newHand);
    setEnergy(energy - card.cost);
    
    let log = [];
    
    if (card.type === 'attack') {
      let damage = card.damage;
      const newEnemyHealth = Math.max(0, enemy.health - damage);
      setEnemy({ ...enemy, health: newEnemyHealth });
      log.push(`Vous infligez ${damage} dégâts à ${enemy.name}`);
    }
    
    if (card.block) {
      setPlayerBlock(playerBlock + card.block);
      log.push(`Vous gagnez ${card.block} de Bouclier`);
    }
    
    if (card.energy) {
      setEnergy(energy - card.cost + card.energy);
      log.push(`Vous gagnez ${card.energy} énergie`);
    }
    
    if (card.heal) {
      const newHealth = Math.min(playerMaxHealth, playerHealth + card.heal);
      setPlayerHealth(newHealth);
      log.push(`Vous récupérez ${card.heal} PV`);
    }
    
    if (card.draw) {
      drawCards(card.draw);
      log.push(`Vous piochez ${card.draw} carte(s)`);
    }
    
    setCombatLog([...combatLog, ...log]);
    
    if (card.type === 'consumable') {
      setDeck(deck.filter(c => c.id !== card.id));
    } else {
      setDiscardPile([...discardPile, card]);
    }
  };

  const endTurn = () => {
    setDiscardPile([...discardPile, ...hand]);
    setHand([]);
    
    enemyTurn();
    
    setEnergy(maxEnergy);
    setPlayerBlock(0);
    
    setTimeout(() => {
      drawCards(5);
    }, 1000);
  };

  const enemyTurn = () => {
    if (!enemy || enemy.health <= 0) return;
    
    let log = [];
    
    if (enemy.intent === 'attack') {
      const damageDealt = Math.max(0, enemy.damage - playerBlock);
      setPlayerHealth(Math.max(0, playerHealth - damageDealt));
      log.push(`${enemy.name} vous inflige ${damageDealt} dégâts`);
    } else if (enemy.intent === 'defend') {
      enemy.block += 8;
      log.push(`${enemy.name} gagne 8 de Bouclier`);
    }
    
    enemy.intent = Math.random() > 0.3 ? 'attack' : 'defend';
    setEnemy({ ...enemy });
    
    setCombatLog([...combatLog, ...log]);
  };

  const endCombat = () => {
    if (enemy.health <= 0) {
      setGold(gold + enemy.gold);
      setCombatLog([...combatLog, `Victoire! Vous gagnez ${enemy.gold} pièces d'or`]);
      
      setTimeout(() => {
        offerCardReward();
      }, 1500);
    }
  };

  const offerCardReward = () => {
    setGameState('reward');
  };

  const addCardToDeck = (cardKey) => {
    const newCard = { ...cardDatabase[cardKey], id: Date.now() };
    setDeck([...deck, newCard]);
    continueToNextFloor();
  };

  const skipCardReward = () => {
    continueToNextFloor();
  };

  const continueToNextFloor = () => {
    const nextFloor = floor + 1;
    
    if (nextFloor > 15) {
      if (act < 3) {
        setAct(act + 1);
        setFloor(1);
        generateMap();
        setGameState('map');
      } else {
        setGameState('victory');
      }
    } else {
      setFloor(nextFloor);
      setGameState('map');
    }
  };

  const openMerchant = () => {
    const availableCards = Object.keys(cardDatabase).sort(() => Math.random() - 0.5).slice(0, 6);
    setMerchantCards(availableCards);
    setGameState('merchant');
  };

  const buyCard = (cardKey) => {
    const card = cardDatabase[cardKey];
    const price = card.rarity === 'common' ? 50 : card.rarity === 'uncommon' ? 75 : 100;
    
    if (gold >= price) {
      setGold(gold - price);
      const newCard = { ...card, id: Date.now() };
      setDeck([...deck, newCard]);
    }
  };

  const removeCard = (cardId) => {
    if (gold >= 75) {
      setGold(gold - 75);
      setDeck(deck.filter(c => c.id !== cardId));
    }
  };

  const triggerEvent = () => {
    const events = [
      {
        title: 'Sanctuaire Mystique',
        desc: 'Un autel ancien rayonne d\'une énergie divine...',
        choices: [
          { text: 'Prier (Gagne 20 PV max)', effect: 'maxHealth' },
          { text: 'Prendre l\'or (Gagne 50 pièces)', effect: 'gold' }
        ]
      },
      {
        title: 'Vagabond Mystérieux',
        desc: 'Un étranger vous propose un marché étrange...',
        choices: [
          { text: 'Accepter (Perd 10 PV, gagne une carte rare)', effect: 'trade' },
          { text: 'Refuser', effect: 'nothing' }
        ]
      }
    ];
    
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    setEventChoice(randomEvent);
    setGameState('event');
  };

  const chooseEventOption = (choice) => {
    if (choice.effect === 'maxHealth') {
      setPlayerMaxHealth(playerMaxHealth + 20);
      setPlayerHealth(playerHealth + 20);
    } else if (choice.effect === 'gold') {
      setGold(gold + 50);
    } else if (choice.effect === 'trade') {
      setPlayerHealth(Math.max(1, playerHealth - 10));
      const rareCards = Object.keys(cardDatabase).filter(k => cardDatabase[k].rarity === 'rare');
      const randomRare = rareCards[Math.floor(Math.random() * rareCards.length)];
      const newCard = { ...cardDatabase[randomRare], id: Date.now() };
      setDeck([...deck, newCard]);
    }
    
    continueToNextFloor();
  };

  useEffect(() => {
    if (enemy && enemy.health <= 0 && gameState === 'combat') {
      endCombat();
    }
  }, [enemy]);

  useEffect(() => {
    if (playerHealth <= 0) {
      setGameState('defeat');
    }
  }, [playerHealth]);

  const getCardColor = (rarity) => {
    if (rarity === 'common') return 'border-gray-500';
    if (rarity === 'uncommon') return 'border-blue-400';
    if (rarity === 'rare') return 'border-purple-400';
    return 'border-yellow-400';
  };

  const getCardGlow = (rarity) => {
    if (rarity === 'uncommon') return 'shadow-blue-500/50';
    if (rarity === 'rare') return 'shadow-purple-500/50';
    if (rarity === 'legendary') return 'shadow-yellow-500/50';
    return '';
  };

  if (gameState === 'menu') {
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
  }

  if (gameState === 'map') {
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
                      {node.type === 'merchant' && '🏪'}
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
  }

  if (gameState === 'combat') {
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
  }

  if (gameState === 'reward') {
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
  }

  if (gameState === 'merchant') {
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
              const price = card.rarity === 'common' ? 50 : card.rarity === 'uncommon' ? 75 : 100;
              return (
                <div
                  key={cardKey}
                  onClick={() => buyCard(cardKey)}
                  className={`bg-gradient-to-br from-gray-800 to-gray-900 border-2 ${getCardColor(card.rarity)} rounded-xl p-4 cursor-pointer hover:scale-105 transition-all shadow-lg ${getCardGlow(card.rarity)} ${
                    gold < price ? 'opacity-50 cursor-not-allowed' : ''
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
                className={`bg-gradient-to-br from-gray-800 to-gray-900 border-2 ${getCardColor(card.rarity)} rounded-lg p-3 cursor-pointer hover:scale-105 transition-all ${
                  gold < 75 ? 'opacity-50 cursor-not-allowed' : ''
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
  }

  if (gameState === 'event') {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black p-8 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-gradient-to-br from-purple-900/40 to-black border-2 border-purple-500/50 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-purple-300 mb-4">{eventChoice.title}</h2>
          <p className="text-gray-300 text-lg mb-8">{eventChoice.desc}</p>
          <div className="space-y-4">
            {eventChoice.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => chooseEventOption(choice)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-4 rounded-lg font-semibold shadow-lg shadow-purple-500/50 transition-all text-left"
              >
                {choice.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'defeat') {
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
  }

  if (gameState === 'victory') {
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
  }

  return null;
};

export default RagnarokAscension;
          