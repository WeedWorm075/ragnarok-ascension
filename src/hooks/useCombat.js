import { enemyDatabase } from '../constants/enemyDatabase';

export const useCombat = (gameState) => {
  const startCombat = (type, setEnemy, deck, setDrawPile, setHand, setDiscardPile, setEnergy, maxEnergy, setPlayerBlock, setCombatLog, setGameState, drawCards) => {
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

  const drawCards = (count, currentDrawPile, hand, drawPile, discardPile, setHand, setDrawPile, setDiscardPile) => {
    let newHand = [...hand];
    let newDrawPile = currentDrawPile ? [...currentDrawPile] : [...drawPile];
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

  const playCard = (card, index, energy, hand, setHand, setEnergy, enemy, setEnemy, playerBlock, setPlayerBlock, playerHealth, setPlayerHealth, playerMaxHealth, combatLog, setCombatLog, deck, setDeck, discardPile, setDiscardPile, drawCardsFunc) => {
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
      drawCardsFunc(card.draw);
      log.push(`Vous piochez ${card.draw} carte(s)`);
    }
    
    setCombatLog([...combatLog, ...log]);
    
    if (card.type === 'consumable') {
      setDeck(deck.filter(c => c.id !== card.id));
    } else {
      setDiscardPile([...discardPile, card]);
    }
  };

  const enemyTurn = (enemy, setEnemy, playerBlock, playerHealth, setPlayerHealth, combatLog, setCombatLog) => {
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

  const endTurn = (hand, discardPile, setDiscardPile, setHand, enemyTurnFunc, setEnergy, maxEnergy, setPlayerBlock, drawCardsFunc) => {
    setDiscardPile([...discardPile, ...hand]);
    setHand([]);
    
    enemyTurnFunc();
    
    setEnergy(maxEnergy);
    setPlayerBlock(0);
    
    setTimeout(() => {
      drawCardsFunc(5);
    }, 1000);
  };

  return {
    startCombat,
    drawCards,
    playCard,
    enemyTurn,
    endTurn,
  };
};