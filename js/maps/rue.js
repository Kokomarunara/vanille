// La rue devant l'appart, à Lannion.
export default {
  id: 'rue',
  name: 'Lannion — La rue',
  bg: '#6fb85a',
  fx: 'leaves',
  rows: [
    'RRRRRRRRRRRRRRRRRRRRRR',
    'RRRRRRRRRRRRRRRRRRRRRR',
    'FFFFFFFFFFFFFFFFFFFFFF',
    'FFFFFFFFFFFFFFFFFFFFFF',
    'FFFFFFFFFFFFFFFFFFFFFF',
    'ssssssssssssssssssssss',
    'ssssssssssssssssssssss',
    'rrrrrrrrrrrrrrrrrrrrrr',
    'rrrrrrrrrrrrrrrrrrrrrr',
    'rrrrrrrrrrrrrrrrrrrrrr',
    'gggggggggggggggggggggg',
    'gggggggggggggggggggggg',
    'gggggggggggggggggggggg',
    'gggggggggggggggggggggg',
    'gggggggggggggggggggggg',
    'gggggggggggggggggggggg',
  ],
  // au bout du trottoir, a droite : la place du marche
  // Passages sur tout le bord (trottoir, route et pelouse : lignes 5 à 13) :
  // à droite vers la place du marché, à gauche vers le poste électrique (chapitre 5). On arrive à la même hauteur.
  warps: [
    ...Array.from({ length: 9 }, (_, i) => ({ x: 21, y: 5 + i, to: 'marche', tx: 1, ty: 5 + i, dir: 'right' })),
    ...Array.from({ length: 9 }, (_, i) => ({ x: 0, y: 5 + i, to: 'poste', tx: 18, ty: Math.min(12, 5 + i), dir: 'left' })),
  ],
  objects: [
    { t: 'sign', x: 18, y: 3, w: 4, label: 'MARCHÉ >', text: ['Un panneau : « Place du marché », avec une flèche vers la droite.'] },
    { t: 'sign', x: 0, y: 3, w: 3, label: '< POSTE', text: ['Un panneau : « Poste électrique », avec une flèche vers la gauche.'] },
    { t: 'extdoor', id: 'door', x: 9, y: 3, h: 2, touch: g => g.warp('rdc', 8, 12, 'up'), text: ['La porte de l\'appart.'] },
    { t: 'fwin', x: 3, y: 2 }, { t: 'fwin', x: 6, y: 2 }, { t: 'fwin', x: 9, y: 2 }, { t: 'fwin', x: 13, y: 2 }, { t: 'fwin', x: 16, y: 2 }, { t: 'fwin', x: 19, y: 2 },
    { t: 'fwin', x: 5, y: 4 }, { t: 'fwin', x: 13, y: 4 }, { t: 'fwin', x: 17, y: 4 },
    { t: 'lamp', x: 12, y: 6, text: ['Un lampadaire. Alimenté en 230 V, comme tout le quartier.'] },
    { t: 'tree', x: 3, y: 10, w: 2, h: 2, text: ['Le vent breton fait danser les feuilles.'] },
    { t: 'tree', x: 17, y: 10, w: 2, h: 2, text: ['Le vent breton fait danser les feuilles.'] },
    // rangée d'arbres serrés qui ferme le bas de la carte
    ...Array.from({ length: 11 }, (_, i) => ({ t: 'tree', x: i * 2, y: 14, w: 2, h: 2, text: ['Les arbres sont trop serrés pour passer.'] })),
    { t: 'bench', x: 8, y: 10, w: 2, text: ['Un banc. Parfait pour souffler après un footing.'] },
    { t: 'bush', x: 5, y: 11, text: ['Des hortensias. On est bien en Bretagne.'] },
    { t: 'bush', x: 12, y: 11, v: 'pink', text: ['Des hortensias roses.'] },
    { t: 'bush', x: 15, y: 11, text: ['Des hortensias. On est bien en Bretagne.'] },
  ],
};
