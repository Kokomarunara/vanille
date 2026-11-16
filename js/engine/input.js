// Entrées unifiées : clavier (ZQSD / flèches), souris et tactile sur l'écran du bas.
// Boutons logiques : up, down, left, right, a, b.

export const held = new Set();
export const pressed = new Set(); // fronts montants, vidés à chaque image
const dirStack = [];
const DIRS = ['up', 'down', 'left', 'right'];

// Géométrie des commandes sur l'écran du bas (en pixels du jeu, 256x192)
export const DP = { x: 62, y: 124, r: 44 };
export const BA = { x: 214, y: 110, r: 20 };
export const BB = { x: 174, y: 146, r: 20 };

// e.code = position physique : KeyW est la touche Z d'un clavier AZERTY, KeyA la touche Q.
const KEY = {
  KeyW: 'up', ArrowUp: 'up', KeyS: 'down', ArrowDown: 'down',
  KeyA: 'left', ArrowLeft: 'left', KeyD: 'right', ArrowRight: 'right',
  Space: 'a', Enter: 'a', KeyE: 'a',
  ShiftLeft: 'b', ShiftRight: 'b', KeyB: 'b',
  KeyM: 'm', Semicolon: 'm', Escape: 'm', // Semicolon = la touche M d'un clavier AZERTY
  KeyI: 's', Tab: 's',                     // I comme Inventaire
};
export const SB = { x: 70, y: 170, w: 48, h: 17 };  // bouton SAC
export const MB = { x: 138, y: 170, w: 48, h: 17 }; // bouton MENU

// Gestionnaire tactile de l'écran du haut (mini-jeux) : (type, x, y) => true si le geste est pris en charge
let topHandler = null;
export function setTopHandler(fn) { topHandler = fn; }

let onFirst = null;
export function onFirstInput(fn) { onFirst = fn; }
function first() { if (onFirst) { const f = onFirst; onFirst = null; f(); } }

function down(b) {
  if (!b || held.has(b)) return;
  held.add(b); pressed.add(b);
  if (DIRS.includes(b)) dirStack.push(b);
}
function up(b) {
  if (!b) return;
  held.delete(b);
  const i = dirStack.indexOf(b);
  if (i >= 0) dirStack.splice(i, 1);
}
// Direction maintenue, ou à défaut une direction tapée très brièvement pendant cette image
export function dir() { return dirStack[dirStack.length - 1] || DIRS.find(d => pressed.has(d)) || null; }
export function take(b) { if (pressed.has(b)) { pressed.delete(b); return true; } return false; }
export function endFrame() { pressed.clear(); }

function hit(x, y) {
  for (const [B, k] of [[SB, 's'], [MB, 'm']])
    if (x >= B.x - 4 && x < B.x + B.w + 4 && y >= B.y - 5 && y < B.y + B.h + 5) return k;
  let dx = x - DP.x, dy = y - DP.y, d = Math.hypot(dx, dy);
  if (d < DP.r + 10) {
    if (d < 6) return null;
    return Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down');
  }
  if (Math.hypot(x - BA.x, y - BA.y) < BA.r + 7) return 'a';
  if (Math.hypot(x - BB.x, y - BB.y) < BB.r + 7) return 'b';
  return null;
}

export function init(topEl, padCanvas) {
  addEventListener('keydown', e => {
    const b = KEY[e.code];
    if (!b) return;
    e.preventDefault(); first();
    if (!e.repeat) down(b);
  });
  addEventListener('keyup', e => up(KEY[e.code]));
  addEventListener('blur', () => { for (const b of [...held]) up(b); ptrs.clear(); });

  const ptrs = new Map();
  const pos = e => {
    const r = padCanvas.getBoundingClientRect();
    return [(e.clientX - r.left) / r.width * 256, (e.clientY - r.top) / r.height * 192];
  };
  const set = (id, b) => {
    const old = ptrs.get(id);
    if (old === b) return;
    ptrs.set(id, b);
    if (old && ![...ptrs.values()].includes(old)) up(old);
    down(b);
  };
  const release = e => {
    if (!ptrs.has(e.pointerId)) return;
    const old = ptrs.get(e.pointerId);
    ptrs.delete(e.pointerId);
    if (old && ![...ptrs.values()].includes(old)) up(old);
  };
  padCanvas.addEventListener('pointerdown', e => {
    e.preventDefault(); first();
    try { padCanvas.setPointerCapture(e.pointerId); } catch (_) {}
    set(e.pointerId, hit(...pos(e)));
  });
  padCanvas.addEventListener('pointermove', e => {
    if (ptrs.has(e.pointerId)) set(e.pointerId, hit(...pos(e)));
  });
  padCanvas.addEventListener('pointerup', release);
  padCanvas.addEventListener('pointercancel', release);

  // Toucher l'écran du haut = bouton A (faire avancer un dialogue),
  // sauf si un mini-jeu veut le doigt (tracer des fils, toucher un disjoncteur...)
  const tpos = e => {
    const r = topEl.getBoundingClientRect();
    return [(e.clientX - r.left) / r.width * 256, (e.clientY - r.top) / r.height * 192];
  };
  let dragging = false;
  topEl.addEventListener('pointerdown', e => {
    e.preventDefault(); first();
    if (topHandler && topHandler('down', ...tpos(e))) {
      dragging = true;
      try { topEl.setPointerCapture(e.pointerId); } catch (_) {}
      return;
    }
    pressed.add('a');
  });
  topEl.addEventListener('pointermove', e => { if (dragging && topHandler) topHandler('move', ...tpos(e)); });
  const endTop = e => { if (!dragging) return; dragging = false; if (topHandler) topHandler('up', ...tpos(e)); };
  topEl.addEventListener('pointerup', endTop);
  topEl.addEventListener('pointercancel', endTop);

  for (const ev of ['touchstart', 'touchmove', 'touchend', 'gesturestart', 'contextmenu', 'dblclick'])
    document.addEventListener(ev, e => e.preventDefault(), { passive: false });
}
