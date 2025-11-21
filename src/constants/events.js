export const events = [
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