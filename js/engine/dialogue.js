// Boîte de dialogue (texte « machine à écrire ») et menus de choix.
import * as input from './input.js';
import { sfx } from './audio.js';

const $ = id => document.getElementById(id);
const box = $('dlg'), nameEl = $('dlgName'), shownEl = $('dlgShown'), hiddenEl = $('dlgHidden'),
  arrow = $('dlgArrow'), choiceEl = $('choices');

// Qui parle : clé -> nom affiché et couleur de l'onglet
export const WHO = {
  k: { name: 'Ketura', color: '#8c2f39' },
  a: { name: 'Antoine', color: '#2b3a67' },
};

let cur = null, ch = null, blipT = 0;

let placer = null;
export function setPlacer(fn) { placer = fn; }
function place() {
  const top = !!(placer && placer());
  box.classList.toggle('top', top); choiceEl.classList.toggle('top', top);
}

export function busy() { return !!cur || !!ch; }

export function say(who, text) {
  return new Promise(res => {
    cur = { text, n: 0, res };
    if (!box.classList.contains('on')) place();
    const w = WHO[who];
    nameEl.classList.toggle('on', !!w);
    if (w) { nameEl.innerHTML = `<span>${w.name}</span>`; nameEl.style.background = w.color; }
    box.style.borderColor = w ? w.color : '';
    shownEl.textContent = ''; hiddenEl.textContent = text;
    arrow.classList.remove('on');
    box.classList.add('on');
  });
}

// Lignes « k: ... » (Ketura), « a: ... » (Antoine), sinon narration.
export async function lines(list) {
  for (const l of list) {
    const m = /^([a-z]):\s*(.*)$/s.exec(l);
    if (m && WHO[m[1]]) await say(m[1], m[2]); else await say(null, l);
  }
}

export function choose(opts) {
  return new Promise(res => {
    ch = { opts, i: 0, res };
    choiceEl.innerHTML = '';
    opts.forEach((o, i) => {
      const d = document.createElement('div');
      d.innerHTML = `<span>${o}</span>`;
      d.addEventListener('pointerdown', e => { e.stopPropagation(); e.preventDefault(); pick(i); });
      choiceEl.appendChild(d);
    });
    renderChoice();
    choiceEl.classList.add('on');
  });
}
function renderChoice() { [...choiceEl.children].forEach((d, i) => d.classList.toggle('sel', i === ch.i)); }
function pick(i) {
  if (!ch) return;
  const r = ch.res; ch = null;
  choiceEl.classList.remove('on');
  sfx.ok();
  // la boîte de texte de la question reste affichée jusqu'au prochain say()
  r(i);
}

function close() {
  const r = cur.res; cur = null;
  // La boîte n'est pas masquée ici : c'est update() qui la ferme à l'image suivante si rien n'a pris
  // le relais. Ainsi, quand un choix suit une question, la question reste affichée pendant qu'on choisit.
  r();
}

export function update(dt) {
  // Garde-fou : si plus personne ne parle et qu'aucun choix n'est ouvert, la boîte se ferme toujours
  // (sinon, après un choix qui n'est suivi d'aucun texte — « Annuler » par exemple — elle restait affichée pour rien).
  if (!cur && !ch) {
    if (box.classList.contains('on')) box.classList.remove('on');
    if (choiceEl.classList.contains('on')) choiceEl.classList.remove('on');
    return;
  }
  if (ch) {
    if (input.take('up')) { ch.i = (ch.i + ch.opts.length - 1) % ch.opts.length; renderChoice(); sfx.move(); }
    if (input.take('down')) { ch.i = (ch.i + 1) % ch.opts.length; renderChoice(); sfx.move(); }
    if (input.take('a')) pick(ch.i);
    input.pressed.delete('b');
    return;
  }
  if (!cur) return;
  const len = cur.text.length;
  const a = input.take('a') || input.take('b');
  if (cur.n < len) {
    cur.n = a ? len : Math.min(len, cur.n + dt * 48);
    const k = Math.floor(cur.n);
    shownEl.textContent = cur.text.slice(0, k); hiddenEl.textContent = cur.text.slice(k);
    blipT -= dt; if (blipT <= 0 && !a) { sfx.text(); blipT = 0.06; }
    if (cur.n >= len) arrow.classList.add('on');
  } else if (a) {
    sfx.ok(); close();
  }
}
