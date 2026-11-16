// Personnages 16x24 dessinés par code, 4 directions, 3 poses de marche, avec contour automatique.

const LOOKS = {
  ketura: {
    skin: '#8d5a3b', skinS: '#6f4329', hair: '#1c1512', hairL: '#57402f', eye: '#1a1010',
    top: '#8c2f39', topS: '#6c212b', pants: '#3f6aa8', pantsS: '#2f5288', shoes: '#2a2228', braids: true,
  },
  antoine: {
    skin: '#f2caa4', skinS: '#d9a57c', hair: '#2a1c14', hairL: '#4f3828', eye: '#2a1c14',
    top: '#2b3a67', topS: '#1f2b4f', pants: '#6b6258', pantsS: '#544c44', shoes: '#6b3f22', beard: '#3d2b1f', collar: '#f4f4f0',
  },
  // --- Gens du marché ---
  yann: { // maraîcher en marinière et casquette
    skin: '#f0c49c', skinS: '#d49f78', hair: '#6b4a2e', hairL: '#8a6642', eye: '#2a1c14',
    top: '#f4f4ee', topS: '#d8d8d0', stripes: '#2b3a67', pants: '#3f5a8a', pantsS: '#2f4670', shoes: '#4a3a2a', style: 'cap', cap: '#3f8f45', capD: '#2c6c38',
  },
  boucher: {
    skin: '#f2c8a8', skinS: '#d8a484', hair: '#3a3a40', hairL: '#5a5a62', eye: '#2a1c14',
    top: '#f4f4ee', topS: '#d8d8d0', apron: '#c8443a', pants: '#3a3a44', pantsS: '#2a2a32', shoes: '#2a2228', beard: '#3a3a40',
  },
  crepiere: {
    skin: '#f4d0b0', skinS: '#dcae8a', hair: '#b8502a', hairL: '#d8743e', eye: '#2a1c14',
    top: '#e8a838', topS: '#c88820', apron: '#f4f4ee', pants: '#5a4a6a', pantsS: '#463a54', shoes: '#4a3a2a', style: 'bun',
  },
  poissonnier: {
    skin: '#e8b890', skinS: '#cc9870', hair: '#d8d8dc', hairL: '#f0f0f4', eye: '#2a1c14',
    top: '#3a78c8', topS: '#2c5ea0', apron: '#e8e8ee', pants: '#2f4670', pantsS: '#243654', shoes: '#3a5a3a', beard: '#d8d8dc',
  },
  epicier: {
    skin: '#a8703f', skinS: '#8a5830', hair: '#1c1512', hairL: '#3a2c22', eye: '#1a1010',
    top: '#3f8f6a', topS: '#2c6e50', apron: '#e8d8a8', pants: '#4a4038', pantsS: '#3a322c', shoes: '#2a2228',
  },
  mamie: {
    skin: '#f4d4bc', skinS: '#dcb49a', hair: '#d0d0d8', hairL: '#ececf2', eye: '#3a2c2c',
    top: '#9a78b8', topS: '#7a5c98', pants: '#5a5a6a', pantsS: '#464654', shoes: '#3a2a2a', style: 'bun',
  },
  loic: { // maraîcher au ciré jaune
    skin: '#f0c49c', skinS: '#d49f78', hair: '#2a1c14', hairL: '#4f3828', eye: '#2a1c14',
    top: '#f0c830', topS: '#c8a020', pants: '#3f5a8a', pantsS: '#2f4670', shoes: '#3a5a3a', beard: '#3d2b1f', style: 'cap', cap: '#2b3a67', capD: '#1f2b4f',
  },
  // --- Chapitre 5 ---
  ketura_pro: { // tenue d'intervention : veste bleue à bandes réfléchissantes, casque blanc
    skin: '#8d5a3b', skinS: '#6f4329', hair: '#1c1512', hairL: '#57402f', eye: '#1a1010',
    top: '#2a4fa8', topS: '#1f3c84', stripes: '#f0e040', pants: '#24345c', pantsS: '#1a2644', shoes: '#2a2228', braids: true, helmet: '#f4f4ee', helmetD: '#c8ccd4',
  },
  florian: { // Florian Le Cornec, tuteur de stage chez Enedis
    skin: '#eec0a0', skinS: '#d09c7c', hair: '#5a3e2a', hairL: '#7a5a40', eye: '#2a1c14',
    top: '#2a4fa8', topS: '#1f3c84', stripes: '#f0e040', pants: '#24345c', pantsS: '#1a2644', shoes: '#2a2228', beard: '#5a3e2a', helmet: '#f4f4ee', helmetD: '#c8ccd4',
  },
  prof: { // Mme Kervarrec, professeure d'électrotechnique, en blouse blanche, cheveux mi-longs
    skin: '#f0c8a8', skinS: '#d4a484', hair: '#6a4a38', hairL: '#8a6a52', eye: '#2a1c14',
    top: '#f4f4ee', topS: '#d8d8d0', pants: '#4a4a58', pantsS: '#3a3a46', shoes: '#3a2a22', collar: '#3a78c8', style: 'long',
  },
  eleve: {
    skin: '#e8b890', skinS: '#cc9870', hair: '#3a2a1e', hairL: '#5a4636', eye: '#2a1c14',
    top: '#58a070', topS: '#3f7a54', pants: '#3f5a8a', pantsS: '#2f4670', shoes: '#f4f4ee', // Maxime, cheveux courts
  },
};

const cache = {};
const OUTLINE = [42, 32, 44];

// f : 0 (immobile), 1 et 2 (marche), 'r1' et 'r2' (course)
function body(p, L, dir, f) {
  const run = f === 'r1' || f === 'r2';
  if (dir === 'down' || dir === 'up') {
    // jambes (en course, le genou monte bien plus haut)
    const ll = f === 1 ? 1 : f === 'r1' ? 3 : 0, rl = f === 2 ? 1 : f === 'r2' ? 3 : 0;
    if (ll < 3) p(5, 19, 3, 3 - ll, L.pants); p(5, 22 - ll, 3, 2, L.shoes);
    if (rl < 3) p(8, 19, 3, 3 - rl, L.pants); p(8, 22 - rl, 3, 2, L.shoes);
    p(7, 19, 2, 1, L.pantsS);
    // torse et bras
    p(4, 12, 8, 7, L.top); p(4, 17, 8, 2, L.topS);
    if (run) { // bras pliés qui pompent en alternance
      const lu = f === 'r2', ru = f === 'r1';
      p(2, 12, 2, lu ? 2 : 4, L.top); p(lu ? 3 : 2, lu ? 14 : 16, 2, lu ? 2 : 1, lu ? L.top : L.skin); if (lu) p(4, 13, 1, 2, L.skin);
      p(12, 12, 2, ru ? 2 : 4, L.top); p(ru ? 11 : 12, ru ? 14 : 16, 2, ru ? 2 : 1, ru ? L.top : L.skin); if (ru) p(11, 13, 1, 2, L.skin);
    } else {
      const la = f === 1 ? -1 : 0, ra = f === 2 ? -1 : 0;
      p(2, 12, 2, 5 + la, L.top); p(2, 17 + la, 2, 1, L.skin);
      p(12, 12, 2, 5 + ra, L.top); p(12, 17 + ra, 2, 1, L.skin);
    }
    if (L.stripes) { p(4, 13, 8, 1, L.stripes); p(4, 15, 8, 1, L.stripes); p(2, 13, 2, 1, L.stripes); p(12, 13, 2, 1, L.stripes); }
    if (dir === 'down' && L.apron) { p(5, 14, 6, 5, L.apron); p(6, 12, 1, 2, L.apron); p(9, 12, 1, 2, L.apron); }
    if (dir === 'up' && L.apron) p(4, 15, 8, 1, L.apron);
    if (dir === 'down' && L.collar) { p(6, 12, 4, 1, L.collar); p(7, 13, 2, 1, L.collar); }
    if (dir === 'down' && L.braids) p(7, 13, 2, 1, '#e8c060');
  } else { // profil gauche
    if (f === 0) { p(6, 19, 4, 3, L.pants); p(5, 22, 5, 2, L.shoes); }
    else if (f === 1) { p(4, 19, 3, 3, L.pants); p(3, 22, 3, 2, L.shoes); p(9, 19, 3, 2, L.pantsS); p(10, 21, 3, 2, L.shoes); }
    else if (f === 2) { p(5, 19, 3, 2, L.pantsS); p(4, 21, 3, 2, L.shoes); p(8, 19, 3, 3, L.pants); p(7, 22, 4, 2, L.shoes); }
    else if (f === 'r1') { // grande foulée : jambe avant tendue, jambe arrière relevée
      p(2, 19, 5, 2, L.pants); p(0, 20, 3, 3, L.shoes); p(9, 19, 4, 2, L.pantsS); p(12, 18, 3, 2, L.shoes);
    } else { // jambes groupées, en l'air
      p(5, 19, 4, 2, L.pants); p(4, 21, 4, 2, L.shoes); p(8, 19, 3, 1, L.pantsS); p(9, 20, 3, 2, L.shoes);
    }
    const lean = run ? -1 : 0;
    p(5 + lean, 12, 7, 7, L.top); p(5 + lean, 17, 7, 2, L.topS);
    if (L.stripes) { p(5 + lean, 13, 7, 1, L.stripes); p(5 + lean, 15, 7, 1, L.stripes); }
    if (L.apron) p(5 + lean, 14, 2, 5, L.apron);
    if (f === 'r1') { p(8, 13, 4, 2, L.topS); p(12, 12, 2, 2, L.skin); }        // bras en arrière
    else if (f === 'r2') { p(2, 14, 5, 2, L.topS); p(1, 13, 2, 2, L.skin); }    // bras en avant
    else {
      const sw = f === 1 ? -1 : f === 2 ? 1 : 0;
      p(7 + sw, 13, 3, 4, L.topS); p(7 + sw, 17, 3, 1, L.skin);
    }
  }
}

// Cheveux courts, et variantes : 'long', 'bun' (chignon), 'cap' (casquette)
function hair(p, L, dir) {
  const H = L.hair, HL = L.hairL, st = L.style;
  if (dir === 'down') {
    p(4, 0, 8, 1, H); p(3, 1, 10, 3, H); p(3, 4, 1, 2, H); p(12, 4, 1, 2, H);
    p(5, 4, 2, 1, H); p(9, 4, 3, 1, H);
    p(5, 1, 2, 1, HL); p(9, 2, 2, 1, HL); p(7, 0, 1, 1, HL);
    if (st === 'long') { p(2, 3, 2, 10, H); p(12, 3, 2, 10, H); p(2, 5, 1, 6, HL); }
    if (st === 'bun') { p(3, 4, 1, 5, H); p(12, 4, 1, 5, H); p(6, -1, 4, 1, H); p(7, -1, 2, 1, HL); }
    if (st === 'cap') { p(4, -1, 8, 1, L.cap); p(3, 0, 10, 3, L.cap); p(2, 3, 12, 2, L.capD); p(5, 0, 3, 1, 'rgba(255,255,255,.4)'); }
  } else if (dir === 'up') {
    p(4, 0, 8, 1, H); p(3, 1, 10, 8, H); p(4, 9, 8, 1, H);
    p(5, 2, 2, 1, HL); p(9, 4, 2, 1, HL); p(6, 6, 1, 1, HL); p(10, 1, 1, 1, HL);
    p(2, 6, 1, 2, L.skin); p(13, 6, 1, 2, L.skin);
    if (st === 'long') { p(2, 3, 12, 11, H); p(4, 6, 1, 6, HL); p(9, 5, 1, 7, HL); }
    if (st === 'bun') { p(6, -1, 4, 3, H); p(7, 0, 2, 1, HL); }
    if (st === 'cap') { p(4, -1, 8, 1, L.cap); p(3, 0, 10, 4, L.cap); p(3, 4, 10, 1, L.capD); }
  } else {
    p(4, 0, 8, 1, H); p(3, 1, 10, 3, H); p(8, 4, 5, 4, H); p(10, 8, 2, 2, H);
    p(5, 1, 2, 1, HL); p(10, 3, 2, 1, HL); p(9, 6, 1, 1, HL);
    if (st === 'long') { p(9, 4, 5, 9, H); p(11, 6, 1, 6, HL); }
    if (st === 'bun') { p(12, 0, 3, 4, H); p(13, 1, 1, 1, HL); }
    if (st === 'cap') { p(4, -1, 8, 1, L.cap); p(3, 0, 10, 3, L.cap); p(0, 3, 8, 1, L.capD); p(1, 2, 3, 1, L.capD); }
  }
}

function head(p, L, dir) {
  if (dir === 'down') {
    p(4, 2, 8, 10, L.skin); p(3, 3, 10, 8, L.skin);
    p(4, 11, 8, 1, L.skinS);
    p(5, 7, 2, 2, L.eye); p(9, 7, 2, 2, L.eye); p(5, 7, 1, 1, '#fff'); p(9, 7, 1, 1, '#fff');
    if (L.beard) {
      p(3, 8, 1, 3, L.beard); p(12, 8, 1, 3, L.beard); p(4, 10, 8, 2, L.beard);
      p(6, 9, 4, 1, L.beard); p(7, 10, 2, 1, L.skinS);
    } else {
      p(7, 10, 2, 1, '#5a2a22'); p(4, 9, 1, 1, '#a8604a'); p(11, 9, 1, 1, '#a8604a');
    }
    if (L.braids) {
      p(4, 0, 8, 1, L.hair); p(3, 1, 10, 2, L.hair); p(3, 3, 3, 1, L.hair); p(10, 3, 3, 1, L.hair);
      p(8, 1, 1, 2, L.hairL);
      p(1, 3, 3, 14, L.hair); p(12, 3, 3, 14, L.hair); p(2, 2, 1, 1, L.hair); p(13, 2, 1, 1, L.hair);
      for (let y = 4; y < 17; y += 2) { p(2, y, 1, 1, L.hairL); p(13, y, 1, 1, L.hairL); p(1, y + 1, 1, 1, L.hairL); p(14, y + 1, 1, 1, L.hairL); }
    } else hair(p, L, dir);
  } else if (dir === 'up') {
    p(4, 2, 8, 10, L.skin); p(3, 3, 10, 8, L.skin);
    if (L.braids) {
      p(4, 0, 8, 1, L.hair); p(2, 1, 12, 9, L.hair); p(1, 3, 14, 14, L.hair);
      for (let x = 2; x < 14; x += 2) for (let y = 3 + (x % 4 ? 1 : 0); y < 17; y += 2) p(x, y, 1, 1, L.hairL);
    } else hair(p, L, dir);
  } else { // profil gauche
    p(4, 2, 8, 10, L.skin); p(3, 3, 9, 8, L.skin); p(2, 7, 1, 2, L.skin);
    p(4, 11, 7, 1, L.skinS);
    p(4, 7, 2, 2, L.eye); p(4, 7, 1, 1, '#fff');
    if (L.beard) { p(3, 9, 6, 2, L.beard); p(4, 11, 6, 1, L.beard); p(8, 7, 1, 2, L.beard); p(3, 10, 2, 1, L.skinS); }
    else p(4, 10, 2, 1, '#5a2a22');
    if (L.braids) {
      p(4, 0, 8, 1, L.hair); p(3, 1, 10, 2, L.hair); p(6, 3, 8, 2, L.hair);
      p(8, 3, 6, 14, L.hair); p(7, 5, 1, 9, L.hair);
      for (let x = 8; x < 14; x += 2) for (let y = 4 + (x % 4 ? 1 : 0); y < 17; y += 2) p(x, y, 1, 1, L.hairL);
      p(5, 1, 1, 2, L.hairL);
    } else { hair(p, L, dir); if (L.beard) p(8, 7, 1, 1, L.skin); }
  }
  if (L.helmet) { // casque de chantier posé par-dessus la coiffure
    const A = L.helmet, B = L.helmetD;
    if (dir === 'down') { p(4, -1, 8, 1, A); p(3, 0, 10, 3, A); p(2, 3, 12, 1, B); p(7, -1, 2, 4, B); p(4, 0, 2, 1, '#ffffff'); }
    else if (dir === 'up') { p(4, -1, 8, 1, A); p(3, 0, 10, 4, A); p(3, 4, 10, 1, B); p(7, -1, 2, 5, B); }
    else { p(4, -1, 8, 1, A); p(3, 0, 10, 3, A); p(1, 3, 12, 1, B); p(5, 0, 2, 1, '#ffffff'); }
  }
}

function build(look, dir, f) {
  const L = LOOKS[look];
  // 1 px de marge pour le contour, 2 px en haut pour les chignons et casquettes
  const cv = document.createElement('canvas'); cv.width = 18; cv.height = 27;
  const c = cv.getContext('2d');
  const flip = dir === 'right';
  const d = flip ? 'left' : dir;
  const p = (x, y, w, h, col) => { c.fillStyle = col; c.fillRect(1 + (flip ? 16 - x - w : x), 2 + y, w, h); };
  body(p, L, d, f);
  // en course de profil, la tête part un peu en avant
  const lean = (f === 'r1' || f === 'r2') && d === 'left' ? -1 : 0;
  head(lean ? (x, y, w, h, col) => p(x + lean, y, w, h, col) : p, L, d);
  // contour sombre autour de la silhouette
  const W = 18, H = 27, img = c.getImageData(0, 0, W, H), a = img.data, out = [];
  const op = (x, y) => x >= 0 && y >= 0 && x < W && y < H && a[(y * W + x) * 4 + 3] > 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++)
    if (!op(x, y) && (op(x - 1, y) || op(x + 1, y) || op(x, y - 1) || op(x, y + 1))) out.push(y * W + x);
  for (const i of out) { a[i * 4] = OUTLINE[0]; a[i * 4 + 1] = OUTLINE[1]; a[i * 4 + 2] = OUTLINE[2]; a[i * 4 + 3] = 255; }
  c.putImageData(img, 0, 0);
  return cv;
}

// Renvoie un canvas 18x27 : le personnage 16x24, 1 px de contour, et 1 px de plus en haut.
// Le pixel (1, 2) du canvas correspond au coin haut-gauche du personnage.
export function sprite(look, dir, f) {
  const k = look + dir + f;
  return cache[k] || (cache[k] = build(look, dir, f));
}
