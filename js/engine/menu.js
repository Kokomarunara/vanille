// Deux fenêtres qui partagent le même cadre :
//  - le SAC (bouton SAC, touche I) : porte-monnaie et objets ;
//  - le MENU (bouton MENU, touche M) : Sauvegarder, Chapitres, Écran-titre, Fermer.
// Tout se pilote aux boutons ou en touchant directement les lignes.
import * as input from './input.js';
import * as dlg from './dialogue.js';
import { sfx, isMuted, setMuted } from './audio.js';
import { S, euros } from './state.js';
import { W } from './world.js';

const el = document.getElementById('menu'), body = document.getElementById('menuBody'),
  titleEl = document.getElementById('menuTitle'), hint = document.querySelector('#menu .hint');
const OPTS = ['Sauvegarder', 'Chapitres', 'Son', 'Écran-titre', 'Fermer'];
const label = o => (o === 'Son' ? `Son : ${isMuted() ? 'non' : 'oui'}` : o);
let on = false, mode = 'main', sel = 0, bagSel = 0, chSel = 0, busy = false;
let actions = { save: () => true, quit: () => {}, chapters: () => [], play: () => {} };

export const isOpen = () => on;
export const view = () => (on ? mode : null);
export function setActions(a) { actions = a; }

const row = (i, cur, inner) => `<div class="row item${i === cur ? ' sel' : ''}" data-i="${i}">${inner}</div>`;

function render() {
  if (mode === 'bag') {
    titleEl.innerHTML = '<span>SAC</span>';
    bagSel = Math.max(0, Math.min(bagSel, S.bag.length - 1));
    const items = S.bag.length
      ? S.bag.map((it, i) => row(i, bagSel, `<span>${it.name}</span><span>×${it.qty}</span>`)).join('')
      : '<div class="row item"><span>(vide)</span></div>';
    body.innerHTML = `<div class="row money"><span>Porte-monnaie</span><span>${euros(S.money)}</span></div>` +
      `<div class="list">${items}</div><div class="desc"><span>${S.bag[bagSel] ? S.bag[bagSel].desc : ''}</span></div>`;
    hint.innerHTML = '<span>B : fermer</span>';
  } else if (mode === 'main') {
    titleEl.innerHTML = '<span>MENU</span>';
    body.innerHTML = '<div class="list opts">' + OPTS.map((o, i) => row(i, sel, `<span>${label(o)}</span>`)).join('') + '</div>';
    hint.innerHTML = '<span>A : choisir   B : fermer</span>';
  } else {
    titleEl.innerHTML = '<span>CHAPITRES</span>';
    const list = actions.chapters();
    body.innerHTML = '<div class="list opts">' + (list.length ? list.map((c, i) => row(i, chSel, `<span>${c.n}. ${c.title}</span>`)).join('') : '<div class="row item"><span>Aucun chapitre terminé pour l\'instant.</span></div>') + '</div>';
    hint.innerHTML = '<span>A : rejouer   B : retour</span>';
  }
}

function back() { if (mode === 'chapters') { mode = 'main'; render(); sfx.move(); } else close(); }

// Toucher une ligne = la choisir (et la valider)
body.addEventListener('pointerdown', e => {
  e.stopPropagation(); e.preventDefault();
  if (!on || busy || dlg.busy()) return;
  const r = e.target.closest('[data-i]');
  if (!r) return;
  const i = +r.dataset.i;
  if (mode === 'bag') { bagSel = i; render(); sfx.move(); }
  else if (mode === 'main') { sel = i; render(); pick(); }
  else { chSel = i; render(); replay(); }
});
hint.addEventListener('pointerdown', e => { // toucher l'aide = retour / fermer
  e.stopPropagation(); e.preventDefault();
  if (on && !busy && !dlg.busy()) back();
});

export function open(m = 'main') {
  if (on) return;
  on = true; W.lock++; mode = m; sel = 0; bagSel = 0; chSel = 0;
  render(); el.classList.add('on'); sfx.ok();
}
function close() { if (!on) return; on = false; W.lock--; el.classList.remove('on'); sfx.move(); }

async function pick() {
  sfx.ok();
  if (sel === 1) { mode = 'chapters'; chSel = 0; render(); return; }
  if (sel === 2) { setMuted(!isMuted()); render(); return; }
  if (sel === 4) { close(); return; }
  busy = true;
  if (sel === 0) {
    await dlg.say(null, actions.save() ? 'Partie sauvegardée !' : 'Impossible de sauvegarder sur cet appareil.');
  } else {
    await dlg.say(null, 'Revenir à l\'écran-titre ? Ce qui n\'est pas sauvegardé sera perdu.');
    const k = await dlg.choose(['Sauvegarder et revenir', 'Revenir sans sauvegarder', 'Annuler']);
    if (k < 2) {
      if (k === 0) actions.save();
      busy = false; close(); actions.quit(); return;
    }
  }
  busy = false;
}

async function replay() {
  const c = actions.chapters()[chSel];
  if (!c) return;
  sfx.ok(); busy = true;
  await dlg.say(null, `Rejouer le chapitre ${c.n} ? Ce qui n'est pas sauvegardé sera perdu.`);
  const k = await dlg.choose(['Rejouer', 'Annuler']);
  busy = false;
  if (k === 0) { close(); actions.play(c.n); }
}

export function update() {
  if (!on || busy || dlg.busy()) return;
  const n = mode === 'bag' ? S.bag.length : mode === 'main' ? OPTS.length : actions.chapters().length;
  const step = d => {
    if (!n) return;
    if (mode === 'bag') bagSel = (bagSel + d + n) % n; else if (mode === 'main') sel = (sel + d + n) % n; else chSel = (chSel + d + n) % n;
    render(); sfx.move();
  };
  if (input.take('up')) step(-1);
  if (input.take('down')) step(1);
  if (input.take('a')) { if (mode === 'main') pick(); else if (mode === 'chapters') replay(); }
  else if (input.take('b')) back();
  else if (input.take('m')) { if (mode === 'bag') { mode = 'main'; sel = 0; render(); sfx.ok(); } else close(); }
  else if (input.take('s')) { if (mode !== 'bag') { mode = 'bag'; bagSel = 0; render(); sfx.ok(); } else close(); }
}
