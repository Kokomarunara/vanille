// Mini-jeu du poste électrique, en trois temps :
//  1. consigner dans le bon ordre (séparer, condamner, identifier, vérifier, mettre à la terre) ;
//  2. trouver le fusible HTA fondu (son percuteur est sorti) ;
//  3. remettre les départs sous tension par ordre de priorité (hôpital d'abord).
// Boutons : Haut/Bas ou Gauche/Droite + A. Au doigt : on touche directement la ligne ou le fusible.
import * as input from '../engine/input.js';
import { r } from '../art/tiles.js';
import { text, textS } from '../art/text.js';

const OL = '#2a202c';
const STEPS = ['Séparer : ouvrir l\'interrupteur', 'Condamner : poser le cadenas', 'Identifier l\'ouvrage', 'Vérifier l\'absence de tension', 'Mise à la terre + court-circuit'];
const FEEDERS = ['Départ Hôpital', 'Départ Centre-ville', 'Départ Zone commerciale'];
const HINT_A = ['On commence toujours par couper : la séparation.', 'Une fois ouvert, on verrouille. Sinon quelqu\'un peut refermer.', 'On vérifie qu\'on est bien sur le bon ouvrage.', 'Avant de toucher : la VAT. Toujours.', 'Dernière sécurité : la mise à la terre et en court-circuit.'];
const HINT_C = ['L\'hôpital d\'abord. Toujours les sites prioritaires.', 'Les habitations avant les commerces.', 'Il ne reste plus que la zone commerciale.'];
const shuffle = a => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

export function transfo(g) {
  let stage = 0, sel = 0, busy = false, flash = 0, done = [], rows = shuffle(STEPS.map((_, i) => i));
  const bad = Math.floor(Math.random() * 3); // le fusible fondu
  const list = () => (stage === 0 ? STEPS : FEEDERS);
  const rowY = i => 30 + i * (stage === 0 ? 21 : 30);
  const rowH = () => (stage === 0 ? 19 : 26);

  async function pick() {
    busy = true;
    if (stage === 1) {
      if (sel === bad) {
        g.sfx.win();
        await g.say(null, 'Percuteur sorti, corps noirci : c\'est lui. Ketura le remplace par un fusible neuf.');
        stage = 2; sel = 0; done = []; rows = shuffle([0, 1, 2]);
      } else { flash = .3; g.sfx.bump(); await g.say('t', 'Celui-là est intact. Regarde les percuteurs : le fusible fondu a le sien sorti.'); }
    } else {
      const id = rows[sel], want = done.length;
      if (done.includes(id)) { busy = false; return; }
      if (id === want) {
        done.push(id); g.sfx.clac();
        if (done.length === list().length) {
          g.sfx.win();
          if (stage === 0) { await g.say('t', 'Consignation parfaite. Tu peux intervenir.'); stage = 1; sel = 1; }
          else { await g.say(null, 'Les trois départs sont sous tension.'); mini.finish(true); return; }
        }
      } else { flash = .3; g.sfx.zap(); await g.say('t', (stage === 0 ? HINT_A : HINT_C)[want]); }
    }
    busy = false;
  }

  const mini = {
    pointer(kind, x, y) {
      if (busy) return false;
      if (kind !== 'down') return true;
      if (stage === 1) { for (let i = 0; i < 3; i++) if (Math.abs(x - (64 + i * 64)) < 26 && y > 30 && y < 136) { sel = i; pick(); } }
      else for (let i = 0; i < rows.length; i++) if (y >= rowY(i) && y < rowY(i) + rowH() && x > 6 && x < 250) { sel = i; pick(); }
      return true;
    },
    update(dt) {
      flash = Math.max(0, flash - dt);
      if (busy) return;
      const n = stage === 1 ? 3 : rows.length;
      const prev = input.take('up') || input.take('left'), next = input.take('down') || input.take('right');
      if (prev) { sel = (sel + n - 1) % n; g.sfx.move(); }
      if (next) { sel = (sel + 1) % n; g.sfx.move(); }
      if (input.take('a')) pick();
    },
    draw(c, t) {
      r(c, 0, 0, 256, 192, '#20242e');
      for (let y = 22; y < 142; y += 8) r(c, 0, y, 256, 1, '#262b36');
      r(c, 0, 0, 256, 20, '#1c2a3c');
      textS(c, ['1/3  CONSIGNATION', '2/3  FUSIBLE HTA', '3/3  REMISE SOUS TENSION'][stage], 128, 2, '#fff3c8', 'center');
      if (stage === 1) {
        for (let i = 0; i < 3; i++) {
          const fx = 64 + i * 64, isBad = i === bad, on = i === sel;
          r(c, fx - 22, 30, 44, 106, on ? '#f0c830' : OL); r(c, fx - 20, 32, 40, 102, '#3a4050');
          r(c, fx - 9, 38, 18, 8, '#c8ccd4'); r(c, fx - 9, 112, 18, 8, '#c8ccd4');                        // mâchoires
          r(c, fx - 7, 46, 14, 66, OL); r(c, fx - 6, 47, 12, 64, isBad ? '#b8a890' : '#e8dcc0'); r(c, fx - 6, 47, 3, 64, isBad ? '#d0c0a8' : '#f8f0dc');
          r(c, fx - 6, 62, 12, 8, '#c8443a'); r(c, fx - 6, 90, 12, 2, '#8a8e98');
          if (isBad) { r(c, fx - 4, 72, 8, 14, '#4a4038'); r(c, fx - 2, 76, 5, 6, '#2a2420'); r(c, fx - 2, 120, 4, 9, '#d04848'); r(c, fx - 2, 120, 1, 9, '#f08080'); } // noirci + percuteur sorti
          else r(c, fx - 2, 120, 4, 2, '#d04848');
          text(c, `L${i + 1}`, fx, 18 + 4, '#a9cbe6', 'center');
          if (on) { const b = Math.floor(t * 4) % 2; for (let k = 0; k < 5; k++) r(c, fx - k, 138 - k + b, k * 2 + 1, 1, '#f0c830'); }
        }
      } else {
        rows.forEach((id, i) => {
          const y = rowY(i), h = rowH(), ok = done.includes(id), on = i === sel, rank = done.indexOf(id) + 1;
          r(c, 6, y, 244, h, on ? '#f0c830' : OL);
          r(c, 8, y + 2, 240, h - 4, ok ? '#2f5a48' : '#3a4050'); r(c, 8, y + 2, 240, 1, ok ? '#4a8a6a' : '#565e72');
          r(c, 12, y + Math.floor(h / 2) - 7, 14, 14, ok ? '#50b860' : '#20242e');
          if (ok) text(c, String(rank), 19, y + Math.floor(h / 2) - 9, '#ffffff', 'center');
          text(c, list()[id], 32, y + Math.floor(h / 2) - 9, ok ? '#c8f0d8' : '#ffffff');
          if (stage === 2) { // petit voyant du quartier, à droite
            r(c, 226, y + h / 2 - 5, 14, 10, OL); r(c, 228, y + h / 2 - 3, 4, 6, ok ? '#f8e070' : '#3a3a44'); r(c, 234, y + h / 2 - 3, 4, 6, ok ? '#f8e070' : '#3a3a44');
          }
        });
      }
      if (flash > 0) { c.globalAlpha = Math.min(1, flash * 3); r(c, 0, 0, 256, 192, '#fff8d0'); c.globalAlpha = 1; }
      r(c, 0, 142, 256, 50, '#1c2a3c'); r(c, 0, 142, 256, 1, '#a9cbe6');
      textS(c, ['Choisis les étapes dans l\'ordre', 'Lequel des trois a fondu ?', 'Qui rallumer en premier ?'][stage], 128, 146, '#ffffff', 'center');
      text(c, 'Croix + A, ou touche ton choix', 128, 166, '#a9cbe6', 'center');
    },
  };
  return mini;
}
