export const generateMap = () => {
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
  
  return nodes;
};