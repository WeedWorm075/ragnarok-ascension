export const enemyDatabase = {
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