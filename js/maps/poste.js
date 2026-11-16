// Le poste électrique du quartier, au bout de la rue : bâtiment HTA/BT, transformateur, pylônes.
const row = (a, b = 'gg') => 'g' + a.repeat(17) + b;
export default {
  id: 'poste',
  name: 'Lannion — Poste électrique',
  bg: '#6fb85a',
  fx: 'leaves',
  rows: [
    'g'.repeat(20),
    row('v'), row('v'), row('v'), row('v'), row('v'), row('v'),
    row('v', 'pp'), row('v', 'pp'),
    row('v'), row('v'), row('v'),
    'g'.repeat(20),
  ],
  // Tout le bord droit (sauf derrière les arbres) ramène dans la rue, à une hauteur équivalente
  warps: [0, 1, 4, 5, 6, 7, 8, 9, 12].map(y => ({ x: 19, y, to: 'rue', tx: 1, ty: Math.max(5, Math.min(13, y)), dir: 'right' })),
  objects: [
    { t: 'fence', x: 1, y: 1, w: 17, text: ['Un grillage. « Danger de mort — Défense d\'entrer ».'] },
    { t: 'fence', x: 1, y: 11, w: 17, text: ['Un grillage.'] },
    { t: 'substation', id: 'cellule', x: 3, y: 2, w: 5, h: 3, text: ['Le bâtiment du poste. Derrière la porte : les cellules haute tension.'] },
    { t: 'transfo', id: 'transfo', x: 10, y: 3, w: 3, h: 2, text: ['Un transformateur 20 000 V / 400 V.', 'k: Qu\'est-ce qu\'il est beau.'] },
    { t: 'pylon', x: 15, y: 3, text: ['Un pylône. Les câbles sifflent dans le vent.'] },
    { t: 'pylon', x: 1, y: 6, text: ['Un pylône. Les câbles sifflent dans le vent.'] },
    { t: 'workvan', x: 12, y: 9, w: 3, h: 2, text: ['La camionnette d\'intervention. Le gyrophare tourne.'] },
    { t: 'crate', x: 9, y: 9, text: ['Une caisse de fusibles de rechange.'] },
    { t: 'tree', x: 18, y: 2, w: 2, h: 2 }, { t: 'tree', x: 18, y: 10, w: 2, h: 2 },
  ],
};
