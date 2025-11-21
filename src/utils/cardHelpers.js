export const getCardColor = (rarity) => {
  if (rarity === 'common') return 'border-gray-500';
  if (rarity === 'uncommon') return 'border-blue-400';
  if (rarity === 'rare') return 'border-purple-400';
  return 'border-yellow-400';
};

export const getCardGlow = (rarity) => {
  if (rarity === 'uncommon') return 'shadow-blue-500/50';
  if (rarity === 'rare') return 'shadow-purple-500/50';
  if (rarity === 'legendary') return 'shadow-yellow-500/50';
  return '';
};

export const getCardPrice = (rarity) => {
  if (rarity === 'common') return 50;
  if (rarity === 'uncommon') return 75;
  return 100;
};