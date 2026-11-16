// Mini-jeu : recâbler le bornier de la machine à laver (phase, neutre, terre).
// On joue uniquement au doigt (ou à la souris) : on attrape le bout d'un fil et on le glisse sur une borne,
// ou on le tire dans le vide pour le décrocher. Puis on touche CONTRÔLER (le bouton A fait la même chose).
import * as input from '../engine/input.js';
import { r } from '../art/tiles.js';
import { text, textS } from '../art/text.js';

const WIRES = [
  { name: 'Fil vert-jaune', cols: ['#58b050', '#e8d040'], ok: 2 },
  { name: 'Fil marron', cols: ['#8a5a30', '#8a5a30'], ok: 0 },
  { name: 'Fil bleu', cols: ['#4a78d0', '#4a78d0'], ok: 1 },
];
const TERMS = ['L — Phase', 'N — Neutre', 'Terre'];
const WY = [46, 72, 98];        // hauteur des fils et des bornes
const LOOSE_X = 72, TERM_X = 204;
const BTN = { x: 84, y: 116, w: 88, h: 18 };

function wire(c, x0, y0, x1, y1, cols) {
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
  for (let i = 0; i <= n; i++) {
    const x = Math.round(x0 + (x1 - x0) * i / n), y = Math.round(y0 + (y1 - y0) * i / n);
    r(c, x, y - 2, 2, 5, '#2a202c'); r(c, x, y - 1, 2, 3, cols[Math.floor(i / 4) % 2]);
  }
}

export function cablage(g) {
  const assign = [-1, -1, -1];
  let sel = 0, flash = 0, busy = false, fails = 0, drag = null;

  const endPos = i => assign[i] >= 0 ? [TERM_X, WY[assign[i]]] : [LOOSE_X, WY[i]];

  async function validate() {
    busy = true;
    if (assign.includes(-1)) await g.say('k', 'Il reste des fils en l\'air. On ne laisse jamais un conducteur nu se balader.');
    else if (assign.every((a, i) => a === WIRES[i].ok)) {
      g.sfx.win();
      await g.say(null, 'Chaque fil sur sa borne, serré au tournevis, vérifié au multimètre.');
      mini.finish(true); return;
    } else {
      flash = .4; g.sfx.zap();
      await g.say(null, 'Ketura contrôle au multimètre avant de refermer... BIP. Ce n\'est pas bon.');
      if (fails++ > 0) await g.say('k', 'Marron sur la phase, bleu sur le neutre, vert-jaune à la terre. Les bases.');
    }
    busy = false;
  }

  const mini = {
    pointer(kind, x, y) {
      if (busy) return false; // un texte est affiché : le toucher sert à le faire avancer
      if (kind === 'down') {
        if (x >= BTN.x && x < BTN.x + BTN.w && y >= BTN.y && y < BTN.y + BTN.h) { sel = 3; validate(); return true; }
        // attraper le bout d'un fil (libre ou branché), ou le fil lui-même près de la gaine
        let best = -1, bd = 18;
        for (let i = 0; i < 3; i++) {
          const [ex, ey] = endPos(i), d = Math.hypot(x - ex, y - ey);
          if (d < bd) { bd = d; best = i; }
          if (best < 0 && x < LOOSE_X + 10 && Math.abs(y - WY[i]) < 10) best = i;
        }
        if (best >= 0) { drag = { i: best, x, y }; sel = best; assign[best] = -1; g.sfx.move(); }
        return true;
      }
      if (kind === 'move' && drag) { drag.x = x; drag.y = y; }
      if (kind === 'up' && drag) {
        const i = drag.i; drag = null;
        const k = x > TERM_X - 26 ? WY.findIndex(wy => Math.abs(y - wy) < 13) : -1;
        if (k >= 0) {
          for (let j = 0; j < 3; j++) if (assign[j] === k) assign[j] = -1; // la borne était prise : on décroche l'ancien fil
          assign[i] = k; g.sfx.clac();
        } else g.sfx.bump(); // lâché dans le vide : le fil reste décroché
      }
      return true;
    },
    update(dt) {
      flash = Math.max(0, flash - dt);
      if (busy || drag) return;
      if (input.take('a')) { sel = 3; validate(); } // A = CONTRÔLER
      if (input.take('b')) mini.finish(false);
    },
    draw(c, t) {
      r(c, 0, 0, 256, 192, '#c8ccd2');
      for (let y = 0; y < 140; y += 12) r(c, 0, y, 256, 1, '#b8bcc4'); // tôle arrière de la machine
      r(c, 0, 0, 256, 20, '#1c2a3c'); textS(c, 'BORNIER DE LA MACHINE', 128, 2, '#fff3c8', 'center');
      // gaine d'arrivée
      r(c, 0, 32, 30, 80, '#2a202c'); r(c, 0, 34, 28, 76, '#55505e'); r(c, 22, 34, 6, 76, '#6a6474');
      // bornier
      r(c, 190, 28, 56, 86, '#2a202c'); r(c, 192, 30, 52, 82, '#f0ece0'); r(c, 192, 30, 52, 2, '#ffffff');
      for (let i = 0; i < 3; i++) {
        const y = WY[i];
        const hot = drag && Math.abs(drag.y - y) < 13 && drag.x > TERM_X - 26;
        r(c, 196, y - 9, 22, 18, hot ? '#f0c830' : '#2a202c'); r(c, 197, y - 8, 20, 16, '#b8a060'); r(c, 201, y - 4, 12, 8, '#3a3a44'); r(c, 204, y - 1, 6, 2, '#8a8a94');
        if (i === 2) { r(c, 228, y - 6, 2, 6, '#2a202c'); r(c, 223, y, 12, 2, '#2a202c'); r(c, 225, y + 3, 8, 2, '#2a202c'); r(c, 227, y + 6, 4, 2, '#2a202c'); }
        else text(c, i ? 'N' : 'L', 229, y - 8, '#2a202c', 'center');
      }
      // fils
      for (let i = 0; i < 3; i++) {
        const y = WY[i], w = WIRES[i], a = assign[i];
        wire(c, 28, y, LOOSE_X - 2, y, w.cols);
        if (drag && drag.i === i) {
          wire(c, LOOSE_X - 2, y, Math.round(drag.x), Math.round(drag.y), w.cols);
          r(c, Math.round(drag.x) - 3, Math.round(drag.y) - 3, 7, 7, '#2a202c'); r(c, Math.round(drag.x) - 2, Math.round(drag.y) - 2, 5, 5, '#d8a040');
        } else if (a >= 0) { wire(c, LOOSE_X - 2, y, TERM_X - 4, WY[a], w.cols); r(c, TERM_X - 4, WY[a] - 2, 8, 5, '#d8c060'); }
        else { // bout dénudé qui pend, avec de petites étincelles
          r(c, LOOSE_X - 3, y - 3, 8, 7, '#2a202c'); r(c, LOOSE_X - 2, y - 2, 6, 5, '#d8a040');
          if (Math.floor(t * 6 + i) % 3 === 0) { r(c, LOOSE_X + 6, y - 4, 1, 1, '#fff8a0'); r(c, LOOSE_X + 8, y + 2, 1, 1, '#fff8a0'); }
        }
      }
      // bouton CONTRÔLER
      const on = Math.floor(t * 2) % 2 === 0 && !assign.includes(-1); // le bouton clignote quand tout est branché
      r(c, BTN.x, BTN.y, BTN.w, BTN.h, '#2a202c');
      r(c, BTN.x + 1, BTN.y + 1, BTN.w - 2, BTN.h - 2, on ? '#e8603c' : '#4f78b0');
      r(c, BTN.x + 1, BTN.y + 1, BTN.w - 2, 1, on ? '#f8a080' : '#8ab0e0');
      text(c, 'CONTRÔLER', BTN.x + BTN.w / 2, BTN.y + 1, '#ffffff', 'center');
      if (flash > 0) { c.globalAlpha = Math.min(1, flash * 2.5); r(c, 0, 0, 256, 192, '#fff8d0'); c.globalAlpha = 1; }
      // aide
      r(c, 0, 142, 256, 50, '#1c2a3c'); r(c, 0, 142, 256, 1, '#a9cbe6');
      const n = assign.filter(a => a >= 0).length;
      const line = n < 3 ? `Fils branchés : ${n}/3` : 'Tout est branché : CONTRÔLER';
      textS(c, line, 128, 144, '#ffffff', 'center');
      text(c, 'Glisse chaque fil sur sa borne', 128, 159, '#a9cbe6', 'center');
      text(c, 'puis touche CONTRÔLER', 128, 173, '#a9cbe6', 'center');
    },
  };
  return mini;
}
