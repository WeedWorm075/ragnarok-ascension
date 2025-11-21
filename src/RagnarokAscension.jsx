import React, { useEffect } from 'react';
import { useGameState } from './hooks/useGameState.jsx';
import { useCombat } from './hooks/useCombat'; // Ensure this file exists and is .js/.jsx
import { cardDatabase } from './constants/cardDatabase';
import { events } from './constants/events';
import { generateMap } from './utils/mapGenerator';
import MenuScreen from './components/MenuScreen';
import MapScreen from './components/MapScreen';
import CombatScreen from './components/CombatScreen';
import RewardScreen from './components/RewardScreen';
import MerchantScreen from './components/MerchantScreen';
import EventScreen from './components/EventScreen';
import DefeatScreen from './components/DefeatScreen';
import VictoryScreen from './components/VictoryScreen';

const RagnarokAscension = () => {
  const {
    gameState, setGameState,
    playerHealth, setPlayerHealth,
    playerMaxHealth, setPlayerMaxHealth,
    playerBlock, setPlayerBlock,
    gold, setGold,
    energy, setEnergy,
    maxEnergy,
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
  } = useGameState();

  // Ensure useCombat exists or handle potential null return
  const combat = useCombat(gameState);

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
    const newMap = generateMap();
    setMapNodes(newMap);
    setGameState('map');
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
    if (combat && combat.startCombat) {
        combat.startCombat(
        type,
        setEnemy,
        deck,
        setDrawPile,
        setHand,
        setDiscardPile,
        setEnergy,
        maxEnergy,
        setPlayerBlock,
        setCombatLog,
        setGameState,
        (count, pile) => drawCards(count, pile)
        );
    }
  };

  const drawCards = (count, currentDrawPile = null) => {
    if (combat && combat.drawCards) {
        combat.drawCards(
        count,
        currentDrawPile,
        hand,
        drawPile,
        discardPile,
        setHand,
        setDrawPile,
        setDiscardPile
        );
    }
  };

  const playCard = (card, index) => {
    if (combat && combat.playCard) {
        combat.playCard(
        card,
        index,
        energy,
        hand,
        setHand,
        setEnergy,
        enemy,
        setEnemy,
        playerBlock,
        setPlayerBlock,
        playerHealth,
        setPlayerHealth,
        playerMaxHealth,
        combatLog,
        setCombatLog,
        deck,
        setDeck,
        discardPile,
        setDiscardPile,
        (count) => drawCards(count)
        );
    }
  };

  const endTurn = () => {
    if (combat && combat.endTurn) {
        combat.endTurn(
        hand,
        discardPile,
        setDiscardPile,
        setHand,
        () => enemyTurn(),
        setEnergy,
        maxEnergy,
        setPlayerBlock,
        (count) => drawCards(count)
        );
    }
  };

  const enemyTurn = () => {
    if (combat && combat.enemyTurn) {
        combat.enemyTurn(
        enemy,
        setEnemy,
        playerBlock,
        playerHealth,
        setPlayerHealth,
        combatLog,
        setCombatLog
        );
    }
  };

  const endCombat = () => {
    // FIX: Added safety check for enemy existence before accessing .gold
    if (enemy && enemy.health <= 0) {
      setGold(gold + (enemy.gold || 0)); // Safe access
      setCombatLog([...combatLog, `Victoire! Vous gagnez ${enemy.gold || 0} pièces d'or`]);
      
      setTimeout(() => {
        offerCardReward();
      }, 1500);
    }
  };

  const offerCardReward = () => {
    setGameState('reward');
  };

  const addCardToDeck = (cardKey) => {
    if (cardDatabase[cardKey]) {
        const newCard = { ...cardDatabase[cardKey], id: Date.now() };
        setDeck([...deck, newCard]);
    }
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
        const newMap = generateMap();
        setMapNodes(newMap);
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
    if (!card) return;

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
      if (rareCards.length > 0) {
        const randomRare = rareCards[Math.floor(Math.random() * rareCards.length)];
        const newCard = { ...cardDatabase[randomRare], id: Date.now() };
        setDeck([...deck, newCard]);
      }
    }
    
    continueToNextFloor();
  };

  useEffect(() => {
    // FIX: Safety check ensures we don't run logic on null enemy
    if (enemy && enemy.health <= 0 && gameState === 'combat') {
      endCombat();
    }
  }, [enemy, gameState]); // Added gameState dependency for safety

  useEffect(() => {
    if (playerHealth <= 0) {
      setGameState('defeat');
    }
  }, [playerHealth]);

  if (gameState === 'menu') {
    return <MenuScreen startGame={startGame} />;
  }

  if (gameState === 'map') {
    return (
      <MapScreen
        act={act}
        floor={floor}
        playerHealth={playerHealth}
        playerMaxHealth={playerMaxHealth}
        gold={gold}
        mapNodes={mapNodes}
        selectNode={selectNode}
      />
    );
  }

  if (gameState === 'combat') {
    return (
      <CombatScreen
        playerHealth={playerHealth}
        playerMaxHealth={playerMaxHealth}
        playerBlock={playerBlock}
        energy={energy}
        maxEnergy={maxEnergy}
        enemy={enemy}
        combatLog={combatLog}
        hand={hand}
        playCard={playCard}
        endTurn={endTurn}
        drawPile={drawPile}
        discardPile={discardPile}
        deck={deck}
      />
    );
  }

  if (gameState === 'reward') {
    return <RewardScreen addCardToDeck={addCardToDeck} skipCardReward={skipCardReward} />;
  }

  if (gameState === 'merchant') {
    return (
      <MerchantScreen
        gold={gold}
        merchantCards={merchantCards}
        buyCard={buyCard}
        deck={deck}
        removeCard={removeCard}
        continueToNextFloor={continueToNextFloor}
      />
    );
  }

  if (gameState === 'event') {
    return <EventScreen eventChoice={eventChoice} chooseEventOption={chooseEventOption} />;
  }

  if (gameState === 'defeat') {
    return <DefeatScreen floor={floor} act={act} startGame={startGame} />;
  }

  if (gameState === 'victory') {
    return <VictoryScreen startGame={startGame} />;
  }

  return null;
};

export default RagnarokAscension;