// Objets du chapitre 5 : salle de TP du lycée, poste électrique, parc éolien.
import { r } from './tiles.js';
import { addFurniture, disc, OL, box, ell } from './furniture.js';
import { line } from './effects.js';

const WOOD = '#c08a52', WOOD_D = '#8a5a30';

// Grande éolienne (cartes et mini-jeux) : pied en (x, y), mât de hauteur h, pales de longueur L à l'angle ang.
export function bigTurbine(c, x, y, h, ang, L, on) {
  ell(c, x, y + 1, 9, 3, 'rgba(20,40,30,.3)');
  for (let i = 0; i < h; i++) { // mât légèrement conique
    const w = 3 + Math.round(3 * (1 - i / h));
    r(c, x - w, y - i, w * 2, 1, OL); r(c, x - w + 1, y - i, w * 2 - 2, 1, '#f2f2ee'); r(c, x + 1, y - i, w - 2, 1, '#c6ccd6');
  }
  const hx = x, hy = y - h;
  r(c, hx - 7, hy - 5, 15, 9, OL); r(c, hx - 6, hy - 4, 13, 7, '#f2f2ee'); r(c, hx - 6, hy + 1, 13, 2, '#c6ccd6');
  // feu de balisage : rouge à l'arrêt, vert quand elle tourne
  r(c, hx - 1, hy - 8, 3, 3, OL); r(c, hx, hy - 7, 1, 1, on ? '#70f090' : (Math.floor(ang * 2 + Date.now() / 400) % 2 ? '#ff5050' : '#802020'));
  for (let k = 0; k < 3; k++) {
    const a = ang + k * Math.PI * 2 / 3, ex = hx + Math.cos(a) * L, ey = hy + Math.sin(a) * L;
    line(c, hx - 1, hy - 1, ex - 1, ey - 1, OL, 4);
    line(c, hx, hy, ex, ey, '#c6ccd6', 2);
    line(c, hx - 1, hy - 1, hx - 1 + Math.cos(a) * L * .8, hy - 1 + Math.sin(a) * L * .8, '#fafaf6', 2);
  }
  disc(c, hx, hy, 3, OL); disc(c, hx, hy, 2, '#9aa0b0');
}

addFurniture({
  // ---------- Lycée : salle de TP ----------
  tpbench(c, x, y, w, h, t, o) { // paillasse avec transformateur et appareils de mesure
    box(c, x, y, w, h, '#e8e4d8', '#8a8e98', 5);
    r(c, x + 1, y + 1, w - 2, 1, '#f8f6ee');
    // petit transformateur : circuit magnétique et deux bobines
    r(c, x + 4, y - 6, 16, 14, OL); r(c, x + 5, y - 5, 14, 12, '#5a5e6a'); r(c, x + 8, y - 2, 8, 6, '#e8e4d8');
    r(c, x + 5, y - 3, 4, 8, '#c8743a'); r(c, x + 15, y - 3, 4, 8, '#c8743a'); r(c, x + 5, y - 2, 4, 1, '#e8a060'); r(c, x + 15, y - 2, 4, 1, '#e8a060');
    // multimètre
    r(c, x + 25, y - 2, 9, 11, OL); r(c, x + 26, y - 1, 7, 9, '#e8b830'); r(c, x + 27, y, 5, 3, '#b8e0a0'); disc(c, x + 29, y + 6, 1, '#3a3a44');
    // fils
    line(c, x + 20, y + 4, x + 26, y + 6, '#d04848', 1); line(c, x + 20, y + 1, x + 26, y + 3, '#2a2a30', 1);
    if (o.v === 'k') { r(c, x + 37, y + 1, 8, 7, '#e8b830'); r(c, x + 38, y + 2, 6, 5, '#f4f4ee'); r(c, x + 40, y + 3, 2, 1, '#e8603c'); r(c, x + 40, y + 5, 1, 2, '#e8603c'); }
    else { r(c, x + 37, y + 1, 8, 7, '#3a78c8'); r(c, x + 38, y + 2, 6, 5, '#f4f4ee'); }
  },
  blackboard(c, x, y, w, h) {
    r(c, x + 1, y - 8, w - 2, 20, OL); r(c, x + 2, y - 7, w - 4, 18, WOOD_D); r(c, x + 4, y - 5, w - 8, 14, '#2f5a48');
    // schéma de transformateur à la craie
    const cx = x + w / 2;
    r(c, cx - 14, y - 2, 6, 1, '#f4f4ee'); r(c, cx - 8, y - 3, 1, 8, '#f4f4ee'); r(c, cx - 6, y - 3, 1, 8, '#f4f4ee');
    for (let i = 0; i < 4; i++) { r(c, cx - 11, y - 2 + i * 2, 3, 1, '#f4f4ee'); r(c, cx - 4, y - 2 + i * 2, 3, 1, '#f4f4ee'); }
    r(c, cx + 4, y - 2, 12, 1, '#f8e890'); r(c, cx + 4, y + 1, 9, 1, '#f8e890'); r(c, cx + 4, y + 4, 11, 1, '#f4f4ee');
    r(c, x + 4, y + 9, w - 8, 2, '#c8a878'); r(c, x + 8, y + 8, 4, 1, '#f4f4ee');
  },
  locker(c, x, y, w, h) { // armoire électrique pédagogique
    const top = y - 8, hh = h + 8;
    r(c, x, top, w, hh, OL); r(c, x + 1, top + 1, w - 2, hh - 2, '#b8bcc4'); r(c, x + 1, top + 1, w - 2, 1, '#e0e2e6'); r(c, x + w - 3, top + 1, 2, hh - 2, '#9a9ea8');
    r(c, x + 3, top + 4, w - 7, 9, '#5a5e6a'); for (let i = 0; i < 3; i++) { r(c, x + 4 + i * 3, top + 5, 2, 4, '#f4f4ee'); r(c, x + 4 + i * 3, top + 5, 2, 1, i ? '#50b860' : '#d04848'); }
    r(c, x + 4, top + 16, 7, 7, '#f0c830'); r(c, x + 7, top + 18, 1, 2, OL); r(c, x + 7, top + 21, 1, 1, OL);
    r(c, x + 1, top + hh - 4, w - 2, 3, '#8a8e98');
  },
  // ---------- Poste électrique ----------
  substation(c, x, y, w, h) { // bâtiment du poste HTA/BT
    r(c, x, y - 10, w, h + 10, OL);
    r(c, x + 1, y - 9, w - 2, 12, '#7a8090'); r(c, x + 1, y - 9, w - 2, 2, '#9aa0b0'); r(c, x + 1, y + 2, w - 2, 1, '#5a6070');           // toit
    r(c, x + 1, y + 3, w - 2, h - 4, '#d8d4c8'); for (let i = 8; i < w - 4; i += 12) r(c, x + i, y + 3, 1, h - 4, '#c4c0b4');
    r(c, x + 1, y + h - 5, w - 2, 4, '#a8a498');
    const dx = x + Math.floor(w / 2) - 9;
    r(c, dx, y + 10, 18, h - 11, OL); r(c, dx + 1, y + 11, 16, h - 13, '#5a8a6a'); r(c, dx + 8, y + 11, 1, h - 13, '#3a6a4a'); r(c, dx + 1, y + 11, 16, 1, '#7aaa8a');
    r(c, dx + 5, y + 20, 2, 3, '#e8e8e0'); r(c, dx + 11, y + 20, 2, 3, '#e8e8e0');
    // triangle « danger électrique »
    for (let i = 0; i < 7; i++) r(c, dx + 9 - i - 1, y + 13 + i - 8, i * 2 + 2, 1, '#f0c830');
    r(c, dx + 8, y + 8, 1, 3, OL); r(c, dx + 8, y + 12 - 1, 1, 1, OL);
    r(c, x + 4, y + 8, 10, 7, OL); r(c, x + 5, y + 9, 8, 5, '#3a3e4a'); for (let i = 0; i < 4; i++) r(c, x + 5, y + 9 + i * 2 - (i ? 0 : 0), 8, 1, '#5a5e6a'); // grille d'aération
    r(c, x + w - 14, y + 8, 10, 7, OL); r(c, x + w - 13, y + 9, 8, 5, '#3a3e4a'); for (let i = 0; i < 3; i++) r(c, x + w - 13, y + 10 + i * 2, 8, 1, '#5a5e6a');
  },
  transfo(c, x, y, w, h, t, o) { // gros transformateur à ailettes, avec ses trois bornes
    ell(c, x + w / 2, y + h - 1, w / 2, 4, 'rgba(30,30,50,.3)');
    r(c, x + 2, y + 2, w - 4, h - 4, OL); r(c, x + 3, y + 3, w - 6, h - 6, '#5a7a6a'); r(c, x + 3, y + 3, w - 6, 3, '#7a9a8a');
    for (let i = 6; i < w - 8; i += 4) { r(c, x + i, y + 8, 2, h - 14, '#3a5a4a'); r(c, x + i, y + 8, 1, h - 14, '#6a8a7a'); }
    r(c, x + 3, y + h - 7, w - 6, 4, '#3a5a4a');
    for (let k = 0; k < 3; k++) { // isolateurs
      const bx = x + 10 + k * 12;
      r(c, bx - 1, y - 9, 6, 13, OL); r(c, bx, y - 8, 4, 11, '#b85a3a'); for (let j = 0; j < 4; j++) r(c, bx - 1, y - 7 + j * 3, 6, 1, '#e8a080');
      r(c, bx + 1, y - 11, 2, 3, '#c8ccd4');
    }
    if (o.on) { const b = Math.floor(t * 6) % 2; r(c, x + w - 9, y + 5, 3, 3, b ? '#70f090' : '#50b860'); }
    else if (Math.floor(t * 5) % 7 === 0) { r(c, x + 21, y - 13, 1, 2, '#fff8a0'); r(c, x + 23, y - 12, 2, 1, '#fff8a0'); r(c, x + w - 9, y + 5, 3, 3, '#d04848'); }
    else r(c, x + w - 9, y + 5, 3, 3, '#802020');
  },
  pylon(c, x, y) { // pylône en treillis
    const top = y - 50;
    r(c, x + 2, y + 10, 12, 4, 'rgba(30,30,50,.3)');
    for (let i = 0; i <= 62; i++) { const s = 6 - Math.round(4 * i / 62); r(c, x + 8 - s - 1, y + 12 - i, 2, 1, '#6a707c'); r(c, x + 8 + s, y + 12 - i, 2, 1, '#8a909c'); }
    for (let j = 0; j < 6; j++) { const yy = y + 8 - j * 10, s = 6 - Math.round(4 * (4 + j * 10) / 62); line(c, x + 8 - s, yy, x + 8 + s, yy - 9, '#7a808c', 1); line(c, x + 8 + s, yy, x + 8 - s, yy - 9, '#7a808c', 1); }
    r(c, x - 6, top + 4, 28, 2, '#6a707c'); r(c, x - 3, top + 14, 22, 2, '#6a707c');
    for (const ix of [-5, 20, -2, 17]) r(c, x + ix, top + (ix < -3 || ix > 18 ? 6 : 16), 1, 4, '#b85a3a');
  },
  fence(c, x, y, w, h) {
    for (let i = 0; i < w; i += 16) { r(c, x + i + 7, y + 2, 2, 12, OL); r(c, x + i + 7, y + 2, 1, 12, '#9aa0ac'); }
    r(c, x, y + 4, w, 1, '#7a808c'); r(c, x, y + 8, w, 1, '#7a808c'); r(c, x, y + 11, w, 1, '#7a808c');
    for (let i = 2; i < w; i += 4) { r(c, x + i, y + 5, 1, 3, 'rgba(120,128,140,.6)'); r(c, x + i + 2, y + 9, 1, 2, 'rgba(120,128,140,.6)'); }
  },
  workvan(c, x, y, w, h) { // camionnette bleue d'intervention
    r(c, x + 3, y + h - 4, w - 4, 4, 'rgba(30,30,50,.3)');
    r(c, x, y + 2, w, h - 6, OL);
    r(c, x + 1, y + 3, w - 2, h - 8, '#2a4fa8'); r(c, x + 1, y + 3, w - 2, 2, '#4a6fc8');
    r(c, x + 1, y + 14, w - 2, 4, '#8ac83a'); r(c, x + 1, y + 14, w - 2, 1, '#b0e060');
    r(c, x + 3, y + 5, 10, 8, OL); r(c, x + 4, y + 6, 8, 6, '#9fd4f0'); r(c, x + 5, y + 7, 2, 2, '#e6f6ff');
    r(c, x + 1, y + 16, 2, 3, '#f0c830');
    r(c, x + 20, y - 1, 16, 4, OL); r(c, x + 21, y, 14, 2, '#c8ccd4');                                         // échelle sur le toit
    r(c, x + w - 4, y + 4, 2, 2, Math.floor(t0() * 3) % 2 ? '#f0a030' : '#a86010');                            // gyrophare
    for (const wx of [9, w - 10]) { disc(c, x + wx, y + h - 6, 4, OL); disc(c, x + wx, y + h - 6, 2, '#8a8a94'); }
  },
  // ---------- Parc éolien ----------
  turbine(c, x, y, w, h, t, o) {
    bigTurbine(c, x + 8, y + 13, 74, o.on ? t * 2.4 + o.x : .5 + o.x, 36, o.on);
    // armoire de commande au pied du mât
    r(c, x + 1, y + 3, 9, 11, OL); r(c, x + 2, y + 4, 7, 9, '#b8bcc4'); r(c, x + 2, y + 4, 7, 1, '#e0e2e6');
    r(c, x + 4, y + 6, 3, 3, o.on ? '#50b860' : '#d04848'); r(c, x + 3, y + 10, 5, 1, '#5a5e6a');
  },
  waves(c, x, y, w, h, t) { // écume animée par-dessus la mer
    for (let i = 0; i < 26; i++) {
      const px = x + ((i * 61 + Math.floor(t * 14)) % w), py = y + 3 + (i * 11) % (h - 8);
      r(c, px, py, 6, 1, i % 3 ? '#6a94d8' : '#a8c8f0');
    }
    for (let i = 0; i < w; i += 8) { const s = Math.round(Math.sin(t * 2 + i * .2) * 2); r(c, x + i, y + h - 3 + s, 5, 1, '#e8f0f8'); }
  },
  gorse(c, x, y, w, h, t) { // ajonc en fleur
    disc(c, x + 8, y + 9, 7, OL); disc(c, x + 8, y + 9, 6, '#3f7a3a'); disc(c, x + 6, y + 7, 3, '#58984a');
    const tw = Math.floor(t * 2 + x) % 5;
    [[4, 4], [9, 3], [12, 7], [6, 9], [10, 11]].forEach(([a, b], i) => { r(c, x + a, y + b, 2, 2, i === tw ? '#fff8a0' : '#f0c830'); });
  },
  rock(c, x, y) {
    ell(c, x + 8, y + 10, 7, 5, OL); ell(c, x + 8, y + 10, 6, 4, '#8a8478'); ell(c, x + 6, y + 8, 3, 2, '#a8a296'); r(c, x + 10, y + 11, 3, 1, '#6a645a');
  },
}, ['transfo', 'turbine', 'waves', 'gorse', 'workvan']);

function t0() { return performance.now() / 1000; }
