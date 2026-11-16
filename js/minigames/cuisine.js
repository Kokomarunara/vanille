// Mini-jeu de cuisine en trois temps : couper le giraumon (rythme), peser les bananes (jauge),
// remuer la soupe (suivre les flèches). Renvoie une note de 1 à 3 étoiles ; on ne peut pas perdre.
import * as input from '../engine/input.js';
import { r } from '../art/tiles.js';
import { text, textS } from '../art/text.js';
import { disc } from '../art/furniture.js';

const PH = [
  { title: '1/3  Couper le giraumon', help: ['Appuie sur A quand un morceau', 'arrive sous le couteau.'], hint: 'A : couper, en rythme' },
  { title: '2/3  Peser les bananes', help: ['Appuie sur A quand la jauge', 'est dans le vert.'], hint: 'A : presser au bon moment' },
  { title: '3/3  Remuer la soupe', help: ['Suis la flèche jaune avec la', 'croix pour tourner la cuillère.'], hint: 'Croix : suivre la flèche jaune' },
];
const DIRS = ['up', 'right', 'down', 'left'];
const ANG = { up: -Math.PI / 2, right: 0, down: Math.PI / 2, left: Math.PI };
const OL = '#2a202c', GOOD = '#90e8a0', BAD = '#f09090', GOLD = '#f0c830';
const BEATS = [0, 1, 2, 3, 4, 4.5, 5, 6, 6.5, 7, 8, 9];
const KX = 70, TY = 100; // position du couteau, hauteur de la piste

function arrow(c, cx, cy, dir, s, col) {
  for (let i = 0; i < s; i++) {
    const w = (i + 1) * 2 - 1;
    if (dir === 'up') r(c, cx - i, cy - s + i, w, 1, col);
    else if (dir === 'down') r(c, cx - i, cy + s - i, w, 1, col);
    else if (dir === 'left') r(c, cx - s + i, cy - i, 1, w, col);
    else r(c, cx + s - i, cy - i, 1, w, col);
  }
  if (dir === 'up') r(c, cx - 2, cy, 5, s, col); else if (dir === 'down') r(c, cx - 2, cy - s + 1, 5, s, col);
  else if (dir === 'left') r(c, cx, cy - 2, s, 5, col); else r(c, cx - s + 1, cy - 2, s, 5, col);
}

export function cuisine(g) {
  let ph = 0, state = 'intro', t = 0, hits = 0, total = 0, fb = '', fbT = 0, fbCol = '#fff';
  let notes = [], knife = 0, cut = 0, endT = 0;          // phase 1
  let slice = 0, pressT = 0, held = 0, flat = [];        // phase 2
  let idx = 0, stepT = 0, shown = Math.PI, target = Math.PI, wrong = 0; // phase 3

  const feedback = (s, col) => { fb = s; fbT = .6; fbCol = col; };
  function begin() {
    state = 'play'; t = 0; endT = 0;
    if (ph === 0) { notes = BEATS.map(b => ({ t: 1.7 + b * .62, done: 0 })); total += notes.length; }
    if (ph === 1) { slice = 0; pressT = 0; total += 5; }
    if (ph === 2) { idx = 0; stepT = 0; total += 12; }
  }
  const endPhase = () => { state = 'result'; t = 0; g.sfx.win(); };
  const gauge = () => (pressT > 0 ? held : .5 - .5 * Math.cos(t * 4.6));

  const mini = {
    update(dt) {
      t += dt; fbT = Math.max(0, fbT - dt); knife = Math.max(0, knife - dt); wrong = Math.max(0, wrong - dt);
      shown += (target - shown) * Math.min(1, dt * 14);
      if (state === 'intro') { if (input.take('a')) { g.sfx.ok(); begin(); } return; }
      if (state === 'result') {
        if (t > 1.2) {
          if (++ph >= 3) { const q = hits / total; mini.finish(q >= .85 ? 3 : q >= .6 ? 2 : 1); }
          else state = 'intro';
        }
        return;
      }
      if (ph === 0) {
        if (input.take('a')) {
          knife = .14;
          const n = notes.find(n => !n.done && Math.abs(n.t - t) <= .17);
          if (n) { n.done = 1; hits++; cut++; feedback(Math.abs(n.t - t) <= .08 ? 'Parfait !' : 'Bien !', GOOD); g.sfx.clac(); }
          else { feedback('Dans le vide...', '#c8c8d0'); g.sfx.bump(); }
        }
        for (const n of notes) if (!n.done && t - n.t > .17) { n.done = 2; feedback('Raté !', BAD); }
        if (notes.every(n => n.done)) { if (!endT) endT = t; else if (t - endT > .6) endPhase(); }
      } else if (ph === 1) {
        if (pressT > 0) {
          if ((pressT -= dt) <= 0) { slice++; t = 0; if (slice >= 5) endPhase(); }
        } else if (input.take('a')) {
          held = gauge(); pressT = .6;
          const q = held >= .68 && held <= .84 ? 2 : held >= .56 && held <= .93 ? 1 : 0;
          if (q) hits++;
          flat.push(q);
          feedback(q === 2 ? 'Parfait !' : q ? 'Bien !' : held > .93 ? 'Trop fort !' : 'Pas assez !', q ? GOOD : BAD);
          if (q) g.sfx.clac(); else g.sfx.bump();
        }
      } else {
        stepT += dt;
        let got = null;
        for (const d of DIRS) if (input.take(d)) got = d;
        const want = DIRS[idx % 4];
        if (got) {
          if (got === want) {
            hits++; g.sfx.move();
            target += Math.PI / 2; // la cuillère tourne toujours dans le même sens
            if (idx % 4 === 3) feedback('Un tour !', GOOD);
          } else { wrong = .25; g.sfx.bump(); feedback('Raté !', BAD); }
          idx++; stepT = 0;
        } else if (stepT > 1.6) { idx++; stepT = 0; feedback('Trop lent !', BAD); }
        if (idx >= 12) endPhase();
      }
    },

    draw(c, tt) {
      // mur carrelé et plan de travail
      r(c, 0, 0, 256, 72, '#efe6d2');
      for (let y = 20; y < 72; y += 13) r(c, 0, y, 256, 1, '#ddd2b8');
      for (let x = 0; x < 256; x += 16) r(c, x, 20, 1, 52, '#ddd2b8');
      r(c, 0, 72, 256, 70, '#c9a472'); r(c, 0, 72, 256, 2, '#e0c090'); r(c, 0, 74, 256, 1, '#a88454');
      for (let x = 12; x < 256; x += 34) r(c, x, 90 + (x % 3) * 12, 10, 1, '#b8935f');

      if (ph === 0) {
        // planche, piste et couteau
        r(c, 14, 80, 108, 52, OL); r(c, 15, 81, 106, 50, '#e2c08c'); r(c, 15, 81, 106, 2, '#f0d8a8'); r(c, 20, 125, 96, 2, '#c8a470');
        r(c, 122, TY - 1, 134, 3, '#b8935f');
        r(c, KX - 9, TY + 9, 20, 2, 'rgba(0,0,0,.2)');
        for (let i = 0; i < cut; i++) { const px = 20 + (i % 7) * 6, py = 120 - Math.floor(i / 7) * 6; r(c, px, py, 5, 5, OL); r(c, px + 1, py + 1, 3, 3, '#f09a30'); }
        if (state === 'play') for (const n of notes) {
          if (n.done === 1) continue;
          const x = Math.round(KX + (n.t - t) / 1.5 * 180);
          if (x > 262 || x < 24) continue;
          const a = n.done === 2 ? .35 : 1;
          c.globalAlpha = a;
          disc(c, x, TY, 7, OL); disc(c, x, TY, 6, '#3f7a3a'); disc(c, x, TY, 5, '#f09a30'); r(c, x - 2, TY - 1, 4, 2, '#f8c868'); r(c, x - 1, TY - 4, 2, 1, '#f8dca0');
          c.globalAlpha = 1;
        }
        // repère de coupe + couteau
        r(c, KX - 1, TY - 12, 1, 24, 'rgba(255,255,255,.5)'); r(c, KX + 1, TY - 12, 1, 24, 'rgba(255,255,255,.5)');
        const ky = knife > 0 ? TY - 14 : TY - 34;
        r(c, KX - 3, ky - 14, 7, 15, OL); r(c, KX - 2, ky - 13, 5, 13, '#6b4423');
        r(c, KX - 5, ky, 11, 22, OL); r(c, KX - 4, ky + 1, 9, 20, '#d8dce4'); r(c, KX - 4, ky + 1, 3, 20, '#f4f6fa'); r(c, KX - 4, ky + 19, 9, 2, '#a8acb4');
      } else if (ph === 1) {
        const v = state === 'play' ? gauge() : 0;
        // assiette des bananes déjà pesées
        disc(c, 52, 110, 24, OL); disc(c, 52, 110, 23, '#f6f6f2'); disc(c, 52, 110, 18, '#e8e8e2');
        flat.forEach((q, i) => { const a = i * 1.3, px = 52 + Math.round(Math.cos(a) * 9), py = 110 + Math.round(Math.sin(a) * 7); disc(c, px, py, q ? 6 : 4, OL); disc(c, px, py, q ? 5 : 3, q === 2 ? '#f0c040' : q ? '#e0b038' : '#b8a040'); r(c, px - 2, py - 2, 2, 1, '#f8e088'); });
        // presse à bananes (deux planches)
        const closing = pressT > 0 ? Math.min(1, (.6 - pressT) / .15) : 0, ty = 66 + Math.round(closing * 22);
        r(c, 96, 104, 72, 12, OL); r(c, 97, 105, 70, 10, '#b07a45'); r(c, 97, 105, 70, 2, '#d09a62');
        if (slice < 5 && state === 'play') {
          const rr = closing >= 1 ? 9 : 6, hh = closing >= 1 ? 2 : 5;
          r(c, 132 - rr - 1, 104 - hh - 1, rr * 2 + 2, hh + 1, OL); r(c, 132 - rr, 104 - hh, rr * 2, hh, '#e8c848'); r(c, 132 - rr, 104 - hh, rr * 2, 1, '#f8e890');
        }
        r(c, 96, ty, 72, 12, OL); r(c, 97, ty + 1, 70, 10, '#c08a52'); r(c, 97, ty + 1, 70, 2, '#d9a66c');
        r(c, 126, ty - 12, 12, 13, OL); r(c, 127, ty - 11, 10, 11, '#8a5a30');
        // jauge de force
        const gx = 204, gy = 32, gh = 100;
        r(c, gx - 2, gy - 2, 20, gh + 4, OL); r(c, gx, gy, 16, gh, '#3a3a44');
        const zone = (a, b, col) => r(c, gx, Math.round(gy + gh - b * gh), 16, Math.round((b - a) * gh), col);
        zone(0, .56, '#8a4a4a'); zone(.93, 1, '#8a4a4a'); zone(.56, .93, '#c8a838'); zone(.68, .84, '#50b860');
        const cy = Math.round(gy + gh - v * gh);
        r(c, gx - 2, cy - 1, 20, 3, '#ffffff'); arrow(c, gx - 9, cy, 'right', 5, '#ffffff');
        text(c, `${Math.min(slice + 1, 5)}/5`, 132, 26, '#34506e', 'center');
      } else {
        // marmite vue de dessus, cuillère qui tourne
        const cx = 128, cy = 82;
        disc(c, cx + 2, cy + 4, 46, 'rgba(0,0,0,.2)');
        disc(c, cx, cy, 46, OL); disc(c, cx, cy, 44, '#6a6e78'); disc(c, cx, cy - 1, 43, '#8a8e98'); disc(c, cx, cy, 38, '#4a4e58');
        disc(c, cx, cy, 36, '#e08a22'); disc(c, cx, cy - 1, 34, '#f09a30');
        for (let i = 0; i < 9; i++) { const a = shown * .9 + i * .7, d = 8 + (i * 7) % 24; r(c, Math.round(cx + Math.cos(a) * d), Math.round(cy + Math.sin(a) * d), 3, 2, i % 3 ? '#f8c868' : i % 2 ? '#58a850' : '#c8443a'); }
        r(c, 80, 78, 6, 8, OL); r(c, 170, 78, 6, 8, OL);
        const ex = cx + Math.cos(shown) * 40, ey = cy + Math.sin(shown) * 40;
        for (let i = 0; i <= 40; i++) { const px = Math.round(cx + (ex - cx) * i / 40), py = Math.round(cy + (ey - cy) * i / 40); r(c, px - 2, py - 2, 5, 5, OL); }
        for (let i = 0; i <= 40; i++) { const px = Math.round(cx + (ex - cx) * i / 40), py = Math.round(cy + (ey - cy) * i / 40); r(c, px - 1, py - 1, 3, 3, i < 12 ? '#d9a66c' : '#b07a45'); }
        for (let i = 0; i < 4; i++) { const p = (tt * .8 + i * .25) % 1; r(c, cx - 20 + i * 13 + Math.round(Math.sin(tt * 3 + i) * 2), Math.round(cy - 30 - p * 20), 2, 3, `rgba(255,255,255,${(.6 * (1 - p)).toFixed(2)})`); }
        // quatre flèches autour de la marmite ; la jaune est celle à suivre
        const want = DIRS[idx % 4], b = Math.floor(tt * 5) % 2;
        const POS = { up: [cx, 30], right: [194, cy], down: [cx, 132], left: [62, cy] };
        for (const d of DIRS) {
          const on = state === 'play' && d === want, [ax, ay] = POS[d];
          const ox = on ? (d === 'left' ? -b : d === 'right' ? b : 0) : 0, oy = on ? (d === 'up' ? -b : d === 'down' ? b : 0) : 0;
          arrow(c, ax + ox + 1, ay + oy + 1, d, on ? 8 : 6, OL);
          arrow(c, ax + ox, ay + oy, d, on ? 8 : 6, on ? (wrong > 0 ? BAD : GOLD) : '#8a8478');
        }
        if (state === 'play') text(c, `${Math.min(Math.floor(idx / 4) + 1, 3)}/3`, 232, 24, '#34506e', 'center');
      }

      // bandeau du haut, retour, aide
      r(c, 0, 0, 256, 20, '#1c2a3c'); textS(c, PH[ph].title, 128, 2, '#fff3c8', 'center');
      r(c, 0, 142, 256, 50, '#1c2a3c'); r(c, 0, 142, 256, 1, '#a9cbe6');
      const score = total ? Math.round(hits / total * 100) : 0;
      if (fbT > 0 && state === 'play') textS(c, fb, 128, 146, fbCol, 'center');
      else textS(c, state === 'intro' && ph === 0 ? 'Soup joumou, bananes pesées, riz' : `Réussite : ${score} %`, 128, 146, '#ffffff', 'center');
      text(c, PH[ph].hint, 128, 166, '#a9cbe6', 'center');
      if (state === 'intro') {
        r(c, 16, 50, 224, 74, OL); r(c, 18, 52, 220, 70, '#fbf8ee'); r(c, 19, 53, 218, 1, '#a9cbe6'); r(c, 19, 120, 218, 1, '#a9cbe6');
        text(c, PH[ph].help[0], 128, 58, '#2c2c36', 'center'); text(c, PH[ph].help[1], 128, 73, '#2c2c36', 'center');
        if (Math.floor(tt * 2) % 2) text(c, 'A : c\'est parti', 128, 98, '#c0405a', 'center');
      } else if (state === 'result') {
        r(c, 68, 62, 120, 30, OL); r(c, 70, 64, 116, 26, '#fbf8ee');
        text(c, ph < 2 ? 'Étape réussie !' : 'À table !', 128, 69, '#c0405a', 'center');
      }
    },
  };
  return mini;
}
