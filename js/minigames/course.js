// Mini-jeu de course à pied sur le sentier côtier, sous la tempête.
// Ketura court toute seule ; A (ou toucher l'écran) pour sauter par-dessus les flaques et les branches.
// Attention aux goélands qui volent bas : là, il ne faut PAS sauter. On ne peut pas perdre, juste trébucher.
import * as input from '../engine/input.js';
import { r } from '../art/tiles.js';
import { text, textS } from '../art/text.js';
import { disc } from '../art/furniture.js';
import { sprite } from '../art/sprites.js';
import { bigTurbine } from '../art/storm.js';

const OL = '#1a1420', PX = 52, GROUND = 150, LEN = 2500, SPEED = 125;

export function course(g) {
  let state = 'intro', t = 0, dist = 0, sp = SPEED, h = 0, vy = 0, hits = 0, stun = 0, endT = 0;
  const obs = [];
  for (let x = 330; x < LEN - 160; x += 150 + Math.floor(Math.random() * 70)) {
    const k = Math.random();
    obs.push({ x, type: k < .42 ? 'flaque' : k < .78 ? 'branche' : 'goeland', hit: false, off: 0 });
  }

  const mini = {
    update(dt) {
      t += dt;
      if (state === 'intro') { if (input.take('a')) { g.sfx.ok(); state = 'run'; t = 0; } return; }
      if (state === 'end') { if ((endT += dt) > 1.4) mini.finish(hits); return; }
      stun = Math.max(0, stun - dt);
      sp += (SPEED - sp) * Math.min(1, dt * 1.6);
      dist += sp * dt;
      if ((input.take('a') || input.take('up')) && h === 0) { vy = 205; g.sfx.move(); }
      if (h > 0 || vy > 0) { h += vy * dt; vy -= 570 * dt; if (h <= 0) { h = 0; vy = 0; } }
      for (const o of obs) {
        if (o.type === 'goeland') o.off += 45 * dt;
        const ox = o.x - o.off, w = o.type === 'flaque' ? 22 : o.type === 'branche' ? 14 : 18;
        if (o.hit || ox > dist + 24 || ox + w < dist + 8) continue;
        const touch = o.type === 'flaque' ? h < 5 : o.type === 'branche' ? h < 9 : h > 13;
        if (touch) { o.hit = true; hits++; sp = 30; stun = .7; g.sfx.bump(); }
      }
      if (dist >= LEN) { state = 'end'; g.sfx.win(); }
    },

    draw(c, tt) {
      // ciel d'orage, éclairs
      ['#161c3a', '#1e2648', '#283258', '#33406a'].forEach((col, i) => r(c, 0, i * 24, 256, 24, col));
      for (let i = 0; i < 6; i++) { const cx = ((i * 90 - tt * (8 + i * 2)) % 340 + 340) % 340 - 40; r(c, Math.round(cx), 10 + (i * 17) % 50, 46, 8, '#0f1430'); r(c, Math.round(cx) + 8, 6 + (i * 17) % 50, 28, 6, '#0f1430'); }
      const fl = tt % 5.2; if (fl < .06 || (fl > .14 && fl < .2)) r(c, 0, 0, 256, 96, 'rgba(230,236,255,.5)');
      // mer et phare au loin
      r(c, 0, 96, 256, 34, '#22366a'); r(c, 0, 96, 256, 1, '#4a5c94');
      for (let i = 0; i < 14; i++) r(c, ((i * 47 - dist * .12 - tt * 10) % 280 + 280) % 280 - 12, 100 + (i * 7) % 26, 9, 1, i % 2 ? '#3a5090' : '#5a70b0');
      const lx = Math.round(210 - dist * .03);
      r(c, lx - 3, 70, 7, 27, OL); r(c, lx - 2, 71, 5, 26, '#e8e8e4'); r(c, lx - 2, 78, 5, 4, '#c8443a'); r(c, lx - 2, 88, 5, 4, '#c8443a'); r(c, lx - 4, 66, 9, 5, OL); r(c, lx - 3, 67, 7, 3, '#f8e890');
      if (Math.floor(tt * .8) % 2) { c.globalAlpha = .28; for (let i = 0; i < 40; i++) r(c, lx - 4 - i * 3, 68 - i / 3, 3, 3 + i / 2, '#f8f0b0'); c.globalAlpha = 1; }
      // les éoliennes à l'arrêt se rapprochent
      for (let k = 0; k < 3; k++) { const ex = Math.round(470 - dist * .15 + k * 46); if (ex > -30 && ex < 290) { c.globalAlpha = .9; bigTurbine(c, ex, 130, 56 - k * 6, .5 + k, 26, false); c.globalAlpha = 1; } }
      // lande, sentier, herbes
      r(c, 0, 128, 256, 64, '#2f5a3a'); r(c, 0, 128, 256, 2, '#3f7448');
      for (let i = 0; i < 9; i++) { const bx = ((i * 83 - dist * .7) % 330 + 330) % 330 - 30; disc(c, Math.round(bx), 138, 6, '#254a30'); r(c, Math.round(bx) - 3, 134, 2, 2, '#c8a830'); r(c, Math.round(bx) + 2, 136, 2, 2, '#c8a830'); }
      r(c, 0, GROUND - 2, 256, 18, '#6e5c46'); r(c, 0, GROUND - 2, 256, 1, '#86725a'); r(c, 0, GROUND + 15, 256, 1, '#4a3e30');
      for (let i = 0; i < 12; i++) r(c, ((i * 37 - dist) % 280 + 280) % 280 - 12, GROUND + 2 + (i * 5) % 11, 4, 1, i % 2 ? '#5e4e3c' : '#7e6a52');
      for (let i = 0; i < 8; i++) { const gx = ((i * 71 - dist * 1.25) % 320 + 320) % 320 - 30; r(c, Math.round(gx), 174 + (i * 7) % 12, 2, 5, '#3f7448'); r(c, Math.round(gx) + 3, 176 + (i * 7) % 12, 2, 4, '#254a30'); }
      // obstacles
      for (const o of obs) {
        const x = Math.round(PX + (o.x - o.off - dist));
        if (x < -40 || x > 280) continue;
        if (o.type === 'flaque') { r(c, x - 2, GROUND + 6, 26, 5, '#3a5090'); r(c, x, GROUND + 5, 22, 7, '#4a64a8'); r(c, x + 4, GROUND + 7, 8, 1, '#8aa4d8'); if (o.hit) for (let i = 0; i < 4; i++) r(c, x + i * 6, GROUND - 2 - (i % 2) * 5, 2, 3, '#8aa4d8'); }
        else if (o.type === 'branche') { r(c, x - 2, GROUND + 1, 18, 9, OL); r(c, x - 1, GROUND + 2, 16, 7, '#6b4a2e'); r(c, x - 1, GROUND + 2, 16, 2, '#8a6642'); r(c, x + 4, GROUND - 5, 3, 7, '#6b4a2e'); r(c, x + 5, GROUND - 8, 5, 4, '#3f7448'); r(c, x + 11, GROUND - 2, 2, 4, '#6b4a2e'); }
        else { const yy = GROUND - 34 + Math.round(Math.sin(tt * 6 + o.x) * 2), wing = Math.floor(tt * 8) % 2; r(c, x, yy, 16, 5, OL); r(c, x + 1, yy + 1, 14, 3, '#f4f4f0'); r(c, x - 3, yy + 1, 4, 2, '#e8a030'); r(c, x + 2, yy + 1, 1, 1, OL); r(c, x + 5, yy + (wing ? -6 : 3), 8, 6, OL); r(c, x + 6, yy + (wing ? -5 : 4), 6, 4, '#c8ccd4'); }
      }
      // Ketura
      const fr = h > 0 ? 'r2' : Math.floor(dist / 13) % 2 ? 'r1' : 'r2', sw = 14 - Math.min(8, h / 5);
      r(c, PX + 18 - sw, GROUND + 9, sw * 2, 3, 'rgba(0,0,0,.3)');
      if (!(stun > 0 && Math.floor(tt * 16) % 2)) c.drawImage(sprite('ketura_pro', 'right', fr), 0, 0, 18, 27, PX, Math.round(GROUND + 12 - 54 - h), 36, 54);
      if (stun > 0) { r(c, PX + 30, GROUND - 46, 4, 6, '#6aa0e8'); r(c, PX + 31, GROUND - 48, 2, 2, '#6aa0e8'); }
      // pluie
      for (let i = 0; i < 60; i++) { const x = ((i * 53 - tt * 160) % 300 + 300) % 300 - 20, y = ((i * 37 + tt * (300 + (i % 5) * 40)) % 210) - 10; r(c, Math.round(x), Math.round(y), 1, 3, 'rgba(190,210,255,.5)'); r(c, Math.round(x) + 1, Math.round(y) - 3, 1, 2, 'rgba(190,210,255,.3)'); }
      // progression
      r(c, 38, 6, 180, 8, OL); r(c, 40, 8, 176, 4, '#3a4050'); r(c, 40, 8, Math.round(176 * Math.min(1, dist / LEN)), 4, '#f0c830');
      r(c, 220, 4, 2, 11, '#f4f4ee'); r(c, 216, 3, 10, 2, '#f4f4ee');
      if (state === 'run' && t < 3.5) textS(c, 'A : sauter', 128, 20, '#ffffff', 'center');
      if (state === 'intro') {
        r(c, 14, 44, 228, 92, OL); r(c, 16, 46, 224, 88, '#fbf8ee');
        text(c, 'Quatre kilomètres de sentier.', 128, 50, '#2c2c36', 'center');
        text(c, 'A : sauter les flaques', 128, 68, '#2c2c36', 'center');
        text(c, 'et les branches.', 128, 82, '#2c2c36', 'center');
        text(c, 'Goéland : ne saute pas !', 128, 98, '#34506e', 'center');
        if (Math.floor(tt * 2) % 2) text(c, 'A : c\'est parti', 128, 116, '#c0405a', 'center');
      } else if (state === 'end') { r(c, 58, 60, 140, 30, OL); r(c, 60, 62, 136, 26, '#fbf8ee'); text(c, 'Le parc éolien !', 128, 67, '#c0405a', 'center'); }
    },
  };
  return mini;
}
