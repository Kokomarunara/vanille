// Appart de Lannion — étage (meubles 12 à 17) : deux chambres reliées par une passerelle.
// La chambre de Ketura n'est pas un rectangle : un renfoncement part vers la gauche au-dessus
// de la passerelle (bureau au fond), et le coin du lit, en bas, est plus étroit.
export default {
  id: 'etage',
  name: 'L\'appart — Étage',
  bg: '#2c2535',
  rows: [
    '########   ############',
    '########   ############',
    '#~~~~~~#   #;;;;;;;;;;#',
    '#~~~~~~#   #;;;;;;;;;;#',
    '#~~~~~~#   #;;;;;;;;;;#',
    '#~~~~~~#   #######;;;;#',
    '#~~~~~~d=========d;;;;#',
    '#~~~~~~#=========#;;;;#',
    '#~~~~~~#       ==#;;;;#',
    '#~~~~~~#       ==#;;;;#',
    '#~~~~~~#         #;;;;#',
    '#~~~~~~#         #;;;;#',
    '#~~~~~~#         #;;;;#',
    '########         ######',
  ],
  objects: [
    // --- Palier ---
    // escalier collé au mur de droite, juste sous la passerelle ; en dessous, la cage d'escalier (le vide)
    { t: 'stairs', id: 'stairsE', v: 'down', x: 15, y: 8, w: 2, h: 2, touch: g => g.warp('rdc', 16, 4, 'down'), text: ['L\'arrivée de l\'escalier. Il redescend au salon.'] },
    // --- Chambre du futur coloc ---
    { t: 'window', id: 'win16', x: 3, y: 1, back: 1, text: ['La fenêtre de la chambre en plus. Elle donne sur la rue.'] },
    { t: 'deskV', id: 'desk17', x: 1, y: 5, h: 3, text: ['Un bureau vide.', 'Il attend le futur coloc.'] },
    { t: 'bedBig', id: 'bed16', x: 3, y: 9, w: 3, h: 4, col: '#d8c8a0', colD: '#b8a67c', text: ['Un grand lit, dans la chambre en plus.', 'Il a l\'air drôlement confortable...'] },
    // --- Chambre de Ketura ---
    { t: 'window', x: 15, y: 1, back: 1 }, { t: 'window', x: 18, y: 1, back: 1 },
    { t: 'deskV', id: 'deskK', x: 12, y: 2, h: 2, v: 'elec', text: ['Le bureau de Ketura, au fond du renfoncement.', 'Un cahier d\'électricité : schémas de transformateurs, couplages étoile-triangle...', 'k: Le transformateur, c\'est quand même la plus belle invention du monde.'] },
    { t: 'wardrobe', id: 'wardrobeK', x: 20, y: 2, w: 2, h: 2, text: ['L\'armoire à vêtements de Ketura.', 'k: Mes vêtements. Bien pliés. Par couleur.'] },
    { t: 'rug', x: 18, y: 5, w: 3, h: 3, flat: 1, col: '#e8c060', colD: '#b8903a' },
    { t: 'plant', x: 16, y: 2, text: ['Une plante. Zéro poussière sur les feuilles, bien sûr.'] },
    { t: 'bedBig', id: 'bedK', x: 18, y: 9, w: 4, h: 4, col: '#c05a70', colD: '#983f56', text: ['Le grand lit, collé aux murs. Il prend toute la largeur.', 'k: Fait au carré. Comme il se doit.'] },
  ],
};
