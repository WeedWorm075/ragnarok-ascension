export const cardDatabase = {
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