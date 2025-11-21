import React, { createContext, useContext, useState } from 'react';

// 1. Création du Contexte
const GameContext = createContext(null);

// 2. Le Hook pour consommer le contexte
export const useGameState = () => {
  const context = useContext(GameContext);
  console.log("Debug useGameState - Context value:", context);
  if (!context) {
    throw new Error("useGameState doit être utilisé à l'intérieur d'un <GameProvider>");
  }
  return context;
};

// 3. Le Provider qui contient tout l'état (votre code d'origine)
export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState('menu');
  const [playerHealth, setPlayerHealth] = useState(80);
  const [playerMaxHealth, setPlayerMaxHealth] = useState(80);
  const [playerBlock, setPlayerBlock] = useState(0);
  const [gold, setGold] = useState(100);
  const [energy, setEnergy] = useState(3);
  const [maxEnergy] = useState(3); // Changé en state au cas où des reliques l'augmentent
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

  // L'objet contenant toutes les valeurs et setters à partager
  const value = {
    gameState, setGameState,
    playerHealth, setPlayerHealth,
    playerMaxHealth, setPlayerMaxHealth,
    playerBlock, setPlayerBlock,
    gold, setGold,
    energy, setEnergy,
    maxEnergy, // Pas de setter si c'est une constante, sinon ajouter setMaxEnergy
    deck, setDeck,
    hand, setHand,
    discardPile, setDiscardPile,
    drawPile, setDrawPile,
    enemy, setEnemy,
    floor, setFloor,
    act, setAct,
    mapNodes, setMapNodes,
    currentPath, setCurrentPath,
    merchantCards, setMerchantCards,
    eventChoice, setEventChoice,
    combatLog, setCombatLog,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};