// Objets du marché de Lannion, de l'épicerie et du dîner (chapitres 3 et 4).
import { r } from './tiles.js';
import { addFurniture, disc, OL, box, ell } from './furniture.js';
import { text } from './text.js';

const WOOD = '#c08a52', WOOD_L = '#d9a66c', WOOD_D = '#8a5a30';

// Giraumon : courge antillaise à peau verte marbrée
function giraumon(c, cx, cy, rad = 4) {
  disc(c, cx, cy, rad + 1, OL); disc(c, cx, cy, rad, '#3f7a3a');
  r(c, cx - 1, cy - rad, 2, rad * 2, '#6aa850'); r(c, cx - rad + 1, cy - 1, 2, 3, '#6aa850'); r(c, cx + rad - 3, cy - 2, 2, 3, '#8fc468');
  r(c, cx - 1, cy - rad - 1, 2, 2, '#7a5a30');
}

const STALL = {
  leg: ['#4f9a48', '#f4f4ee'], viande: ['#c8443a', '#f4f4ee'], poisson: ['#3a78c8', '#f4f4ee'], crepes: ['#e8a838', '#f4f4ee'],
};

addFurniture({
  // Étal de marché : auvent rayé au-dessus d'une table garnie
  stall(c, x, y, w, h, t, o) {
    const A = STALL[o.v] || STALL.leg;
    r(c, x + 1, y + 10, 3, h - 10, OL); r(c, x + w - 4, y + 10, 3, h - 10, OL);
    r(c, x + 2, y + 10, 1, h - 11, '#b8bcc4'); r(c, x + w - 3, y + 10, 1, h - 11, '#b8bcc4');
    // table
    r(c, x + 3, y + 13, w - 6, h - 13, OL);
    r(c, x + 4, y + 14, w - 8, h - 21, '#e2c79c'); r(c, x + 4, y + 14, w - 8, 1, '#f0dcb8');
    r(c, x + 4, y + h - 7, w - 8, 6, A[0]); r(c, x + 4, y + h - 7, w - 8, 1, 'rgba(255,255,255,.35)');
    for (let i = 8; i < w - 8; i += 8) r(c, x + i, y + h - 6, 1, 5, 'rgba(0,0,0,.18)');
    const gy = y + 15;
    if (o.v === 'viande') {
      r(c, x + 6, gy, 12, 8, '#f6f6f2'); r(c, x + 8, gy + 2, 8, 4, '#c8443a'); r(c, x + 9, gy + 3, 3, 1, '#f0b0a8');
      r(c, x + 21, gy, 10, 8, '#f6f6f2'); r(c, x + 22, gy + 1, 8, 6, '#a83a34'); r(c, x + 24, gy + 3, 2, 2, '#f4e8e0');
      r(c, x + 34, gy + 1, 8, 3, '#8a3a30'); r(c, x + 34, gy + 5, 8, 3, '#8a3a30'); r(c, x + 34, gy + 1, 1, 7, '#e8d8c0');
    } else if (o.v === 'poisson') {
      r(c, x + 5, gy, w - 10, 9, '#dff0f8'); r(c, x + 7, gy + 1, 2, 1, '#ffffff'); r(c, x + 30, gy + 6, 2, 1, '#ffffff');
      for (const [fx, fy] of [[7, 1], [20, 0], [31, 2], [12, 5], [25, 5]]) {
        ell(c, x + fx + 5, gy + fy + 2, 5, 2, '#6a8aa8'); r(c, x + fx + 9, gy + fy, 2, 4, '#6a8aa8'); r(c, x + fx + 2, gy + fy + 1, 4, 1, '#b8d0e0'); r(c, x + fx + 1, gy + fy + 1, 1, 1, '#1a1418');
      }
    } else if (o.v === 'crepes') {
      disc(c, x + 12, gy + 4, 5, '#2a2a30'); disc(c, x + 12, gy + 4, 4, '#f0d8a0'); r(c, x + 10, gy + 2, 3, 1, '#d8a850'); r(c, x + 13, gy + 5, 2, 1, '#d8a850');
      for (let i = 0; i < 4; i++) { r(c, x + 21, gy + 6 - i * 2, 10, 2, i % 2 ? '#e8c888' : '#f0d8a0'); }
      r(c, x + 21, gy + 7, 10, 1, OL);
      r(c, x + 35, gy - 2, 4, 10, '#3f7a3a'); r(c, x + 36, gy - 4, 2, 3, '#3f7a3a'); r(c, x + 35, gy + 2, 4, 3, '#f0e0a0'); // bouteille de cidre
    } else {
      disc(c, x + 9, gy + 4, 3, '#4f9a48'); r(c, x + 8, gy + 3, 2, 1, '#8fd070'); disc(c, x + 16, gy + 5, 3, '#63b85a'); r(c, x + 15, gy + 4, 2, 1, '#a0e080');
      for (let i = 0; i < 4; i++) { r(c, x + 21 + i * 2, gy + 1, 2, 6, '#e8843a'); r(c, x + 21 + i * 2, gy, 2, 1, '#4f9a48'); }
      // la fameuse citrouille d'Halloween, sourire déjà sculpté
      disc(c, x + 37, gy + 4, 5, OL); disc(c, x + 37, gy + 4, 4, '#f08a2a'); r(c, x + 36, gy - 2, 2, 2, '#4f7a3a');
      r(c, x + 34, gy + 2, 2, 2, '#3a2010'); r(c, x + 38, gy + 2, 2, 2, '#3a2010'); r(c, x + 34, gy + 5, 6, 1, '#3a2010'); r(c, x + 35, gy + 6, 4, 1, '#3a2010');
    }
    // auvent rayé et festonné
    r(c, x, y, w, 12, OL);
    for (let i = 0; i < w - 2; i += 6) {
      const col = A[(i / 6) % 2], ww = Math.min(6, w - 2 - i);
      r(c, x + 1 + i, y + 1, ww, 10, col); r(c, x + 1 + i, y + 11, ww, 3, OL); r(c, x + 2 + i, y + 11, ww - 2, 2, col);
    }
    r(c, x + 1, y + 1, w - 2, 1, 'rgba(255,255,255,.4)'); r(c, x + 1, y + 9, w - 2, 2, 'rgba(0,0,0,.12)');
  },
  // Fontaine de la place : bassin rond, colonne centrale, jets d'eau animés
  fountain(c, x, y, w, h, t) {
    const cx = x + w / 2, cy = y + h / 2 + 3;
    ell(c, cx, cy + 3, 23, 20, 'rgba(40,40,60,.25)');
    ell(c, cx, cy, 23, 20, OL); ell(c, cx, cy, 22, 19, '#9a958c'); ell(c, cx, cy - 1, 22, 18, '#c8c3b8');
    ell(c, cx, cy, 18, 15, '#7a756c'); ell(c, cx, cy, 17, 14, '#3f8cc8'); ell(c, cx, cy - 1, 16, 12, '#62aee4');
    for (let i = 0; i < 5; i++) { // ondes
      const a = t * 1.2 + i * 1.3, rx = 5 + ((t * 6 + i * 7) % 11);
      r(c, Math.round(cx + Math.cos(a) * rx), Math.round(cy + Math.sin(a) * rx * .7), 3, 1, '#c8e8fc');
    }
    r(c, cx - 4, cy - 14, 8, 15, OL); r(c, cx - 3, cy - 13, 6, 13, '#b8b3a8'); r(c, cx - 3, cy - 13, 2, 13, '#d8d3c8');
    r(c, cx - 8, cy - 18, 16, 5, OL); r(c, cx - 7, cy - 17, 14, 3, '#c8c3b8'); r(c, cx - 6, cy - 17, 12, 1, '#62aee4');
    for (let i = 0; i < 8; i++) { // gouttes qui retombent en cloche
      const ph = (t * 1.3 + i / 8) % 1, side = i % 2 ? 1 : -1, sp = 4 + (i % 4) * 2.2;
      const px = cx + side * sp * ph * 2, py = cy - 18 - Math.sin(ph * Math.PI) * 9 + ph * 16;
      r(c, Math.round(px), Math.round(py), 1, 2, ph < .5 ? '#ffffff' : '#c8e8fc');
    }
    r(c, cx - 1, cy - 24 - Math.floor(t * 8) % 2, 2, 6, '#e8f6ff');
  },
  // Camionnette du maraîcher, portes arrière ouvertes sur des cagettes de giraumons
  van(c, x, y, w, h) {
    r(c, x + 3, y + h - 4, w - 4, 4, 'rgba(30,30,50,.3)');
    r(c, x, y + 2, w, h - 6, OL);
    r(c, x + 1, y + 3, w - 2, h - 8, '#f4f4ee'); r(c, x + 1, y + 3, w - 2, 2, '#ffffff');
    r(c, x + 1, y + 14, w - 2, 5, '#3f8f45'); r(c, x + 1, y + 14, w - 2, 1, '#63b85a');
    r(c, x + w - 13, y + 5, 10, 8, OL); r(c, x + w - 12, y + 6, 8, 6, '#9fd4f0'); r(c, x + w - 11, y + 7, 2, 2, '#e6f6ff'); // cabine
    r(c, x + w - 3, y + 16, 2, 3, '#f0c830');
    r(c, x + 2, y + 5, 20, 8, OL); r(c, x + 3, y + 6, 18, 6, '#6b4a2e');                                             // arrière ouvert
    giraumon(c, x + 7, y + 9, 2); giraumon(c, x + 13, y + 9, 2); giraumon(c, x + 18, y + 9, 2);
    for (const wx of [8, w - 14]) { disc(c, x + wx, y + h - 6, 4, OL); disc(c, x + wx, y + h - 6, 2, '#8a8a94'); }
  },
  crate(c, x, y, w, h, t, o) {
    box(c, x + 1, y + 3, 14, 12, WOOD, WOOD_D, 5);
    r(c, x + 2, y + 4, 12, 1, WOOD_L); r(c, x + 5, y + 10, 1, 4, '#6b4423'); r(c, x + 10, y + 10, 1, 4, '#6b4423');
    if (o.v === 'giraumon') { giraumon(c, x + 5, y + 6, 2); giraumon(c, x + 11, y + 6, 2); }
    else if (o.v === 'pommes') for (const [a, b] of [[4, 5], [8, 4], [11, 6], [6, 7]]) { r(c, x + a, y + b, 3, 3, '#d04848'); r(c, x + a, y + b, 1, 1, '#f09090'); }
    else for (const [a, b] of [[3, 5], [7, 4], [10, 6]]) { r(c, x + a, y + b, 4, 3, '#e8c040'); r(c, x + a, y + b, 2, 1, '#f8e890'); }
  },
  // Panneau indicateur sur un poteau
  post(c, x, y, w, h, t, o) {
    r(c, x + 6, y - 14, 4, 28, OL); r(c, x + 7, y - 13, 2, 26, '#7a7e88');
    r(c, x - 2, y - 16, 20, 10, OL); r(c, x - 1, y - 15, 18, 8, '#2f6f4f'); r(c, x - 1, y - 15, 18, 1, '#4a9a70');
    for (let i = 0; i < 4; i++) r(c, x + 11 + i, y - 14 + i, 1, 7 - i * 2, '#fff3c8'); r(c, x + 2, y - 12, 9, 2, '#fff3c8');
    r(c, x + 4, y + 12, 8, 3, OL);
  },
  // Enseigne en bois accrochée à la façade
  sign(c, x, y, w, h, t, o) {
    r(c, x + 1, y + 1, w - 2, 14, OL); r(c, x + 2, y + 2, w - 4, 12, '#2f6f4f'); r(c, x + 2, y + 2, w - 4, 1, '#4a9a70');
    text(c, o.label || '', x + w / 2, y, '#fff3c8', 'center');
  },
  // ---------- Épicerie ----------
  shelf(c, x, y, w, h, t, o) { // rayonnage contre le mur, vu de face
    const top = y - 10, hh = h + 10;
    r(c, x, top, w, hh, OL); r(c, x + 1, top + 1, w - 2, hh - 2, '#8a5a30'); r(c, x + 1, top + 1, w - 2, 1, WOOD_L);
    const cols = { cans: ['#d04848', '#e8c040', '#3a78c8', '#58b050'], spices: ['#e8843a', '#c8443a', '#e8c040', '#8a5a30', '#58b050'], drinks: ['#58b050', '#e8843a', '#8a3ab0', '#3a78c8'] }[o.v] || ['#d8d8d0'];
    for (let j = 0; j < 2; j++) {
      const sy = top + 3 + j * 11;
      r(c, x + 1, sy + 8, w - 2, 2, WOOD); r(c, x + 1, sy, w - 2, 8, '#5a3a22');
      for (let i = 2; i < w - 4; i += (o.v === 'drinks' ? 4 : 5)) {
        const col = cols[Math.floor((i + j * 3 + x) / 4) % cols.length];
        if (o.v === 'drinks') { r(c, x + i, sy + 2, 3, 6, col); r(c, x + i + 1, sy, 1, 2, col); r(c, x + i, sy + 4, 3, 2, '#f4f4ee'); }
        else if (o.v === 'spices') { r(c, x + i, sy + 3, 4, 5, '#e8e8e0'); r(c, x + i, sy + 4, 4, 3, col); r(c, x + i, sy + 2, 4, 1, '#3a3a44'); }
        else { r(c, x + i, sy + 1, 4, 7, col); r(c, x + i, sy + 3, 4, 2, '#f4f4ee'); r(c, x + i, sy + 1, 4, 1, 'rgba(255,255,255,.4)'); }
      }
    }
  },
  sacks(c, x, y, w, h) { // sacs de riz empilés
    for (let j = 0; j < h; j += 16) {
      const sy = y + j;
      ell(c, x + 8, sy + 9, 8, 7, OL); ell(c, x + 8, sy + 9, 7, 6, '#e6d8b4'); ell(c, x + 7, sy + 7, 5, 3, '#f4ecd4');
      r(c, x + 5, sy + 8, 6, 4, '#c8443a'); r(c, x + 6, sy + 9, 4, 1, '#f4ecd4'); r(c, x + 6, sy + 2, 4, 2, '#c8b88c');
    }
  },
  bananas(c, x, y) { // cagette de bananes plantain
    box(c, x + 1, y + 2, 14, 13, WOOD, WOOD_D, 4);
    for (const [a, b] of [[2, 4], [5, 3], [8, 5], [4, 7], [9, 8]]) {
      r(c, x + a, y + b, 5, 2, '#6aa838'); r(c, x + a + 1, y + b, 3, 1, '#a8d058'); r(c, x + a + 4, y + b + 1, 1, 2, '#6aa838'); r(c, x + a, y + b, 1, 1, '#4a3a20');
    }
  },
  shopcounter(c, x, y, w, h) {
    box(c, x, y, w, h, '#d9b88a', WOOD_D, 6);
    r(c, x + 1, y + 1, w - 2, 1, '#f0dcb8');
    r(c, x + 4, y - 4, 12, 11, OL); r(c, x + 5, y - 3, 10, 9, '#8a9098'); r(c, x + 6, y - 2, 8, 3, '#b8e0a0'); r(c, x + 6, y + 2, 2, 2, '#f4f4ee'); r(c, x + 9, y + 2, 2, 2, '#f4f4ee'); r(c, x + 12, y + 2, 2, 2, '#e86a6a'); // caisse
    r(c, x + w - 16, y + 2, 10, 5, OL); r(c, x + w - 15, y + 3, 8, 3, '#c8ccd2'); r(c, x + w - 12, y - 2, 2, 5, '#8a9098'); disc(c, x + w - 11, y - 3, 3, '#f4f4ee'); r(c, x + w - 11, y - 4, 1, 2, '#d04848'); // balance
    r(c, x + 22, y + 2, 5, 5, '#e8c040'); r(c, x + 22, y + 2, 5, 1, '#f8e890');
  },
  // ---------- Le dîner haïtien, posé sur la table du salon ----------
  dinner(c, x, y, w, h, t, o) {
    const bowl = (bx, by, col, colL) => { disc(c, bx, by, 5, OL); disc(c, bx, by, 4, '#f6f6f2'); disc(c, bx, by, 3, col); r(c, bx - 2, by - 2, 2, 1, colL); };
    const steam = (bx, by, k) => { const ph = (t * .9 + k * .37) % 1; r(c, bx + Math.round(Math.sin(t * 3 + k) * 1.5), Math.round(by - 6 - ph * 8), 1, 2, `rgba(255,255,255,${(.7 * (1 - ph)).toFixed(2)})`); };
    if (o.v === 'dessert') { // petites crèmes à la vanille
      for (const by of [y + 6, y + 18]) { disc(c, x + 8, by, 4, OL); disc(c, x + 8, by, 3, '#f8f0d0'); r(c, x + 7, by - 2, 2, 1, '#ffffff'); r(c, x + 9, by, 1, 1, '#3a2a1a'); }
      return;
    }
    bowl(x + 8, y + 6, '#e89a2a', '#f8c868'); bowl(x + 8, y + 18, '#e89a2a', '#f8c868');   // deux bols de soup joumou
    r(c, x + 7, y + 5, 2, 1, '#58a850'); r(c, x + 9, y + 18, 1, 1, '#c8443a');
    // assiette de bananes pesées
    ell(c, x + 39, y + 7, 7, 5, OL); ell(c, x + 39, y + 7, 6, 4, '#f6f6f2');
    for (const [a, b] of [[35, 5], [39, 4], [42, 7], [37, 8]]) { r(c, x + a, y + b, 3, 3, '#e8b838'); r(c, x + a, y + b, 2, 1, '#f8dc78'); }
    // riz sauce pois
    bowl(x + 39, y + 18, '#a8583a', '#d8b890'); r(c, x + 37, y + 17, 2, 1, '#f4ecd4'); r(c, x + 40, y + 19, 2, 1, '#f4ecd4'); r(c, x + 39, y + 17, 1, 1, '#6a2a22');
    steam(x + 8, y + 6, 0); steam(x + 9, y + 18, 1); steam(x + 39, y + 18, 2); steam(x + 7, y + 6, 3);
  },
}, ['fountain', 'sign', 'dinner']);

export { giraumon };
