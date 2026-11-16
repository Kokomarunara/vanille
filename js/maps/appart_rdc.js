// Appart de Lannion — rez-de-chaussée (d'après Ref/plan appart.png, meubles 1 à 11).
// Les textes « k: » sont dits par Ketura, « a: » par Antoine, les autres sont de la narration.
export default {
  id: 'rdc',
  name: 'L\'appart — Rez-de-chaussée',
  rows: [
    '########################',
    '########################',
    '#,,,,,#..........#:::::#',
    '#,,,,,#..........#:::::#',
    '#,,,,,#..........d:::::#',
    '#,,,,,#..........#:::::#',
    '#,,,,,#..........#:::::#',
    '####d##..........#:::::#',
    '#,,,,,#..........#:::::#',
    '#,,,,,#..........#:::::#',
    '#,,,,,#..........#:::::#',
    '#,,,,,d..........#:::::#',
    '#,,,,,#..........#:::::#',
    '########d###############',
  ],
  warps: [{ x: 8, y: 13, to: 'rue', tx: 9, ty: 5, dir: 'down' }],
  objects: [
    // --- Salle de bain ---
    { t: 'shower', id: 'shower', x: 4, y: 2, w: 2, h: 2, text: ['La douche.', 'k: Propre. Très propre. C\'est moi qui l\'ai frottée, évidemment.'] },
    { t: 'sink', v: 'side', x: 5, y: 4, text: ['Le lavabo et son petit miroir.', 'k: Hmm. Pas mal, la fille dans le miroir.'] },
    { t: 'window', x: 2, y: 1, back: 1 },
    // --- Buanderie ---
    { t: 'washer', id: 'washer', x: 1, y: 8, h: 2, text: ['La vieille machine à laver.', 'Elle fait un bruit de tracteur à l\'essorage. Un jour, elle lâchera.'] },
    // tableau sur le mur de droite de la buanderie, juste à gauche de la porte quand on vient du salon
    { t: 'panel', id: 'panel', v: 'side', x: 6, y: 12, text: ['Le tableau électrique de l\'appart.', 'k: Un différentiel 30 mA, six départs. Propre.'] },
    // --- Salon ---
    { t: 'fridge', id: 'fridge', x: 7, y: 2, text: ['Le frigo.', 'k: Qui a fini le dessert à la vanille ?!'] },
    { t: 'counter', id: 'counter', x: 7, y: 3, h: 4, text: ['Le plan de cuisine.', 'Ça sent encore un peu les épices.'] },
    { t: 'cabinet', id: 'cabinet', x: 7, y: 8, h: 2, text: ['Le meuble à vaisselle et à provisions.', 'Du riz, des pois, des pâtes... et un piment qui traîne.'] },
    // escalier contre le mur du fond, juste à gauche de la porte d'Antoine : on y monte en sortant de sa chambre
    { t: 'stairs', id: 'stairs', x: 15, y: 2, w: 2, h: 2, touch: g => g.warp('etage', 16, 7, 'up'), text: ['L\'escalier. Il monte à l\'étage.'] },
    { t: 'broom', id: 'broom', x: 14, y: 3, text: ['Un balai, rangé contre l\'escalier.'] },
    { t: 'window', x: 9, y: 1, back: 1 }, { t: 'window', x: 14, y: 1, back: 1 },
    { t: 'plant', x: 12, y: 2, text: ['Une plante verte. Elle a l\'air heureuse ici.'] },
    { t: 'rug', x: 10, y: 9, w: 4, h: 3, flat: 1, col: '#b8506a', colD: '#8f3a52' },
    { t: 'chair', x: 14, y: 5, v: 'up', text: ['Une chaise.'] },
    { t: 'chair', x: 13, y: 6, v: 'left', text: ['Une chaise.'] },
    { t: 'table', id: 'table', x: 14, y: 6, w: 3, h: 2, text: ['La table du salon, collée au mur, avec sa petite plante.', 'C\'est ici qu\'on mange, qu\'on révise et qu\'on refait le monde.'] },
    { t: 'chair', x: 14, y: 8, text: ['Une chaise.'] },
    { t: 'sofa', id: 'sofa', x: 15, y: 9, w: 2, h: 3, text: ['Le petit canapé.', 'Petit, mais on y tient à deux. En se serrant.'] },
    { t: 'mat', x: 8, y: 12, flat: 1 },
    // --- Chambre d'Antoine ---
    { t: 'desk', x: 18, y: 2, w: 2, v: 'phys', text: ['Le bureau d\'Antoine.', 'Un cahier de physique et de maths, couvert d\'équations.', 'Et une tasse de chocolat chaud, refroidi depuis longtemps.'] },
    { t: 'wardrobe', x: 21, y: 2, w: 2, h: 2, text: ['L\'armoire à vêtements d\'Antoine.', 'k: C\'est... rangé à sa façon. Je repasserai derrière.'] },
    { t: 'window', x: 20, y: 1, back: 1 },
    { t: 'bedTwin', id: 'bedA', x: 20, y: 9, w: 3, h: 4, text: ['Deux lits une place, collés l\'un contre l\'autre.', 'Astucieux.'] },
  ],
};
