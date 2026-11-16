// Le parc éolien, en haut de la falaise, face à la mer.
// Les trois éoliennes sont ajoutées par le chapitre 5 (à l'arrêt, puis relancées une à une).
const W = 26;
export default {
  id: 'parc',
  name: 'Parc éolien de la côte',
  bg: '#3a62a8',
  fx: 'leaves',
  rows: [
    'w'.repeat(W), 'w'.repeat(W), 'w'.repeat(W),
    'f'.repeat(W),
    ...Array(7).fill('g'.repeat(W)),
    'g'.repeat(W),
    'p'.repeat(W),
    ...Array(3).fill('g'.repeat(W)),
  ],
  objects: [
    { t: 'waves', x: 0, y: 0, w: W, h: 3, spot: 1 },
    { t: 'gorse', x: 2, y: 5, text: ['Des ajoncs en fleur. Ça sent la noix de coco.'] },
    { t: 'gorse', x: 9, y: 4, text: ['Des ajoncs en fleur.'] },
    { t: 'gorse', x: 17, y: 5, text: ['Des ajoncs en fleur. Ça sent la noix de coco.'] },
    { t: 'gorse', x: 24, y: 6, text: ['Des ajoncs en fleur.'] },
    { t: 'gorse', x: 8, y: 14, text: ['Des ajoncs en fleur.'] },
    { t: 'gorse', x: 16, y: 15, text: ['Des ajoncs en fleur.'] },
    { t: 'rock', x: 3, y: 10, text: ['Un rocher de granit rose.'] },
    { t: 'rock', x: 16, y: 10, text: ['Un rocher de granit rose.'] },
    { t: 'rock', x: 23, y: 14, text: ['Un rocher de granit rose.'] },
    { t: 'bench', x: 10, y: 10, w: 2, text: ['Un banc, face à la mer. La plus belle vue de la côte.'] },
    { t: 'bush', x: 1, y: 14, v: 'pink' }, { t: 'bush', x: 21, y: 4 },
  ],
};
