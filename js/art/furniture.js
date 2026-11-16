// Meubles et objets de décor. Chaque fonction dessine dans le rectangle (x, y, w, h) en pixels ;
// certains objets débordent vers le haut (frigo, armoire, arbre...).
import { r } from './tiles.js';

const OL = '#3a2e3a';
const WOOD = '#c08a52', WOOD_L = '#d9a66c', WOOD_D = '#8a5a30', WOOD_DD = '#6b4423';

function box(c, x, y, w, h, top, front, fh = 5) {
  r(c, x, y, w, h, OL);
  r(c, x + 1, y + 1, w - 2, h - 2 - fh, top);
  r(c, x + 1, y + h - 1 - fh, w - 2, fh, front);
}
function disc(c, cx, cy, rad, col) {
  for (let dy = -rad; dy <= rad; dy++) {
    const w = Math.floor(Math.sqrt(rad * rad - dy * dy) + .5);
    r(c, cx - w, cy + dy, w * 2, 1, col);
  }
}
function ell(c, cx, cy, rx, ry, col) {
  for (let dy = -ry; dy <= ry; dy++) {
    const w = Math.floor(Math.sqrt(Math.max(0, 1 - (dy * dy) / (ry * ry))) * rx + .5);
    r(c, cx - w, cy + dy, w * 2, 1, col);
  }
}
export { disc };

// Lit vu de dessus, tête de lit et oreillers contre le mur du bas (dessin retourné verticalement)
function bed(c, x, y, w, h, blanket, blanketD, pillows) {
  c.save(); c.translate(0, 2 * y + h); c.scale(1, -1);
  bedUp(c, x, y, w, h, blanket, blanketD, pillows);
  c.restore();
}
function bedUp(c, x, y, w, h, blanket, blanketD, pillows) {
  r(c, x, y, w, h, OL);
  r(c, x + 1, y + 1, w - 2, 5, WOOD_D); r(c, x + 1, y + 1, w - 2, 1, WOOD);           // tête de lit
  r(c, x + 1, y + 6, w - 2, h - 11, '#f6f3ea');                                          // drap
  const pw = Math.floor((w - 4 - (pillows - 1) * 2) / pillows);
  for (let i = 0; i < pillows; i++) {
    const px = x + 2 + i * (pw + 2);
    r(c, px, y + 8, pw, 8, '#ffffff'); r(c, px, y + 15, pw, 1, '#d8d4c8'); r(c, px + pw - 1, y + 8, 1, 8, '#e6e2d6');
  }
  r(c, x + 1, y + 20, w - 2, h - 25, blanket);                                           // couette
  r(c, x + 1, y + 20, w - 2, 3, '#fbf9f2'); r(c, x + 1, y + 23, w - 2, 1, blanketD);
  for (let i = 6; i < w - 4; i += 9) r(c, x + i, y + 27, 2, h - 35, blanketD);
  r(c, x + 1, y + h - 5, w - 2, 4, blanketD); r(c, x + 1, y + h - 2, w - 2, 1, WOOD_DD);
}

// Saletés du salon, bien contrastées (contour sombre) pour qu'on les repère
function stainShape(c, x, y, v) {
  if (v === 'crumbs') {
    for (const [a, b] of [[2, 3], [7, 2], [11, 5], [4, 8], [9, 9], [1, 12], [12, 11], [6, 12]]) {
      r(c, x + a - 1, y + b - 1, 4, 4, '#4a2e18'); r(c, x + a, y + b, 2, 2, (a + b) % 2 ? '#f0d49a' : '#c8964e');
    }
  } else if (v === 'sock') {
    r(c, x + 3, y + 2, 8, 11, OL); r(c, x + 3, y + 9, 12, 6, OL);
    r(c, x + 4, y + 3, 6, 9, '#f2f2f8'); r(c, x + 4, y + 10, 10, 4, '#f2f2f8');
    r(c, x + 4, y + 4, 6, 1, '#d05a70'); r(c, x + 4, y + 6, 6, 1, '#d05a70'); r(c, x + 12, y + 10, 2, 4, '#c4c4d0');
  } else if (v === 'pizza') {
    r(c, x, y + 1, 16, 14, OL); r(c, x + 1, y + 2, 14, 12, '#d8c8a8'); r(c, x + 1, y + 2, 14, 1, '#ece0c4');
    r(c, x + 3, y + 4, 9, 8, '#e8a040'); r(c, x + 4, y + 5, 2, 2, '#c83a30'); r(c, x + 8, y + 8, 2, 2, '#c83a30'); r(c, x + 9, y + 5, 2, 2, '#c83a30');
  } else {
    r(c, x + 1, y + 4, 14, 9, '#3a2414'); r(c, x + 3, y + 2, 9, 13, '#3a2414'); r(c, x + 12, y + 1, 3, 3, '#3a2414');
    r(c, x + 2, y + 5, 12, 7, '#6b4526'); r(c, x + 4, y + 3, 7, 11, '#6b4526'); r(c, x + 13, y + 2, 1, 1, '#6b4526');
    r(c, x + 5, y + 5, 3, 1, '#9a6c44'); r(c, x + 4, y + 6, 1, 1, '#9a6c44');
  }
}

export const FURN = {
  shower(c, x, y, w, h) {
    r(c, x, y, w, h, OL);
    r(c, x + 1, y + 1, w - 2, h - 2, '#dfeaf0'); r(c, x + 3, y + 3, w - 6, h - 7, '#c3dbe8');
    r(c, x + w / 2 - 1, y + h / 2, 3, 3, '#7f98a6'); r(c, x + w / 2, y + h / 2 + 1, 1, 1, '#3d4a54');
    r(c, x + 1, y + h - 4, w - 2, 3, '#f4fafc'); r(c, x + 1, y + h - 4, w - 2, 1, '#9fc0d0');
    r(c, x + 4, y + 2, 2, 8, '#9aa8b2'); r(c, x + 3, y + 9, 5, 2, '#7f8d98');                 // colonne + pommeau
    for (let i = 0; i < 3; i++) r(c, x + w - 9 + i * 3, y + 5 + i * 3, 2, 2, '#f4fbff');     // reflets
  },
  sink(c, x, y, w, h, t, o) {
    box(c, x, y, w, h, '#f4f8fa', '#cfd9de', 4);
    if (o.v === 'side') { // lavabo contre le mur de droite, vu de dessus
      r(c, x + 2, y + 3, w - 7, 7, '#b7cfdb'); r(c, x + 3, y + 4, w - 9, 5, '#d6e8f0'); r(c, x + 6, y + 6, 1, 1, '#6a747a');
      r(c, x + w - 5, y + 5, 3, 3, '#8a98a2'); r(c, x + w - 7, y + 6, 3, 1, '#aab6bc');
      r(c, x + w - 4, y + 2, 2, 2, '#e86a6a'); r(c, x + w - 4, y + 9, 2, 2, '#6a9ae8');
      return;
    }
    r(c, x + 3, y + 4, w - 6, 6, '#b7cfdb'); r(c, x + 4, y + 5, w - 8, 4, '#d6e8f0');
    r(c, x + w / 2 - 1, y + 2, 2, 3, '#8a98a2');
    r(c, x + 2, y - 9, w - 4, 8, OL); r(c, x + 3, y - 8, w - 6, 6, '#bfe3f2'); r(c, x + 4, y - 7, 2, 2, '#f2fbff'); // miroir
  },
  washer(c, x, y, w, h, t, o) {
    const j = o.shake ? Math.round(Math.sin(t * 40)) : 0;
    x += j;
    r(c, x, y, w, h, OL);
    r(c, x + 1, y + 1, w - 2, 10, '#dfe4e6'); r(c, x + 2, y + 2, 5, 2, '#9aa4aa'); r(c, x + 11, y + 2, 2, 2, '#c05050');
    r(c, x + 1, y + 11, w - 2, h - 12, '#f1f3f4'); r(c, x + 1, y + 11, w - 2, 1, '#b4bcc0');
    disc(c, x + 8, y + 20, 5, '#5b6670'); disc(c, x + 8, y + 20, 3, '#8fc0d8');
    if (o.spin) { const k = Math.floor(t * 8) % 4, P = [[-2, -1], [1, -2], [1, 1], [-2, 1]][k]; r(c, x + 8 + P[0], y + 20 + P[1], 2, 2, '#f4fbff'); r(c, x + 8 - P[0] - 1, y + 20 - P[1] - 1, 1, 1, '#d05a70'); }
    else r(c, x + 6, y + 18, 2, 1, '#e6f6ff');
    r(c, x + 2, y + 27, 3, 2, '#b5713c'); r(c, x + 11, y + 13, 2, 1, '#b5713c'); r(c, x + 12, y + 26, 2, 3, '#c98a52'); // rouille
    r(c, x + 1, y + h - 3, w - 2, 2, '#aab2b6');
  },
  fridge(c, x, y, w, h) {
    const t = y - 12, hh = h + 12;
    r(c, x, t, w, hh, OL);
    r(c, x + 1, t + 1, w - 2, 5, '#cdd6da'); r(c, x + 1, t + 6, w - 2, hh - 7, '#eef3f5');
    r(c, x + 1, t + 14, w - 2, 1, '#aab6bc'); r(c, x + 12, t + 8, 2, 4, '#8a969c'); r(c, x + 12, t + 17, 2, 6, '#8a969c');
    r(c, x + 3, t + 17, 3, 3, '#e86a6a'); r(c, x + 7, t + 19, 2, 2, '#f0c040');                // aimants
    r(c, x + 1, t + hh - 3, w - 2, 2, '#b9c3c8');
  },
  counter(c, x, y, w, h) {
    r(c, x, y, w, h, OL);
    r(c, x + 1, y + 1, w - 2, h - 7, '#e6dfd0'); r(c, x + w - 3, y + 1, 2, h - 7, '#c9c0ad');
    r(c, x + 1, y + h - 6, w - 2, 5, '#a98a62'); r(c, x + 1, y + h - 6, w - 2, 1, '#c9a67a'); r(c, x + 7, y + h - 4, 2, 1, WOOD_DD);
    // plaques
    r(c, x + 2, y + 3, 11, 14, '#33333d');
    for (const [a, b] of [[4, 5], [9, 5], [4, 11], [9, 11]]) { r(c, x + a, y + b, 3, 3, '#5a5a66'); r(c, x + a + 1, y + b + 1, 1, 1, '#c05040'); }
    // casserole
    disc(c, x + 7, y + 24, 4, '#7a8088'); disc(c, x + 7, y + 24, 3, '#d98a3a'); r(c, x + 11, y + 23, 3, 2, '#3a3a44');
    // évier
    r(c, x + 2, y + 34, 11, 12, '#9fa9b0'); r(c, x + 3, y + 35, 9, 10, '#c9d3d8'); r(c, x + 7, y + 39, 2, 2, '#6a747a');
    r(c, x + 12, y + 37, 2, 5, '#7c8890');
    // planche à découper
    r(c, x + 3, y + 50, 9, 6, WOOD_L); r(c, x + 5, y + 52, 3, 2, '#e8603c');
  },
  cabinet(c, x, y, w, h) {
    box(c, x, y, w, h, WOOD, WOOD_D, 6);
    r(c, x + 1, y + 1, w - 2, 1, WOOD_L);
    disc(c, x + 5, y + 7, 3, '#f6f6f2'); disc(c, x + 5, y + 7, 1, '#dcdcd4');
    disc(c, x + 10, y + 14, 3, '#f6f6f2'); disc(c, x + 10, y + 14, 1, '#dcdcd4');
    r(c, x + 9, y + 4, 4, 5, '#c84a3a'); r(c, x + 9, y + 4, 4, 1, '#f0e0c0');                  // bocal
    r(c, x + 3, y + 17, 4, 5, '#e8c060'); r(c, x + 3, y + 17, 4, 1, '#6b4423');                // pâtes
    r(c, x + 7, y + h - 5, 2, 2, WOOD_DD);
  },
  table(c, x, y, w, h) {
    r(c, x + 2, y + h - 4, 3, 4, WOOD_DD); r(c, x + w - 5, y + h - 4, 3, 4, WOOD_DD);
    box(c, x, y, w, h - 3, WOOD, WOOD_D, 4);
    r(c, x + 1, y + 1, w - 2, 1, WOOD_L);
    for (let i = 5; i < w - 4; i += 11) r(c, x + i, y + 6, 6, 1, WOOD_L);
    // petite plante en pot
    const px = x + w / 2 - 4, py = y + 9;
    r(c, px, py, 8, 7, OL); r(c, px + 1, py + 1, 6, 5, '#c8703a'); r(c, px + 1, py + 1, 6, 1, '#e08a50');
    r(c, px - 2, py - 7, 12, 8, OL);
    r(c, px - 1, py - 6, 10, 6, '#4f9a48'); r(c, px, py - 6, 4, 3, '#78c060'); r(c, px + 5, py - 4, 3, 2, '#78c060');
    r(c, px + 2, py - 2, 2, 2, '#356e34'); r(c, px + 6, py - 6, 2, 1, '#a0e080');
  },
  chair(c, x, y, w, h, t, o) {
    const up = o.v === 'up';
    r(c, x + 3, y + 3, 10, 12, OL);
    r(c, x + 4, y + 4, 8, 7, WOOD); r(c, x + 4, y + 11, 8, 3, WOOD_D);
    if (o.v === 'left') { r(c, x + 1, y + 1, 5, 14, OL); r(c, x + 2, y + 2, 3, 9, WOOD_D); r(c, x + 2, y + 2, 1, 9, WOOD); r(c, x + 2, y + 11, 3, 3, WOOD_DD); }
    else if (up) { r(c, x + 3, y - 1, 10, 5, OL); r(c, x + 4, y, 8, 3, WOOD_D); }
    else { r(c, x + 3, y + 9, 10, 6, OL); r(c, x + 4, y + 10, 8, 4, WOOD_D); r(c, x + 4, y + 10, 8, 1, WOOD); }
  },
  sofa(c, x, y, w, h) { // canapé vertical, dossier contre le mur de droite
    const A = '#4f8f90', B = '#3d7475', D = '#2f5c5d', L = '#6fb0b0';
    r(c, x, y, w, h, OL);
    r(c, x + 1, y + 1, w - 2, h - 2, A);
    r(c, x + w - 9, y + 1, 8, h - 2, B); r(c, x + w - 9, y + 1, 1, h - 2, D);                 // dossier
    r(c, x + 1, y + 1, w - 2, 6, B); r(c, x + 1, y + 6, w - 10, 1, D);                        // accoudoirs
    r(c, x + 1, y + h - 8, w - 2, 7, B); r(c, x + 1, y + h - 8, w - 10, 1, L); r(c, x + 1, y + h - 3, w - 2, 2, D);
    r(c, x + 2, y + Math.floor(h / 2), w - 12, 1, D); r(c, x + 2, y + 8, w - 12, 1, L);
    r(c, x + 5, y + 10, 8, 7, '#f0c060'); r(c, x + 5, y + 16, 8, 1, '#c89838'); r(c, x + 12, y + 10, 1, 7, '#d8a848'); // coussin
  },
  desk(c, x, y, w, h, t, o) {
    box(c, x, y, w, h, WOOD, WOOD_D, 5);
    r(c, x + 1, y + 1, w - 2, 1, WOOD_L); r(c, x + 5, y + h - 4, 3, 1, WOOD_DD); r(c, x + w - 8, y + h - 4, 3, 1, WOOD_DD);
    if (o.v === 'phys') {
      r(c, x + 4, y + 2, 9, 7, '#3a5a9a'); r(c, x + 5, y + 3, 7, 5, '#f4f4ee'); r(c, x + 6, y + 4, 4, 1, '#8a8a9a'); r(c, x + 6, y + 6, 5, 1, '#8a8a9a');
      r(c, x + 16, y + 3, 6, 1, '#e8c040'); r(c, x + 22, y + 3, 1, 1, '#d06060');
      r(c, x + 24, y + 2, 5, 5, '#f6f6f2'); r(c, x + 25, y + 3, 3, 3, '#6b4423');              // chocolat chaud
    } else if (o.v === 'elec') {
      r(c, x + 4, y + 2, 9, 7, '#e8b830'); r(c, x + 5, y + 3, 7, 5, '#f4f4ee');
      r(c, x + 8, y + 3, 2, 2, '#e8603c'); r(c, x + 7, y + 5, 2, 1, '#e8603c'); r(c, x + 8, y + 6, 1, 2, '#e8603c'); // éclair
      r(c, x + 16, y + 2, 7, 6, '#4a5a6a'); r(c, x + 17, y + 3, 5, 2, '#b8e0a0'); r(c, x + 18, y + 6, 1, 1, '#e86a6a'); r(c, x + 20, y + 6, 1, 1, '#f0f0f0'); // multimètre
      r(c, x + 25, y - 4, 2, 9, '#5a5a66'); r(c, x + 22, y - 6, 7, 3, '#f0c060'); r(c, x + 23, y + 5, 6, 2, '#5a5a66'); // lampe
    }
  },
  deskV(c, x, y, w, h, t, o) {
    box(c, x, y, w, h, WOOD, WOOD_D, 5);
    r(c, x + 1, y + 1, 1, h - 7, WOOD_L);
    r(c, x + w - 3, y + 1, 2, h - 7, '#b07a45');
    if (o.v === 'elec') {
      r(c, x + 2, y + 3, 6, 4, '#5a5a66'); r(c, x + 3, y + 1, 4, 3, '#f0c060');                 // lampe
      r(c, x + 4, y + 9, 8, 9, '#e8b830'); r(c, x + 5, y + 10, 6, 7, '#f4f4ee');                // cahier d'élec
      r(c, x + 8, y + 11, 2, 2, '#e8603c'); r(c, x + 7, y + 13, 2, 1, '#e8603c'); r(c, x + 8, y + 14, 1, 2, '#e8603c');
      r(c, x + 3, y + 20, 7, 5, '#4a5a6a'); r(c, x + 4, y + 21, 5, 2, '#b8e0a0'); r(c, x + 5, y + 24, 1, 1, '#e86a6a'); // multimètre
    }
  },
  wardrobe(c, x, y, w, h) {
    const t = y - 8, hh = h + 8;
    r(c, x, t, w, hh, OL);
    r(c, x + 1, t + 1, w - 2, 7, '#a06a3a'); r(c, x + 1, t + 1, w - 2, 1, WOOD_L);
    r(c, x + 1, t + 8, w - 2, hh - 9, WOOD); r(c, x + 1, t + 8, w - 2, 1, WOOD_DD);
    const m = x + w / 2;
    r(c, m - 1, t + 9, 1, hh - 13, WOOD_DD); r(c, m, t + 9, 1, hh - 13, WOOD_L);
    r(c, x + 3, t + 11, w / 2 - 6, hh - 18, '#b07a45'); r(c, m + 3, t + 11, w / 2 - 6, hh - 18, '#b07a45');
    r(c, m - 4, t + 22, 2, 3, '#f0d080'); r(c, m + 2, t + 22, 2, 3, '#f0d080');
    r(c, x + 1, t + hh - 4, w - 2, 3, WOOD_D);
  },
  bedBig(c, x, y, w, h, t, o) { bed(c, x, y, w, h, o.col || '#c05a70', o.colD || '#983f56', 2); },
  bedTwin(c, x, y, w, h) {
    const w1 = Math.floor(w / 2);
    bed(c, x, y, w1 + 1, h, '#4a78b8', '#365a90', 1);
    bed(c, x + w1, y, w - w1, h, '#4a78b8', '#365a90', 1);
  },
  // Escalier droit en bois, vu de dessus, façon maisons des jeux sur DS.
  // Au salon il monte vers le haut de l'écran et disparaît dans le noir ; à l'étage (o.v = 'down') il descend vers nous.
  stairs(c, x, y, w, h, t, o) {
    const up = o.v !== 'down', DARK = '#1a1418';
    const mixc = (a, b, k) => { const A = [1, 3, 5].map(i => parseInt(a.slice(i, i + 2), 16)), B = [1, 3, 5].map(i => parseInt(b.slice(i, i + 2), 16)); return 'rgb(' + A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(',') + ')'; };
    r(c, x, y, w, h, OL);
    r(c, x + 1, y, 3, h, WOOD_D); r(c, x + w - 4, y, 3, h, WOOD_D); r(c, x + 1, y, 1, h, '#b07a45'); r(c, x + w - 4, y, 1, h, '#b07a45');
    const n = Math.floor(h / 5);
    for (let k = 0; k < n; k++) {
      const sy = up ? y + h - (k + 1) * 5 : y + k * 5, dark = Math.max(0, (k - n + 4) / 4);
      r(c, x + 4, sy, w - 8, 4, mixc('#e2b47c', DARK, dark)); r(c, x + 4, sy, w - 8, 1, mixc('#f0c890', DARK, dark));
      r(c, x + 4, sy + 4, w - 8, 1, mixc('#7a522b', DARK, dark));
    }
    if (up) { r(c, x + 1, y, w - 2, 4, DARK); r(c, x + 1, y + 4, w - 2, 1, '#3a2a22'); }
    else { r(c, x + 1, y + h - 4, w - 2, 4, DARK); r(c, x + 1, y + h - 5, w - 2, 1, '#3a2a22'); }
  },
  broom(c, x, y) { // balai rangé, appuyé contre le côté de l'escalier
    for (let i = 0; i <= 20; i++) { // manche en diagonale
      const px = Math.round(x + 14 - i * .35), py = y - 10 + i;
      r(c, px - 1, py, 4, 1, OL); r(c, px, py, 2, 1, '#c8955a'); r(c, px, py, 1, 1, '#e0b07a');
    }
    r(c, x + 5, y + 9, 7, 3, OL); r(c, x + 6, y + 10, 5, 1, '#c84a3a');                     // ligature rouge
    r(c, x + 3, y + 11, 11, 5, OL); r(c, x + 4, y + 12, 9, 3, '#d8b048');                 // paille
    for (let i = 4; i < 13; i += 2) r(c, x + i, y + 12, 1, 3, '#a8822e');
    r(c, x + 3, y + 15, 11, 1, 'rgba(30,20,40,.25)');
  },
  window(c, x, y, w, h) {
    r(c, x + 1, y - 6, 14, 15, OL);
    r(c, x + 2, y - 5, 12, 13, '#fbfbf6');
    r(c, x + 3, y - 4, 4, 11, '#9fd4f0'); r(c, x + 9, y - 4, 4, 11, '#9fd4f0');
    r(c, x + 3, y + 1, 4, 6, '#bfe4f6'); r(c, x + 9, y + 1, 4, 6, '#bfe4f6');
    r(c, x + 4, y - 3, 1, 3, '#ffffff'); r(c, x + 10, y - 3, 1, 3, '#ffffff');
    r(c, x + 1, y + 8, 14, 2, '#d8d2c0');
  },
  rug(c, x, y, w, h, t, o) {
    const A = o.col || '#b8506a', B = o.colD || '#8f3a52';
    r(c, x + 1, y + 2, w - 2, h - 4, B); r(c, x + 3, y + 4, w - 6, h - 8, A);
    r(c, x + 5, y + 6, w - 10, h - 12, '#f0d8a0'); r(c, x + 6, y + 7, w - 12, h - 14, A);
    for (let i = 2; i < w - 2; i += 3) { r(c, x + i, y + 1, 1, 1, B); r(c, x + i, y + h - 2, 1, 1, B); }
  },
  mat(c, x, y, w, h) {
    r(c, x + 1, y + 5, 14, 9, '#7a5a3a'); r(c, x + 2, y + 6, 12, 7, '#b08a5a');
    for (let i = 3; i < 13; i += 2) r(c, x + i, y + 8, 1, 3, '#8f6a42');
  },
  plant(c, x, y, w, h, t) {
    const s = Math.round(Math.sin(t * 1.3 + x) * .6);
    r(c, x + 4, y + 7, 8, 8, OL); r(c, x + 5, y + 8, 6, 6, '#c8703a'); r(c, x + 5, y + 8, 6, 2, '#e08a50');
    r(c, x + 7, y - 2, 2, 10, '#3f7a3a');
    const G = '#4f9a48', GL = '#78c060', GD = '#356e34';
    r(c, x + 2 + s, y - 8, 5, 6, G); r(c, x + 9 + s, y - 10, 5, 7, G); r(c, x + 5 + s, y - 13, 6, 6, GL);
    r(c, x + 1 + s, y - 2, 5, 4, GD); r(c, x + 10 + s, y - 3, 5, 4, GD); r(c, x + 6 + s, y - 12, 2, 2, '#a0e080');
  },
  // ---------- Objets d'histoire ----------
  boxes(c, x, y, w, h, t, o) { // pile de cartons (o.v = nombre)
    const n = o.v || 1;
    for (let i = 0; i < n; i++) {
      const bx = x + 1 + (i % 2), by = y + 4 - i * 9;
      r(c, bx, by, 14, 11, OL); r(c, bx + 1, by + 1, 12, 9, '#c89a5e'); r(c, bx + 1, by + 1, 12, 2, '#dcb27a');
      r(c, bx + 6, by + 1, 2, 9, '#ecdcae'); r(c, bx + 1, by + 8, 12, 2, '#a67c45'); r(c, bx + 9, by + 4, 3, 2, '#f4f0e0');
    }
  },
  stain(c, x, y, w, h, t, o) {
    // plus on frotte, plus la saleté s'efface
    const hits = o.ref ? o.ref.hits : 0;
    c.globalAlpha = 1 - hits * .28;
    stainShape(c, x, y, o.v);
    c.globalAlpha = 1;
    // repère clignotant pour bien voir les saletés
    const ph = (t * 1.6 + x * .013) % 2;
    if (ph < .35) { r(c, x + 12, y - 1, 1, 5, '#fff8b0'); r(c, x + 10, y + 1, 5, 1, '#fff8b0'); r(c, x + 12, y + 1, 1, 1, '#ffffff'); }
    if (o.v === 'stain' || o.v === 'pizza') { // une mouche tourne au-dessus
      const a = t * 5 + x, fx = Math.round(x + 8 + Math.cos(a) * 6), fy = Math.round(y + 3 + Math.sin(a) * 3);
      r(c, fx, fy, 2, 2, '#1a1418'); r(c, fx - 1 + (Math.floor(t * 20) % 2), fy - 1, 1, 1, '#e8f4ff'); r(c, fx + 2, fy - 1, 1, 1, '#e8f4ff');
    }
  },
  panel(c, x, y, w, h, t, o) { // tableau electrique accroche au mur
    if (o.v === 'side') { // fixé au mur de droite, vu de dessus : un coffret qui dépasse du mur vers la gauche
      r(c, x - 3, y, 9, 15, OL); r(c, x - 2, y + 1, 7, 13, '#d4d8dc'); r(c, x - 2, y + 1, 1, 13, '#f0f2f4');
      for (let i = 0; i < 4; i++) { r(c, x, y + 2 + i * 2, 4, 1, '#8a9098'); r(c, x, y + 2 + i * 2, 1, 1, i ? '#50b860' : '#d04848'); }
      r(c, x - 1, y + 11, 4, 2, '#f0c830');
      return;
    }
    r(c, x + 1, y - 3, 14, 15, OL); r(c, x + 2, y - 2, 12, 13, '#d4d8dc'); r(c, x + 2, y - 2, 12, 1, '#f0f2f4');
    r(c, x + 3, y, 10, 5, '#8a9098');
    for (let i = 0; i < 4; i++) { r(c, x + 4 + i * 2, y + 1, 1, 3, '#f4f4f0'); r(c, x + 4 + i * 2, y + 1, 1, 1, i ? '#50b860' : '#d04848'); }
    r(c, x + 6, y + 6, 4, 4, '#f0c830'); r(c, x + 7, y + 7, 2, 1, '#2a202c'); r(c, x + 8, y + 8, 1, 1, '#2a202c');
  },
  marker(c, x, y, w, h, t) { // "pose ton carton ici"
    const b = Math.floor(t * 4) % 2;
    r(c, x + 2, y + 10, 12, 4, 'rgba(255,240,150,.5)'); r(c, x + 4, y + 9, 8, 6, 'rgba(255,240,150,.5)');
    r(c, x + 6, y - 6 + b, 4, 6, '#f0c830'); for (let i = 0; i < 4; i++) r(c, x + 4 + i, y + i + b, 8 - i * 2, 1, '#f0c830');
    r(c, x + 6, y - 6 + b, 1, 6, '#fff0a0');
  },
  // ---------- Extérieur ----------
  tree(c, x, y, w, h, t) { // arbre touffu a trois etages de feuillage
    const s1 = Math.round(Math.sin(t * 1.4 + x * .2) * .8), s2 = Math.round(Math.sin(t * 1.4 + x * .2 - .5) * 1.2);
    const TO = '#1c4638', GD = '#2c7450', G = '#46a05c', GL = '#7cc96e', GH = '#b4e890';
    r(c, x + 5, y + 27, 22, 4, 'rgba(20,50,30,.35)'); r(c, x + 8, y + 30, 16, 2, 'rgba(20,50,30,.35)');
    r(c, x + 12, y + 20, 8, 10, OL); r(c, x + 13, y + 20, 6, 9, '#7a5236'); r(c, x + 13, y + 20, 2, 9, '#9a6c4a');
    const tier = (cx, cy, rx, ry) => {
      ell(c, cx, cy, rx + 1, ry + 1, TO); ell(c, cx, cy, rx, ry, GD);
      ell(c, cx, cy - 2, rx - 1, ry - 2, G);
      ell(c, cx - Math.round(rx * .3), cy - Math.round(ry * .4), Math.round(rx * .5), Math.round(ry * .42), GL);
      r(c, cx - Math.round(rx * .45), cy - Math.round(ry * .6), 3, 1, GH); r(c, cx - Math.round(rx * .55), cy - Math.round(ry * .45), 1, 2, GH);
      // feuillage dentele en bas
      for (let i = -rx + 3; i < rx - 2; i += 5) { const yy = cy + Math.round(Math.sqrt(Math.max(0, 1 - (i * i) / (rx * rx))) * ry) - 1; r(c, cx + i, yy, 3, 2, TO); r(c, cx + i, yy - 2, 3, 2, GD); }
      r(c, cx + Math.round(rx * .35), cy + 1, 2, 1, GD); r(c, cx + Math.round(rx * .1), cy + Math.round(ry * .3), 2, 1, TO); r(c, cx - Math.round(rx * .5), cy + Math.round(ry * .35), 2, 1, TO);
    };
    tier(x + 16, y + 13, 15, 10);
    tier(x + 16 + s1, y + 1, 12, 9);
    tier(x + 16 + s2, y - 10, 8, 7);
  },
  bush(c, x, y, w, h, t, o) { // hortensia breton
    const F = o.v === 'pink' ? ['#e890b8', '#f8c0d8'] : ['#6a8ae0', '#a8c0f8'];
    disc(c, x + 8, y + 9, 8, OL); disc(c, x + 8, y + 9, 7, '#3f8f45'); disc(c, x + 6, y + 7, 4, '#58a850');
    const tw = Math.floor(t * 2 + x) % 4;
    [[4, 5], [10, 4], [7, 9], [12, 9], [3, 11]].forEach(([a, b], i) => {
      r(c, x + a, y + b, 3, 3, F[0]); r(c, x + a + 1, y + b, 1, 1, i === tw ? '#ffffff' : F[1]);
    });
  },
  lamp(c, x, y) {
    r(c, x + 6, y - 22, 4, 36, OL); r(c, x + 7, y - 21, 2, 34, '#4a5560'); r(c, x + 7, y - 21, 1, 34, '#6c7884');
    r(c, x + 3, y - 28, 10, 8, OL); r(c, x + 4, y - 27, 8, 6, '#f8e8a0'); r(c, x + 4, y - 27, 8, 1, '#4a5560');
    r(c, x + 4, y + 12, 8, 3, OL); r(c, x + 5, y + 12, 6, 2, '#4a5560');
  },
  bench(c, x, y, w, h) {
    r(c, x + 1, y + 2, w - 2, 12, OL);
    r(c, x + 2, y + 3, w - 4, 3, '#8a5a30'); r(c, x + 2, y + 7, w - 4, 3, '#a87040'); r(c, x + 2, y + 7, w - 4, 1, '#c89058');
    r(c, x + 3, y + 10, 2, 3, '#4a4a54'); r(c, x + w - 5, y + 10, 2, 3, '#4a4a54');
  },
  extdoor(c, x, y, w, h, t, o) {
    const A = o.col || '#2f6f9f', B = o.colD || '#255a84', L = o.colL || '#4a90c0';
    r(c, x, y, w, h, OL);
    r(c, x + 1, y + 1, w - 2, h - 2, '#f4efe2');
    r(c, x + 3, y + 3, w - 6, h - 4, A); r(c, x + 3, y + 3, 1, h - 4, L);
    r(c, x + 5, y + 6, 6, 8, B); r(c, x + 5, y + 17, 6, 9, B);
    r(c, x + 5, y + 6, 6, 4, '#bfe4f6');
    r(c, x + 10, y + 16, 2, 2, '#f0d080');
    r(c, x + 1, y + h - 3, w - 2, 3, '#a9a4aa');
  },
  fwin(c, x, y, w, h) { // fenêtre de façade à volets bleus
    r(c, x - 3, y + 1, 22, 14, OL);
    r(c, x - 2, y + 2, 4, 12, '#2f6f9f'); r(c, x + 14, y + 2, 4, 12, '#2f6f9f');
    r(c, x - 2, y + 5, 4, 1, '#255a84'); r(c, x + 14, y + 5, 4, 1, '#255a84'); r(c, x - 2, y + 10, 4, 1, '#255a84'); r(c, x + 14, y + 10, 4, 1, '#255a84');
    r(c, x + 3, y + 2, 10, 12, '#fbfbf6'); r(c, x + 4, y + 3, 3, 10, '#8fc4e0'); r(c, x + 9, y + 3, 3, 10, '#8fc4e0');
    r(c, x + 4, y + 3, 3, 4, '#f6e8b0'); r(c, x + 9, y + 3, 3, 4, '#f6e8b0');
    r(c, x + 1, y + 14, 14, 2, '#c8bca0');
  },
};

// Objets animés (redessinés à chaque image). Les autres sont mis en cache.
const ANIMATED = new Set(['plant', 'tree', 'bush', 'washer', 'marker', 'boxes', 'stain']);
const PAD = 32;
const cache = new Map();

export function drawObject(c, o, x, y, t) {
  const w = o.w * 16, h = o.h * 16, fn = FURN[o.t];
  if (!fn) return;
  if (ANIMATED.has(o.t)) { fn(c, x, y, w, h, t, o); return; }
  const key = [o.t, w, h, o.v, o.col].join('|');
  let cv = cache.get(key);
  if (!cv) {
    cv = document.createElement('canvas'); cv.width = w + PAD * 2; cv.height = h + PAD * 2;
    fn(cv.getContext('2d'), PAD, PAD, w, h, 0, o);
    cache.set(key, cv);
  }
  c.drawImage(cv, x - PAD, y - PAD);
}

// Permet aux autres fichiers (marché, cuisine...) d'ajouter leurs propres objets
export function addFurniture(defs, animated = []) {
  Object.assign(FURN, defs);
  for (const k of animated) ANIMATED.add(k);
}
export { OL, box, ell };
