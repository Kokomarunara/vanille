// La place du marché de Lannion : maisons à colombages, étals, fontaine.
// Les vendeurs et le camion de Loïc sont ajoutés par le chapitre 3.
const W = 26;
export default {
  id: 'marche',
  name: 'Lannion — Place du marché',
  bg: '#6fb85a',
  fx: 'leaves',
  rows: [
    'R'.repeat(W), 'R'.repeat(W),
    'H'.repeat(W), 'H'.repeat(W), 'H'.repeat(W),
    ...Array(11).fill('c'.repeat(W)),
    'g'.repeat(W), 'g'.repeat(W),
  ],
  // Tout le bord gauche de la place (lignes 5 à 15) ramène dans la rue, à la même hauteur (la rue s'arrête à la ligne 13)
  warps: Array.from({ length: 11 }, (_, i) => ({ x: 0, y: 5 + i, to: 'rue', tx: 20, ty: Math.min(13, 5 + i), dir: 'left' })),
  objects: [
    // --- façades ---
    { t: 'sign', x: 2, y: 2, w: 4, label: 'ÉPICERIE', text: ['« Épicerie du monde — produits d\'ici et d\'ailleurs ».'] },
    { t: 'extdoor', id: 'shopdoor', x: 3, y: 3, h: 2, col: '#3f8f6a', colD: '#2c6e50', colL: '#63b88c', touch: g => g.warp('epicerie', 6, 9, 'up'), text: ['La porte de l\'épicerie du monde.'] },
    { t: 'fwin', x: 8, y: 2 }, { t: 'fwin', x: 12, y: 2 }, { t: 'fwin', x: 16, y: 2 }, { t: 'fwin', x: 20, y: 2 }, { t: 'fwin', x: 24, y: 2 },
    { t: 'fwin', x: 10, y: 4 }, { t: 'fwin', x: 14, y: 4 }, { t: 'fwin', x: 18, y: 4 }, { t: 'fwin', x: 22, y: 4 },
    { t: 'lamp', x: 6, y: 6, text: ['Un vieux réverbère. Il mériterait un passage en LED.'] },
    { t: 'lamp', x: 18, y: 6, text: ['Un vieux réverbère. Il mériterait un passage en LED.'] },
    // --- étals ---
    { t: 'stall', id: 'stallLeg', v: 'leg', x: 8, y: 8, w: 3, h: 2, text: ['Un étal de légumes. Et une citrouille qui sourit bizarrement.'] },
    { t: 'stall', id: 'stallCrepes', v: 'crepes', x: 14, y: 8, w: 3, h: 2, text: ['Un stand de crêpes. Ça sent le beurre salé jusqu\'ici.'] },
    { t: 'stall', id: 'stallViande', v: 'viande', x: 20, y: 8, w: 3, h: 2, text: ['L\'étal du boucher.'] },
    { t: 'stall', id: 'stallPoisson', v: 'poisson', x: 3, y: 12, w: 3, h: 2, text: ['L\'étal du poissonnier. Du maquereau sur un lit de glace.'] },
    { t: 'crate', v: 'pommes', x: 11, y: 9, text: ['Une cagette de pommes de Bretagne.'] },
    { t: 'crate', x: 17, y: 9, text: ['Une cagette de citrons.'] },
    { t: 'crate', v: 'pommes', x: 7, y: 13, text: ['Une cagette de pommes.'] },
    { t: 'crate', x: 18, y: 12, text: ['Une cagette qui traîne au milieu du passage.'] },
    { t: 'crate', v: 'pommes', x: 17, y: 14, text: ['Une cagette qui traîne au milieu du passage.'] },
    // --- centre de la place ---
    { t: 'fountain', x: 11, y: 11, w: 3, h: 3, text: ['La fontaine de la place.', 'k: Une petite pompe de relevage, quelques watts à peine. Joli travail.'] },
    { t: 'bench', x: 8, y: 15, w: 2, text: ['Un banc, face à la fontaine.'] },
    { t: 'bush', x: 5, y: 15, v: 'pink', text: ['Des hortensias roses.'] },
    { t: 'bush', x: 24, y: 6, text: ['Des hortensias. On est bien en Bretagne.'] },
    // rangée d'arbres qui ferme le bas de la place
    ...Array.from({ length: 13 }, (_, i) => ({ t: 'tree', x: i * 2, y: 16, w: 2, h: 2, text: ['Les arbres de la place.'] })),
  ],
};
