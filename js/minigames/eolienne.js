// Mini-jeu : relancer une éolienne mise en sécurité par la tempête. Trois gestes :
//  1. orienter la nacelle face au vent (Gauche/Droite) et tenir l'alignement ;
//  2. débloquer le frein (appuyer vite sur A) ;
//  3. réarmer au bon moment (A quand l'aiguille est dans le vert).
// « level » (0, 1, 2) rend le vent plus capricieux d'une machine à l'autre.
import * as input from '../engine/input.js';
import { r } from '../art/tiles.js';
import { text, textS } from '../art/text.js';
import { disc } from '../art/furniture.js';
import { line } from '../art/effects.js';
import { bigTurbine } from '../art/storm.js';

const OL = '#1a1420', TWO = Math.PI * 2;
const STEP = ['1/3  Face au vent', '2/3  Débloquer le frein', '3/3  Réarmer'];
const HINT = ['Gauche/Droite : aligner la nacelle', 'A, vite : desserrer le frein', 'A quand l\'aiguille est dans le vert'];
const diff = (a, b) => { let d = (a - b) % TWO; if (d > Math.PI) d -= TWO; if (d < -Math.PI) d += TWO; return d; };

export function eolienne(g, level = 0) {
  let step = 0, t = 0, hold = 0, brake = 0, spin = 0, rot = 0, endT = 0, miss = 0;
  const base = 1 + Math.random() * 4;         // direction moyenne du vent
  let nac = base + 2.2;                        // la nacelle part de travers
  const wind = () => base + Math.sin(t * (.5 + level * .25)) * (.25 + level * .3);
  const needle = () => .5 - .5 * Math.cos(t * (3.4 + level * .7));

  const mini = {
    dbg: () => ({ step, ecart: diff(nac, wind()), aiguille: needle() }), // pour les tests automatiques
    update(dt) {
      t += dt; miss = Math.max(0, miss - dt);
      rot += spin * dt * 5;
      if (step === 0) {
        const d = input.held.has('left') ? -1 : input.held.has('right') ? 1 : 0;
        nac += d * dt * 1.7;
        if (Math.abs(diff(nac, wind())) < .2) { hold += dt; if (hold > 1.3) { step = 1; t = 0; g.sfx.win(); } }
        else hold = Math.max(0, hold - dt * 2);
        input.pressed.delete('a');
      } else if (step === 1) {
        nac += diff(wind(), nac) * Math.min(1, dt * 3);
        if (input.take('a')) { brake += .1; g.sfx.clac(); }
        brake = Math.max(0, brake - dt * (.22 + level * .07));
        spin = brake * .25;
        if (brake >= 1) { step = 2; t = 0; g.sfx.win(); }
      } else if (step === 2) {
        nac += diff(wind(), nac) * Math.min(1, dt * 3);
        spin += (.35 - spin) * dt;
        if (input.take('a')) {
          const v = needle();
          if (v > .62 && v < .86) { step = 3; g.sfx.win(); } else { miss = .4; g.sfx.bump(); }
        }
      } else { spin += (1 - spin) * dt * 1.5; if ((endT += dt) > 1.8) mini.finish(true); }
    },

    draw(c, tt) {
      // ciel d'orage qui s'éclaircit quand la machine repart
      ['#1a2040', '#242c50', '#2f3a62', '#3b4874', '#48588a'].forEach((col, i) => r(c, 0, i * 29, 256, 29, col));
      if (step === 3) { c.globalAlpha = Math.min(.5, endT * .4); r(c, 0, 0, 256, 142, '#f0a060'); c.globalAlpha = 1; }
      for (let i = 0; i < 5; i++) { const cx = ((i * 80 - tt * (10 + i * 3)) % 330 + 330) % 330 - 40; r(c, Math.round(cx), 22 + (i * 19) % 40, 44, 7, '#141a36'); }
      r(c, 0, 128, 256, 14, '#2f5a3a'); r(c, 0, 128, 256, 1, '#3f7448');
      bigTurbine(c, 62, 134, 84, rot + .4, 40, step === 3);
      if (step < 3) for (let i = 0; i < 40; i++) { const x = ((i * 53 - tt * 150) % 300 + 300) % 300 - 20, y = ((i * 37 + tt * (280 + (i % 5) * 40)) % 150) - 6; r(c, Math.round(x), Math.round(y), 1, 3, 'rgba(190,210,255,.45)'); }

      // pupitre de commande
      r(c, 126, 24, 124, 112, OL); r(c, 128, 26, 120, 108, '#3a4050'); r(c, 128, 26, 120, 2, '#565e72');
      const cx = 188, cy = 78;
      if (step === 0) {
        disc(c, cx, cy, 40, OL); disc(c, cx, cy, 38, '#20242e');
        for (let k = 0; k < 8; k++) r(c, Math.round(cx + Math.cos(k * TWO / 8) * 34) - 1, Math.round(cy + Math.sin(k * TWO / 8) * 34) - 1, 2, 2, '#565e72');
        const w = wind(), ok = Math.abs(diff(nac, w)) < .2;
        // le vent : flèches bleues qui arrivent
        for (let i = 0; i < 3; i++) { const d = 36 - ((tt * 30 + i * 12) % 30), px = cx - Math.cos(w) * d, py = cy - Math.sin(w) * d; r(c, Math.round(px) - 1, Math.round(py) - 1, 3, 3, '#6aa0e8'); }
        line(c, cx - Math.cos(w) * 36, cy - Math.sin(w) * 36, cx - Math.cos(w) * 14, cy - Math.sin(w) * 14, '#6aa0e8', 2);
        // la nacelle : doit pointer vers d'où vient le vent
        line(c, cx, cy, cx - Math.cos(nac) * 30, cy - Math.sin(nac) * 30, ok ? '#70f090' : '#f0c830', 4);
        disc(c, cx, cy, 5, ok ? '#70f090' : '#f0c830'); disc(c, cx, cy, 2, OL);
        r(c, 140, 124, 96, 6, OL); r(c, 141, 125, Math.round(94 * Math.min(1, hold / 1.3)), 4, '#70f090');
      } else if (step === 1) {
        disc(c, cx, cy - 6, 30, OL); disc(c, cx, cy - 6, 28, '#8a8e98'); disc(c, cx, cy - 6, 20, '#5a5e6a'); disc(c, cx, cy - 6, 6, '#c8ccd4');
        for (let k = 0; k < 6; k++) { const a = rot * .6 + k * TWO / 6; r(c, Math.round(cx + Math.cos(a) * 24) - 1, Math.round(cy - 6 + Math.sin(a) * 24) - 1, 3, 3, OL); }
        const j = Math.round((1 - brake) * 0); // mâchoires du frein qui s'écartent
        r(c, cx - 38 - Math.round(brake * 8) - j, cy - 16, 12, 20, OL); r(c, cx - 37 - Math.round(brake * 8), cy - 15, 10, 18, '#d04848');
        r(c, cx + 26 + Math.round(brake * 8), cy - 16, 12, 20, OL); r(c, cx + 27 + Math.round(brake * 8), cy - 15, 10, 18, '#d04848');
        r(c, 140, 120, 96, 10, OL); r(c, 141, 121, Math.round(94 * Math.min(1, brake)), 8, brake > .7 ? '#70f090' : '#f0c830');
      } else if (step === 2) {
        const v = needle(), gx = 140, gw = 96;
        text(c, 'RÉARMEMENT', cx, 40, '#a9cbe6', 'center');
        r(c, gx - 2, 74, gw + 4, 22, OL); r(c, gx, 76, gw, 18, '#20242e');
        r(c, gx + Math.round(gw * .62), 76, Math.round(gw * .24), 18, '#50b860');
        const nx = gx + Math.round(v * gw);
        r(c, nx - 1, 70, 3, 30, miss > 0 ? '#f09090' : '#ffffff');
        disc(c, cx, 116, 8, OL); disc(c, cx, 116, 6, Math.floor(tt * 4) % 2 ? '#f0c830' : '#a88818');
      } else {
        text(c, 'EN SERVICE', cx, 50, '#70f090', 'center');
        disc(c, cx, 90, 16, OL); disc(c, cx, 90, 14, '#50b860'); disc(c, cx - 4, 86, 4, '#90f0a8');
      }
      r(c, 0, 0, 256, 20, '#1c2a3c'); textS(c, `ÉOLIENNE ${level + 1}/3`, 128, 2, '#fff3c8', 'center');
      r(c, 0, 142, 256, 50, '#1c2a3c'); r(c, 0, 142, 256, 1, '#a9cbe6');
      textS(c, step < 3 ? STEP[step] : 'Elle repart !', 128, 146, '#ffffff', 'center');
      if (step < 3) text(c, HINT[step], 128, 166, '#a9cbe6', 'center');
    },
  };
  return mini;
}
