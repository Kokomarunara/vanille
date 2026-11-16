// Exploration : carte en tuiles, déplacement case par case, PNJ, objets, passages.
import * as input from './input.js';
import * as dlg from './dialogue.js';
import { sfx, music } from './audio.js';
import { drawTile, isSolid, r } from '../art/tiles.js';
import { drawObject } from '../art/furniture.js';
import { sprite } from '../art/sprites.js';
import { drawLeaves } from '../art/effects.js';

export const W = {
  map: null, p: null, npcs: [], camx: 0, camy: 0, fade: 1, t: 0, lock: 0,
  story: null,      // { objects(mapId), npcs(mapId), act(id, o), touch(id, o), step(mapId, x, y), enter(mapId) }
  hud: null,        // fonction de dessin par-dessus la carte
  tickHook: null,   // appelée à chaque image pendant l'exploration
  frozen: false, noRun: false, walkDur: .22,
  dark: 0, cloud: null, parts: [],
};
const maps = {};
const DV = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const OPP = { up: 'down', down: 'up', left: 'right', right: 'left' };

export function register(m) { maps[m.id] = m; }

// ---------- petites attentes asynchrones pilotées par la boucle de jeu ----------
const timers = [];
export function wait(s) { return new Promise(res => timers.push({ t: s, res })); }
let fadeJob = null;
export function fadeTo(v, dur = .3) {
  return new Promise(res => { fadeJob = { from: W.fade, to: v, t: 0, dur, res }; });
}
// Exécute un script en bloquant les commandes du joueur
export async function run(fn) {
  W.lock++;
  try { await fn(api); } catch (e) { console.error(e); } finally { W.lock--; }
}

function mkChar(look, x, y, dir) {
  return { look, x, y, px: x * 16, py: y * 16, dir: dir || 'down', mv: null, steps: 0 };
}

function build(m) {
  m.w = m.rows[0].length; m.h = m.rows.length;
  const cv = document.createElement('canvas'); cv.width = m.w * 16; cv.height = m.h * 16;
  const c = cv.getContext('2d');
  for (let y = 0; y < m.h; y++) for (let x = 0; x < m.w; x++) drawTile(c, m, x, y);
  m.solid = [];
  for (const o of m.objects) {
    o.w = o.w || 1; o.h = o.h || 1;
    if (o.flat) drawObject(c, o, o.x * 16, o.y * 16, 0); else m.solid.push(o);
  }
  m.layer = cv;
}

// Recalcule objets et PNJ de la carte courante d'après l'état de l'histoire
export function refresh() {
  const m = W.map, st = W.story;
  const dyn = (st && st.objects && st.objects(m.id)) || [];
  for (const o of dyn) { o.w = o.w || 1; o.h = o.h || 1; }
  m.all = [...m.solid, ...dyn];
  m.block = Array.from({ length: m.h }, () => Array(m.w).fill(null));
  for (const o of m.all) if (!o.spot)
    for (let y = o.y; y < o.y + o.h; y++) for (let x = o.x; x < o.x + o.w; x++) if (m.block[y]) m.block[y][x] = o;
  const defs = (st && st.npcs && st.npcs(m.id)) || [];
  W.npcs = defs.map(d => {
    const e = W.npcs.find(n => n.id === d.id);
    if (e) { e.def = d; return e; }
    return Object.assign(mkChar(d.look, d.x, d.y, d.dir), { id: d.id, def: d });
  });
}

export function load(id, x, y, dir) {
  const m = maps[id];
  if (!m.layer) build(m);
  const old = W.p;
  W.map = m;
  W.p = mkChar(W.look || 'ketura', x, y, dir);
  if (old) W.p.carry = old.carry;
  W.npcs = []; W.parts = [];
  refresh();
  camera();
  banner(m.name);
  document.getElementById('infoLoc').innerHTML = `<span>${m.name}</span>`;
}

let bannerT = 0;
// Bandeau du lieu, en haut à gauche (reste 3,5 s ; réaffiché après le titre d'un chapitre)
export function showBanner() { if (W.map) banner(W.map.name); }
function banner(txt) {
  const b = document.getElementById('banner');
  b.innerHTML = `<span>${txt}</span>`; b.classList.add('on'); bannerT = 3.5;
}

export function setObjective(txt) { document.getElementById('infoObj').innerHTML = `<span>${txt}</span>`; }

export async function warp(id, x, y, dir) {
  await run(async () => {
    sfx.door();
    await fadeTo(1, .25);
    load(id, x, y, dir);
    await fadeTo(0, .25);
    const h = W.story && W.story.enter && W.story.enter(id);
    if (h) await h(api);
  });
}

// ---------- personnages ----------
export const npc = id => W.npcs.find(n => n.id === id);
const npcAt = (x, y) => W.npcs.find(n => n.x === x && n.y === y);
function blocked(x, y) {
  const m = W.map;
  if (x < 0 || y < 0 || x >= m.w || y >= m.h) return true;
  return isSolid(m.rows[y][x]) || !!m.block[y][x] || !!npcAt(x, y);
}

// Fait avancer un personnage d'une case (scripts) ; la promesse se résout à l'arrivée.
export function stepChar(ch, dir, dur = .22, run = false) {
  return new Promise(res => {
    const [dx, dy] = DV[dir];
    ch.dir = dir;
    ch.mv = { fx: ch.x, fy: ch.y, k: 0, dur, run, res };
    ch.x += dx; ch.y += dy;
  });
}
// Suite de pas : 'uurrd' = haut, haut, droite, droite, bas
export async function walk(ch, path, dur = .22, run = false) {
  const D = { u: 'up', d: 'down', l: 'left', r: 'right' };
  for (const k of path) await stepChar(ch, D[k], dur, run);
}
export async function emote(ch, kind, time = .9) { ch.emote = kind; await wait(time); ch.emote = null; }
// Petites étincelles sur une case
export function spark(tx, ty, col = '#fff8c0') {
  for (let i = 0; i < 6; i++) W.parts.push({ x: tx * 16 + 2 + Math.random() * 12, y: ty * 16 + 2 + Math.random() * 10, vy: -12 - Math.random() * 14, t: .5 + Math.random() * .3, col });
}

function advance(ch, dt) {
  if (!ch.mv) return false;
  ch.mv.k += dt / ch.mv.dur; ch.steps += dt / ch.mv.dur;
  if (ch.mv.k >= 1) {
    const res = ch.mv.res;
    ch.mv = null; ch.px = ch.x * 16; ch.py = ch.y * 16;
    if (res) res();
    return true;
  }
  ch.px = (ch.mv.fx + (ch.x - ch.mv.fx) * ch.mv.k) * 16; ch.py = (ch.mv.fy + (ch.y - ch.mv.fy) * ch.mv.k) * 16;
  return false;
}

function camera() {
  const m = W.map, p = W.p, mw = m.w * 16, mh = m.h * 16;
  W.camx = mw <= 256 ? Math.floor((mw - 256) / 2) : Math.max(0, Math.min(mw - 256, Math.round(p.px + 8 - 128)));
  W.camy = mh <= 192 ? Math.floor((mh - 192) / 2) : Math.max(0, Math.min(mh - 192, Math.round(p.py + 8 - 96)));
}
// La boîte de dialogue passe en haut quand Ketura est dans le bas de l'écran
// (W.dlgTop permet à une scène de forcer la position : true = en haut, false = en bas)
dlg.setPlacer(() => (W.dlgTop != null ? W.dlgTop : !!W.map && W.p.py - W.camy > 100));

function tryMove(d) {
  const p = W.p, [dx, dy] = DV[d], tx = p.x + dx, ty = p.y + dy;
  p.dir = d;
  if (!blocked(tx, ty)) {
    const run = input.held.has('b') && !W.noRun;
    p.mv = { fx: p.x, fy: p.y, k: 0, dur: run ? .12 : W.walkDur, run, auto: false };
    p.x = tx; p.y = ty;
    return;
  }
  const o = (W.map.block[ty] || [])[tx];
  if (o && !p.bumped) {
    const h = (W.story && W.story.touch && W.story.touch(o.id, o)) || o.touch;
    if (h) run(() => h(api, o));
  }
  p.bumped = true;
}

function interact() {
  const p = W.p, [dx, dy] = DV[p.dir], tx = p.x + dx, ty = p.y + dy, st = W.story;
  const n = npcAt(tx, ty);
  if (n) { n.dir = OPP[p.dir]; if (n.def.talk) run(() => n.def.talk(api, n)); return; }
  const spots = W.map.all.filter(o => o.spot);
  const target = spots.find(o => o.x === tx && o.y === ty) || (W.map.block[ty] || [])[tx] || spots.find(o => o.x === p.x && o.y === p.y);
  if (!target) return;
  const h = (st && st.act && st.act(target.id, target)) || target.act;
  if (h) run(() => h(api, target));
  else if (target.text) run(() => dlg.lines(target.text));
}

// Ce que reçoivent les scripts d'histoire (complété dans story.js)
export const api = {
  W, say: dlg.say, lines: dlg.lines, choose: dlg.choose, wait, warp, fadeTo, setObjective, load,
  refresh, stepChar, walk, emote, spark, npc, sfx, run,
};

// Minuteries et fondus : tournent tout le temps, même pendant un mini-jeu
export function tick(dt) {
  W.t += dt;
  for (let i = timers.length - 1; i >= 0; i--) if ((timers[i].t -= dt) <= 0) timers.splice(i, 1)[0].res();
  if (fadeJob) {
    const f = fadeJob; f.t += dt;
    const k = Math.min(1, f.t / f.dur);
    W.fade = f.from + (f.to - f.from) * k;
    if (k >= 1) { fadeJob = null; f.res(); }
  }
  if (bannerT > 0 && (bannerT -= dt) <= 0) document.getElementById('banner').classList.remove('on');
}

// Musique selon le lieu : silence pendant une panne de courant, thème de tempête sous l'orage
const MUSIC = { rdc: 'home', etage: 'home', lycee: 'home', epicerie: 'town', rue: 'town', marche: 'town', poste: 'town', parc: 'final' };
function tune() {
  if (W.musicHold) return; // fondu en cours ou carton de chapitre : on laisse le silence
  const out = W.map && W.map.fx;
  music.play(W.musicOverride || (W.weather === 'storm' ? 'storm' : W.dark && !out ? null : MUSIC[W.map.id] || 'home'));
}

export function update(dt) {
  if (!W.map) return;
  tune();
  const p = W.p;
  for (const n of W.npcs) { advance(n, dt); if (!n.mv) n.steps = 0; }
  for (let i = W.parts.length - 1; i >= 0; i--) { const q = W.parts[i]; q.y += q.vy * dt; if ((q.t -= dt) <= 0) W.parts.splice(i, 1); }
  if (W.tickHook && !W.lock && !dlg.busy()) W.tickHook(dt);

  const scripted = p.mv && p.mv.res;
  if (advance(p, dt) && !scripted) {
    const wp = (W.map.warps || []).find(w => w.x === p.x && w.y === p.y);
    // l'histoire peut refuser un passage (« pas maintenant ») : Ketura dit pourquoi et recule d'un pas
    const gate = wp && W.story && W.story.gate && W.story.gate(wp);
    if (gate) run(async () => { await gate(api); await stepChar(p, OPP[p.dir]); });
    else if (wp) warp(wp.to, wp.tx, wp.ty, wp.dir);
    else {
      const h = W.story && W.story.step && W.story.step(W.map.id, p.x, p.y);
      if (h) run(() => h(api));
    }
  }
  if (!p.mv && !W.lock && !dlg.busy() && !W.frozen) {
    const d = input.dir();
    if (!d) { p.bumped = false; p.steps = 0; p.turnT = null; p.walking = false; }
    else if (d !== p.dir && !p.walking) {
      // à l'arrêt, une nouvelle direction : on se tourne d'abord (un simple appui ne fait que tourner)
      p.dir = d; p.turnT = 0; p.bumped = false;
    } else if (p.turnT != null && p.turnT < .13) {
      // on vient de se tourner : si la touche reste enfoncée, on se met à marcher juste après
      if (input.held.has(d)) p.turnT += dt; else p.turnT = null;
    } else {
      p.turnT = null;
      tryMove(d);
      p.walking = !!p.mv;
    }
    if (!p.mv && input.take('a')) interact();
  } else if (!p.mv) p.steps = 0;
  camera();
}

// ---------- dessin ----------
function drawEmote(c, kind, x, y) {
  r(c, x, y, 12, 11, '#2a202c'); r(c, x + 1, y + 1, 10, 9, '#ffffff'); r(c, x + 5, y + 11, 2, 2, '#2a202c'); r(c, x + 5, y + 10, 2, 2, '#ffffff');
  const R = '#d83a4a', B = '#3a78d8', K = '#2a202c';
  if (kind === '!') { r(c, x + 5, y + 2, 2, 4, R); r(c, x + 5, y + 7, 2, 2, R); }
  else if (kind === '?') { r(c, x + 4, y + 2, 4, 1, B); r(c, x + 7, y + 3, 1, 2, B); r(c, x + 5, y + 5, 2, 1, B); r(c, x + 5, y + 7, 2, 2, B); r(c, x + 3, y + 3, 1, 1, B); }
  else if (kind === '...') { r(c, x + 2, y + 5, 2, 2, K); r(c, x + 5, y + 5, 2, 2, K); r(c, x + 8, y + 5, 2, 2, K); }
  else if (kind === 'heart') { r(c, x + 2, y + 3, 3, 3, R); r(c, x + 7, y + 3, 3, 3, R); r(c, x + 3, y + 5, 6, 2, R); r(c, x + 4, y + 7, 4, 1, R); r(c, x + 5, y + 8, 2, 1, R); r(c, x + 3, y + 3, 1, 1, '#ffb0c0'); }
  else if (kind === 'sweat') { r(c, x + 5, y + 2, 2, 2, B); r(c, x + 4, y + 4, 4, 3, B); r(c, x + 5, y + 7, 2, 1, B); r(c, x + 5, y + 4, 1, 1, '#b0d0ff'); }
  else if (kind === 'anger') { r(c, x + 2, y + 2, 3, 1, R); r(c, x + 4, y + 2, 1, 3, R); r(c, x + 7, y + 2, 3, 1, R); r(c, x + 7, y + 2, 1, 3, R); r(c, x + 2, y + 8, 3, 1, R); r(c, x + 4, y + 6, 1, 3, R); r(c, x + 7, y + 8, 3, 1, R); r(c, x + 7, y + 6, 1, 3, R); }
  else if (kind === 'note') { r(c, x + 6, y + 2, 1, 6, K); r(c, x + 7, y + 2, 2, 2, K); r(c, x + 4, y + 6, 3, 3, K); }
}

function drawChar(c, ch) {
  const run = ch.mv && ch.mv.run, ph = Math.floor(ch.steps * 2);
  const f = !ch.mv ? 0 : run ? (ph % 2 ? 'r2' : 'r1') : [1, 0, 2, 0][ph % 4];
  const x = Math.round(ch.px) - W.camx, y = Math.round(ch.py) - W.camy;
  if (ch.ko) { // allongé par terre
    r(c, x - 3, y + 11, 24, 4, 'rgba(30,20,40,.25)');
    c.save(); c.translate(x + 8, y + 8); c.rotate(Math.PI / 2); c.drawImage(sprite(ch.look, 'down', 0), -9, -14); c.restore();
    return;
  }
  if (ch.lie) { // allongé sur un lit, la tête vers le bas de l'écran (côté oreillers)
    c.save(); c.translate(x + 8, y + 6); c.rotate(Math.PI); c.drawImage(sprite(ch.look, 'down', 0), -9, -14); c.restore();
    if (ch.emote) drawEmote(c, ch.emote, x + 2, y - 18);
    return;
  }
  r(c, x + 3, y + 13, 10, 3, 'rgba(30,20,40,.28)'); r(c, x + 5, y + 12, 6, 5, 'rgba(30,20,40,.18)');
  if (run) { // petit nuage de poussière derrière les pieds
    const [dx, dy] = DV[ch.dir], bx = x + 7 - dx * 9, by = y + 12 - dy * 7, k = ph % 2;
    r(c, bx - 1 - k, by + 1 - k, 2, 2, 'rgba(255,255,255,.75)'); r(c, bx + 2 + k, by - 1, 2, 1, 'rgba(255,255,255,.55)'); r(c, bx - dx * 3, by - dy * 3 - 2 * k, 1, 1, 'rgba(255,255,255,.5)');
  }
  const bob = f === 'r2' ? 2 : f ? 1 : 0;
  c.drawImage(sprite(ch.look, ch.dir, f), x - 1, y - 12 - bob);
  if (ch.carry) { // carton porté à bout de bras
    const bx = x + 1, by = y - 20 - bob;
    r(c, bx, by, 14, 11, '#3a2e3a'); r(c, bx + 1, by + 1, 12, 9, '#c89a5e'); r(c, bx + 1, by + 1, 12, 2, '#dcb27a');
    r(c, bx + 6, by + 1, 2, 9, '#ecdcae'); r(c, bx + 1, by + 8, 12, 2, '#a67c45');
    r(c, x + 1, y - 9 - bob, 2, 3, '#8d5a3b'); r(c, x + 13, y - 9 - bob, 2, 3, '#8d5a3b');
  }
  if (ch.emote) drawEmote(c, ch.emote, x + 2, y - 25 - (ch.carry ? 12 : 0));
}

let darkCv = null;
// out = carte extérieure : nuit moins épaisse et halo plus large, pour deviner les bâtiments
function drawDark(c, out) {
  if (!darkCv) { darkCv = document.createElement('canvas'); darkCv.width = 256; darkCv.height = 192; }
  const d = darkCv.getContext('2d'), cx = Math.round(W.p.px) - W.camx + 8, cy = Math.round(W.p.py) - W.camy + 2;
  d.globalCompositeOperation = 'source-over'; d.clearRect(0, 0, 256, 192);
  d.fillStyle = out ? 'rgba(8,6,20,.62)' : 'rgba(8,6,20,.94)'; d.fillRect(0, 0, 256, 192);
  d.globalCompositeOperation = 'destination-out';
  const fl = Math.sin(W.t * 9) > .8 ? 1 : 0;
  d.fillStyle = 'rgba(0,0,0,.45)'; d.beginPath(); d.arc(cx, cy, (out ? 60 : 38) + fl, 0, 7); d.fill();
  d.fillStyle = 'rgba(0,0,0,.9)'; d.beginPath(); d.arc(cx, cy, (out ? 40 : 26) + fl, 0, 7); d.fill();
  c.drawImage(darkCv, 0, 0);
}

function drawCloud(c) {
  const cl = W.cloud, age = W.t - cl.t0, R = Math.min(cl.max || 52, age * 22);
  for (let i = 0; i < 9; i++) {
    const a = i * .7 + W.t * .5, d = i ? R * .6 : 0, rr = Math.max(2, R * (.45 + .12 * Math.sin(W.t * 3 + i)));
    c.fillStyle = i % 2 ? 'rgba(150,200,70,.42)' : 'rgba(120,180,60,.42)';
    const x = Math.round(cl.x - W.camx + Math.cos(a) * d), y = Math.round(cl.y - W.camy + Math.sin(a) * d * .7);
    for (let dy = -rr; dy <= rr; dy += 1) { const w = Math.floor(Math.sqrt(rr * rr - dy * dy)); c.fillRect(x - w, Math.round(y + dy), w * 2, 1); }
  }
}

// Un éclair toutes les sept secondes environ (double flash)
function lightning() { const fl = W.t % 7.3; return fl < .07 || (fl > .16 && fl < .22); }

// Tempête : ciel assombri, pluie oblique, éclairs de temps en temps
function drawStorm(c) {
  r(c, 0, 0, 256, 192, 'rgba(18,22,52,.5)');
  const t = W.t;
  for (let i = 0; i < 70; i++) {
    const sp = 260 + (i % 5) * 40, x = ((i * 53 + t * 90) % 300) - 22, y = ((i * 37 + t * sp) % 210) - 10;
    r(c, Math.round(x), Math.round(y), 1, 3, 'rgba(190,210,255,.55)'); r(c, Math.round(x) - 1, Math.round(y) + 3, 1, 2, 'rgba(190,210,255,.35)');
  }
  for (let i = 0; i < 9; i++) { // éclaboussures au sol
    const ph = (t * 3 + i * .37) % 1, x = (i * 71 + Math.floor(t * 3 + i * .37) * 29) % 256, y = 30 + (i * 43 + Math.floor(t * 3 + i * .37) * 17) % 150;
    if (ph < .4) { r(c, x - 2, y, 1, 1, 'rgba(210,225,255,.6)'); r(c, x + 2, y, 1, 1, 'rgba(210,225,255,.6)'); r(c, x, y - 1, 1, 1, 'rgba(210,225,255,.6)'); }
  }
  if (lightning()) r(c, 0, 0, 256, 192, 'rgba(235,240,255,.5)');
}

// Pluie de cœurs qui monte et envahit peu à peu l'écran (W.hearts = { t0 })
function drawHearts(c) {
  const age = W.t - W.hearts.t0, n = Math.min(70, Math.floor(age * 16));
  for (let i = 0; i < n; i++) {
    const big = i % 3 === 0, sp = 26 + (i * 13) % 30;
    const x = (i * 67 + Math.round(Math.sin(W.t * 2 + i) * 4)) % 256, y = 200 - ((age - i / 16) * sp) % 230;
    const col = i % 2 ? '#f06a8a' : '#d83a5a', s = big ? 2 : 1;
    r(c, x, y, 2 * s, 2 * s, col); r(c, x + 3 * s, y, 2 * s, 2 * s, col); r(c, x - s, y + s, 7 * s, 2 * s, col);
    r(c, x, y + 3 * s, 5 * s, s, col); r(c, x + s, y + 4 * s, 3 * s, s, col); r(c, x + 2 * s, y + 5 * s, s, s, col);
    r(c, x, y + s, s, s, '#ffc0d0');
  }
}

export function draw(c) {
  const m = W.map;
  r(c, 0, 0, 256, 192, m ? (m.bg || '#16141c') : '#0c0a14');
  if (m) {
    c.drawImage(m.layer, -W.camx, -W.camy);
    const list = [];
    for (const o of m.all) list.push({ k: o.spot ? -1e5 + o.y : (o.y + o.h) * 16 - (o.back ? 1000 : 0), o });
    // .top : personnage dessiné par-dessus les meubles (allongé sur un lit, assis à table...)
    for (const n of W.npcs) list.push({ k: n.py + 16.5 + (n.top ? 5000 : 0), ch: n });
    list.push({ k: W.p.py + 16.6 + (W.p.top ? 5000 : 0), ch: W.p });
    list.sort((a, b) => a.k - b.k);
    for (const e of list) {
      if (e.ch) drawChar(c, e.ch);
      else drawObject(c, e.o, e.o.x * 16 - W.camx, e.o.y * 16 - W.camy, W.t);
    }
    for (const q of W.parts) { const x = Math.round(q.x) - W.camx, y = Math.round(q.y) - W.camy; r(c, x - 1, y, 3, 1, q.col); r(c, x, y - 1, 1, 3, q.col); }
    // météo : seulement sur les cartes extérieures (celles qui ont un effet « fx »)
    const storm = m.fx && W.weather === 'storm';
    // dehors, pendant la panne : la nuit est dessinée avant la pluie, et chaque éclair éclaire tout un instant
    if (W.dark && storm && !lightning()) drawDark(c, true);
    if (storm) drawStorm(c);
    else if (m.fx === 'leaves') drawLeaves(c, W.t, 1 / 60);
    if (m.fx && W.tint) { c.fillStyle = W.tint; c.fillRect(0, 0, 256, 192); }
    if (W.cloud) drawCloud(c);
    if (W.hearts) drawHearts(c);
    if (W.dark && !storm) drawDark(c, false);
    if (W.hud) W.hud(c);
  }
  if (W.fade > 0) { c.globalAlpha = Math.min(1, Math.ceil(W.fade * 6) / 6); r(c, 0, 0, 256, 192, '#0c0a14'); c.globalAlpha = 1; }
}
