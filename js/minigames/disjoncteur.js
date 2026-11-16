// Mini-jeu : le tableau électrique. Le différentiel a sauté à cause de la machine à laver.
// Il faut couper le départ en défaut AVANT de réarmer le général.
import * as input from '../engine/input.js';
import { r } from '../art/tiles.js';
import { text, textS } from '../art/text.js';

const NAMES = ['Général (différentiel 30 mA)', 'Lumières', 'Prises du salon', 'Cuisine', 'Machine à laver', 'Chauffe-eau'];
const MACHINE = 4, LIGHTS = 1;

// opts.rearm : la machine est réparée, son départ est coupé ; il faut tout remettre en service.
export function disjoncteur(g, opts = {}) {
  const on = opts.rearm ? [true, true, true, true, false, true] : [false, true, true, true, true, true];
  let sel = 0, flash = 0, busy = false, fails = 0;

  async function toggle() {
    busy = true;
    on[sel] = !on[sel]; g.sfx.clac();
    if (opts.rearm) { // plus de défaut : il suffit que tout soit en service
      if (on.every(Boolean)) {
        await g.wait(.35); g.sfx.win();
        await g.say(null, 'Tous les départs sont en service.');
        mini.finish(true); return;
      }
      busy = false; return;
    }
    if (on[0] && on[MACHINE]) { // le défaut est toujours alimenté : ça ressaute
      await g.wait(.3);
      on[0] = false; flash = .35; g.sfx.zap();
      await g.say(null, 'CLAC ! Le différentiel ressaute aussitôt.');
      if (fails++ === 0) await g.say('k', 'Normal. Le défaut est toujours sur le réseau. D\'abord, on isole le circuit fautif.');
      else await g.say('k', 'La machine à laver. C\'est elle qu\'il faut couper d\'abord.');
    } else if (on[0] && !on[LIGHTS]) {
      await g.say(null, 'Le général tient... mais il fait toujours noir. Les lumières sont coupées.');
    } else if (on[0]) {
      await g.wait(.35); g.sfx.win();
      await g.say(null, 'Le différentiel tient. La lumière revient !');
      mini.finish(true); return;
    }
    busy = false;
  }

  const mini = {
    // Toucher un disjoncteur le sélectionne et le bascule
    pointer(kind, x, y) {
      if (busy) return false;
      if (kind !== 'down') return true;
      if (y >= 40 && y < 124) for (let i = 0; i < 6; i++) {
        const w = i ? 24 : 34, bx = i ? 70 + (i - 1) * 32 : 30;
        if (x >= bx - 3 && x < bx + w + 3) { sel = i; toggle(); break; }
      }
      return true;
    },
    update(dt) {
      flash = Math.max(0, flash - dt);
      if (busy) return;
      if (input.take('left')) { sel = (sel + 5) % 6; g.sfx.move(); }
      if (input.take('right')) { sel = (sel + 1) % 6; g.sfx.move(); }
      if (input.take('a')) toggle();
      if (input.take('b')) mini.finish(false);
    },
    draw(c, t) {
      r(c, 0, 0, 256, 192, '#191622');
      // halo de la lampe du téléphone
      for (let i = 0; i < 5; i++) r(c, 12 + i * 6, 12 + i * 5, 232 - i * 12, 150 - i * 10, ['#1f1c2a', '#262334', '#2d2a3d', '#343046', '#3a364e'][i]);
      textS(c, 'TABLEAU ÉLECTRIQUE', 128, 4, '#fff3c8', 'center');
      // coffret
      r(c, 20, 26, 216, 112, '#2a202c'); r(c, 22, 28, 212, 108, '#d8dce0'); r(c, 22, 28, 212, 2, '#f2f4f6'); r(c, 22, 132, 212, 4, '#aab0b8');
      r(c, 28, 52, 200, 6, '#8a9098'); r(c, 28, 104, 200, 6, '#8a9098'); // rail
      for (let i = 0; i < 6; i++) {
        const w = i ? 24 : 34, x = i ? 70 + (i - 1) * 32 : 30, y = 44;
        r(c, x, y, w, 74, '#2a202c'); r(c, x + 1, y + 1, w - 2, 72, '#f4f4f0'); r(c, x + 1, y + 1, w - 2, 2, '#ffffff'); r(c, x + w - 3, y + 1, 2, 72, '#d8d8d2');
        // fenêtre de la manette
        const mx = x + Math.floor(w / 2) - 5;
        r(c, mx, y + 20, 10, 34, '#3a3a44');
        const up = on[i];
        r(c, mx + 1, y + (up ? 22 : 38), 8, 14, i ? '#3a6ad0' : '#d04848'); r(c, mx + 1, y + (up ? 22 : 38), 8, 2, i ? '#7aa0f0' : '#f08080');
        r(c, x + 4, y + 6, w - 8, 8, up ? '#50b860' : '#c03a3a'); // voyant
        text(c, up ? 'I' : 'O', x + w / 2, y + 2, '#ffffff', 'center');
        if (!i) { r(c, x + 12, y + 60, 10, 8, '#e8c040'); text(c, 'T', x + 17, y + 56, '#2a202c', 'center'); }
        text(c, String(i ? i : 'G'), x + w / 2, y + 76, '#2a202c', 'center');
        if (i === MACHINE && !on[0] && flash <= 0 && Math.floor(t * 3) % 2) r(c, x + w - 7, y + 60, 4, 4, '#e8603c'); // trace de chauffe
        if (i === sel) { const b = Math.floor(t * 4) % 2; for (let k = 0; k < 5; k++) r(c, x + w / 2 - k, y - 14 + k + b + (4 - k) * 0, k * 2 + 1, 1, '#f0c830'); r(c, x + w / 2 - 4, y - 16 + b, 9, 2, '#f0c830'); }
      }
      if (flash > 0) { c.globalAlpha = Math.min(1, flash * 3); r(c, 0, 0, 256, 192, '#fff8d0'); c.globalAlpha = 1; }
      r(c, 0, 142, 256, 50, '#1c2a3c'); r(c, 0, 142, 256, 1, '#a9cbe6');
      textS(c, NAMES[sel], 128, 144, '#ffffff', 'center');
      textS(c, on[sel] ? 'EN SERVICE' : 'COUPÉ', 128, 158, on[sel] ? '#90e8a0' : '#f09090', 'center');
      text(c, 'Gauche/Droite: choisir  A: basculer', 128, 174, '#a9cbe6', 'center');
    },
  };
  return mini;
}
