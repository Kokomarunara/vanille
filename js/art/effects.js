// Effets animés : éoliennes, feuilles dans le vent, écran-titre.
import { r } from './tiles.js';
import { disc } from './furniture.js';

export function line(c, x0, y0, x1, y1, col, th = 1) {
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
  c.fillStyle = col;
  for (let i = 0; i <= n; i++) c.fillRect(Math.round(x0 + (x1 - x0) * i / n), Math.round(y0 + (y1 - y0) * i / n), th, th);
}

// Éolienne : pied en (x, y), mât de hauteur h, pales à l'angle ang.
export function turbine(c, x, y, h, ang, col = '#f6f6f2', sh = '#c2c8d4') {
  const L = Math.round(h * .62);
  r(c, x - 2, y - Math.round(h * .35), 5, Math.round(h * .35), col);
  r(c, x - 1, y - h, 3, h, col); r(c, x + 1, y - h, 1, h, sh); r(c, x + 2, y - Math.round(h * .35), 1, Math.round(h * .35), sh);
  r(c, x - 3, y - h - 2, 7, 4, col); r(c, x - 3, y - h + 1, 7, 1, sh);
  const hx = x, hy = y - h - 1;
  for (let k = 0; k < 3; k++) {
    const a = ang + k * Math.PI * 2 / 3, ex = hx + Math.cos(a) * L, ey = hy + Math.sin(a) * L;
    line(c, hx, hy, ex, ey, sh, 2);
    line(c, hx, hy - 1, hx + Math.cos(a) * L * .7, hy - 1 + Math.sin(a) * L * .7, col, 2);
  }
  r(c, hx - 1, hy - 1, 3, 3, '#8a90a0');
}

// Feuilles emportées par le vent (cartes extérieures)
const leaves = Array.from({ length: 9 }, (_, i) => ({ x: i * 37 % 256, y: i * 53 % 192, s: 20 + i * 4, p: i }));
export function drawLeaves(c, t, dt) {
  for (const l of leaves) {
    l.x += l.s * dt; l.y += (8 + Math.sin(t * 2 + l.p) * 14) * dt;
    if (l.x > 260) { l.x = -4; l.y = (l.y * 7 + 31) % 150; }
    if (l.y > 196) l.y = -4;
    const f = Math.floor(t * 6 + l.p) % 2;
    r(c, Math.round(l.x), Math.round(l.y), f ? 2 : 1, f ? 1 : 2, l.p % 3 ? '#e8a040' : '#c85a30');
  }
}

// Écran-titre : coucher de soleil sur la mer, collines et éoliennes
const SKY = ['#2b2a5c', '#3d3270', '#5a3c80', '#8a4a84', '#c05a80', '#e87a70', '#f6a070', '#fbc888'];
const stars = Array.from({ length: 26 }, (_, i) => [(i * 97 + 13) % 256, (i * 41 + 7) % 46, i]);
export function drawTitle(c, t) {
  const bh = 15;
  SKY.forEach((col, i) => {
    r(c, 0, i * bh, 256, bh, col);
    if (i) for (let x = 0; x < 256; x += 2) { r(c, x, i * bh, 1, 1, SKY[i - 1]); r(c, x + 1, i * bh - 1, 1, 1, col); }
  });
  for (const [x, y, i] of stars) if (Math.sin(t * 2 + i) > -.4) r(c, x, y, 1, 1, i % 4 ? '#f8e8c8' : '#ffffff');
  disc(c, 128, 116, 20, '#fde6a8'); disc(c, 128, 116, 17, '#fff6d8');
  // mer
  r(c, 0, 120, 256, 40, '#3c4c94'); r(c, 0, 120, 256, 1, '#f8c090');
  for (let i = 0; i < 16; i++) {
    const y = 122 + i * 2, w = 44 - i * 2 + Math.round(Math.sin(t * 3 + i * 1.7) * 5);
    r(c, 128 - w / 2, y, w, 1, i % 2 ? '#f6a070' : '#fbd6a0');
  }
  for (let i = 0; i < 12; i++) {
    const x = (i * 67 + Math.floor(t * 6)) % 256, y = 124 + (i * 11) % 30;
    r(c, x, y, 5, 1, '#5a6cb4');
  }
  // collines
  const hill = (base, amp, ph, col) => { for (let x = 0; x < 256; x++) { const y = Math.round(base + Math.sin(x / 40 + ph) * amp + Math.sin(x / 13 + ph) * 2); r(c, x, y, 1, 192 - y, col); } };
  hill(152, 6, 1.2, '#2a3a5e');
  turbine(c, 30, 150, 40, t * 1.1, '#e8dcd8', '#a89cb4');
  turbine(c, 222, 152, 46, t * .9 + 1, '#e8dcd8', '#a89cb4');
  hill(166, 8, 3.4, '#1e2a48');
  turbine(c, 76, 172, 74, t * 1.3 + 2, '#fbf3e6', '#c0b4c4');
  turbine(c, 182, 176, 62, t * 1.2 + .5, '#fbf3e6', '#c0b4c4');
  hill(180, 4, 5, '#141c34');
  for (let x = 3; x < 256; x += 7) { const s = Math.round(Math.sin(t * 2.5 + x)); r(c, x + s, 178 + (x * 7) % 9, 1, 3, '#24305a'); }
}
