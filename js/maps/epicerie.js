// L'épicerie du monde : rayonnages, sacs de riz, et les bananes plantain tout au fond.
export default {
  id: 'epicerie',
  name: 'Épicerie du monde',
  rows: [
    '##############',
    '##############',
    '#kkkkkkkkkkkk#',
    '#kkkkkkkkkkkk#',
    '#kkkkkkkkkkkk#',
    '#kkkkkkkkkkkk#',
    '#kkkkkkkkkkkk#',
    '#kkkkkkkkkkkk#',
    '#kkkkkkkkkkkk#',
    '#kkkkkkkkkkkk#',
    '######d#######',
  ],
  warps: [{ x: 6, y: 10, to: 'marche', tx: 3, ty: 5, dir: 'down' }],
  objects: [
    // le fond du magasin : les bananes sont dans le coin, derrière la colonne de sacs de riz
    { t: 'bananas', id: 'bananas', x: 1, y: 2, text: ['Des bananes plantain, bien vertes.'] },
    { t: 'shelf', v: 'spices', x: 2, y: 2, w: 3, text: ['Des épices du monde entier : épis, piment, girofle, muscade...'] },
    { t: 'shelf', v: 'cans', x: 5, y: 2, w: 3, text: ['Des conserves : lait de coco, pois d\'Angole, sauce tomate.'] },
    { t: 'shelf', v: 'drinks', x: 8, y: 2, w: 3, text: ['Des sodas colorés et des jus de fruits de la passion.'] },
    { t: 'shelf', v: 'spices', x: 11, y: 2, w: 2, text: ['Des bocaux de pikliz maison.', 'k: Ça, c\'est du sérieux.'] },
    { t: 'sacks', x: 2, y: 3, h: 4, text: ['Des sacs de riz, empilés jusqu\'à hauteur d\'épaule.'] },
    // rayons du milieu
    { t: 'shelf', v: 'cans', x: 4, y: 5, w: 3, text: ['Des boîtes de haricots de toutes les couleurs.'] },
    { t: 'shelf', v: 'drinks', x: 4, y: 7, w: 2, text: ['Du sirop de canne et de l\'extrait de vanille.', 'k: De la vanille... Je repasserai.'] },
    // caisse
    { t: 'shopcounter', id: 'counterShop', x: 9, y: 6, w: 3, text: ['Le comptoir de l\'épicerie.'] },
    { t: 'crate', v: 'pommes', x: 12, y: 8, text: ['Une cagette de mangues. Pas tout à fait mûres.'] },
    { t: 'plant', x: 12, y: 9, text: ['Une plante verte, près de la vitrine.'] },
    { t: 'mat', x: 6, y: 9, flat: 1 },
  ],
};
