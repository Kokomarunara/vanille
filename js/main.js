// Ketoo — Version Vanille. Point d'entrée : écrans, boucle de jeu, écran-titre.
import * as input from './engine/input.js';
import * as dlg from './engine/dialogue.js';
import * as audio from './engine/audio.js';
import * as world from './engine/world.js';
import * as menu from './engine/menu.js';
import { scene } from './engine/scene.js';
import * as story from './story/story.js';
import { r } from './art/tiles.js';
import { disc } from './art/furniture.js';
import { drawTitle } from './art/effects.js';
import rdc from './maps/appart_rdc.js';
import etage from './maps/appart_etage.js';
import rue from './maps/rue.js';
import marche from './maps/marche.js';
import epicerie from './maps/epicerie.js';
import lycee from './maps/lycee.js';
import poste from './maps/poste.js';
import parc from './maps/parc.js';
import './art/storm.js';
import './art/market.js';

const $ = id => document.getElementById(id);
const top = $('screen').getContext('2d'), pad = $('pad').getContext('2d');
top.imageSmoothingEnabled = pad.imageSmoothingEnabled = false;

[rdc, etage, rue, marche, epicerie, lycee, poste, parc].forEach(world.register);
input.init($('top'), $('pad'));
input.onFirstInput(() => { audio.unlock(); if (mode === 'title') audio.music.play('title'); });
if (document.fonts && document.fonts.load) document.fonts.load('16px VT323');

// ---------- Mise à l'échelle : deux écrans empilés (portrait) ou côte à côte (paysage) ----------
function resize() {
  const W = innerWidth - 10, H = innerHeight - 10, g = 6, dpr = window.devicePixelRatio || 1;
  const sp = Math.min(W / 256, (H - g) / 384), sl = Math.min((W - g) / 512, H / 192);
  const land = sl > sp;
  const q = Math.max(2, dpr); // pas d'échelle : demi-pixels au minimum
  const raw = Math.max(sp, sl);
  // petit écran : on prend toute la place ; grand écran : échelle arrondie pour des pixels nets
  const s = raw < 2 ? Math.max(.5, Math.floor(raw * 256) / 256) : Math.floor(raw * q) / q;
  $('ds').classList.toggle('land', land);
  document.documentElement.style.setProperty('--s', s);
}
addEventListener('resize', resize); addEventListener('orientationchange', resize);
resize();

// ---------- Écran du bas : croix directionnelle et boutons ----------
const GLYPH = {
  a: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  b: ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
  m: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  e: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  n: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
  u: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
  s: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  c: ['01110', '10001', '10000', '10000', '10000', '10001', '01110'],
};
function glyph(c, g, x, y, col, s = 2) {
  GLYPH[g].forEach((row, j) => [...row].forEach((v, i) => { if (v === '1') r(c, x + i * s, y + j * s, s, s, col); }));
}
function drawPad(c) {
  r(c, 0, 0, 256, 192, '#e8e2f0');
  for (let y = 0; y < 192; y += 8) for (let x = (y / 8 % 2) * 8; x < 256; x += 16) r(c, x, y, 8, 8, '#e2dbec');
  const { DP, BA, BB } = input, h = input.held;
  // croix
  const D = '#34324a', L = '#4c4a68', P = '#8a6ad0';
  r(c, DP.x - 15, DP.y - 43, 30, 86, '#1c1a2a'); r(c, DP.x - 43, DP.y - 15, 86, 30, '#1c1a2a');
  r(c, DP.x - 13, DP.y - 41, 26, 82, D); r(c, DP.x - 41, DP.y - 13, 82, 26, D);
  r(c, DP.x - 13, DP.y - 41, 26, 2, L); r(c, DP.x - 41, DP.y - 13, 28, 2, L); r(c, DP.x + 13, DP.y - 13, 28, 2, L);
  if (h.has('up')) r(c, DP.x - 13, DP.y - 41, 26, 28, P);
  if (h.has('down')) r(c, DP.x - 13, DP.y + 13, 26, 28, P);
  if (h.has('left')) r(c, DP.x - 41, DP.y - 13, 28, 26, P);
  if (h.has('right')) r(c, DP.x + 13, DP.y - 13, 28, 26, P);
  for (let i = 0; i < 5; i++) {
    r(c, DP.x - i, DP.y - 34 + i, i * 2 + 1, 1, '#cfc8e8'); r(c, DP.x - i, DP.y + 34 - i, i * 2 + 1, 1, '#cfc8e8');
    r(c, DP.x - 34 + i, DP.y - i, 1, i * 2 + 1, '#cfc8e8'); r(c, DP.x + 34 - i, DP.y - i, 1, i * 2 + 1, '#cfc8e8');
  }
  disc(c, DP.x, DP.y, 5, '#28263a');
  // boutons
  const btn = (B, g, col, colD, on) => {
    disc(c, B.x, B.y + 2, B.r, '#1c1a2a'); disc(c, B.x, B.y + (on ? 2 : 0), B.r, '#1c1a2a');
    disc(c, B.x, B.y + (on ? 2 : 0), B.r - 2, on ? colD : col);
    if (!on) disc(c, B.x - 5, B.y - 6, 4, '#ffffff50');
    glyph(c, g, B.x - 5, B.y - 7 + (on ? 2 : 0), '#fff');
  };
  btn(BA, 'a', '#d8506a', '#a83a50', h.has('a'));
  btn(BB, 'b', '#e8a838', '#b88020', h.has('b'));
  // boutons SAC et MENU
  const small = (M, label, mo, col, colD, colL) => {
    const my = M.y + (mo ? 1 : 0);
    r(c, M.x + 2, M.y + 2, M.w - 4, M.h, '#1c1a2a'); r(c, M.x, M.y + 4, M.w, M.h - 4, '#1c1a2a');
    r(c, M.x + 2, my, M.w - 4, M.h - 1, '#1c1a2a'); r(c, M.x, my + 2, M.w, M.h - 5, '#1c1a2a');
    r(c, M.x + 2, my + 2, M.w - 4, M.h - 5, mo ? colD : col); r(c, M.x + 3, my + 2, M.w - 6, 1, mo ? col : colL);
    const x0 = M.x + Math.round((M.w - label.length * 7 + 2) / 2);
    [...label].forEach((g, i) => glyph(c, g, x0 + i * 7, my + 5, '#fff', 1));
  };
  small(input.SB, 'sac', h.has('s') || menu.view() === 'bag', '#b06a3a', '#8a5028', '#e0a070');
  small(input.MB, 'menu', h.has('m') || (menu.isOpen() && menu.view() !== 'bag'), '#4f78b0', '#3a5a8a', '#8ab0e0');
}

// ---------- Écran-titre et lancement ----------
let mode = 'title', last = 0, t = 0;
$('title').classList.add('on');
// Écran-titre : on rappelle si le son est coupé, et comment le remettre
function titleHint() { world.setObjective('A : commencer' + (audio.isMuted() ? '\nSon coupé : MENU > Son' : '')); }
titleHint();

async function start() {
  mode = 'starting';
  audio.unlock();
  // ?test&ch=2 pour sauter à un chapitre : seulement en mode test, pour que Ketura ne puisse pas tricher
  const q = new URLSearchParams(location.search), forced = q.has('test') ? +q.get('ch') : 0;
  let ch = forced || 1, resume = null;
  const sv = story.loadSave(), max = story.unlocked();
  if (!forced && sv && (sv.snap || sv.chapter > 1 || max > 1)) {
    const opts = [sv.chapter > story.LAST ? 'Continuer' : `Continuer (chapitre ${sv.chapter})`, 'Nouvelle partie'];
    if (max > 1) opts.push('Choisir un chapitre');
    const k = await dlg.choose(opts);
    if (k === 0) { ch = sv.chapter; resume = sv.snap ? sv : null; }
    else if (k === 2) {
      const list = chapterList();
      const j = await dlg.choose([...list.map(c => `${c.n}. ${c.title}`), 'Retour']);
      if (j === list.length) { mode = 'title'; return; }
      ch = list[j].n;
    } else ch = 1;
  }
  $('title').classList.remove('on');
  world.W.fade = 1;
  mode = 'game';
  if (resume) story.resumeGame(resume); else story.startChapter(ch);
}

// Chapitres qu'on peut rejouer : tous ceux déjà atteints
function chapterList() {
  const out = [];
  for (let n = 1; n <= story.unlocked(); n++) out.push({ n, title: story.TITLES[n] });
  return out;
}

// Retour à l'écran-titre depuis le menu
function toTitle() {
  story.stop();
  for (const id of ['card', 'banner', 'dlg', 'choices']) $(id).classList.remove('on');
  world.W.fade = 0;
  $('infoLoc').innerHTML = '';
  titleHint();
  $('title').classList.add('on');
  mode = 'title';
  audio.music.play('title');
}

// Rejouer un chapitre depuis le menu
function play(n) {
  story.stop();
  for (const id of ['card', 'banner']) $(id).classList.remove('on');
  world.W.fade = 1;
  story.startChapter(n);
}
menu.setActions({ save: story.saveGame, quit: toTitle, chapters: chapterList, play });
story.onEnd(toTitle);

// ---------- Boucle de jeu ----------
function frame(ts) {
  const dt = Math.min(.05, (ts - last) / 1000 || 0); last = ts;
  step(dt);
  requestAnimationFrame(frame);
}
function step(dt) {
  t += dt;
  world.tick(dt);
  dlg.update(dt);
  if (mode !== 'game') {
    drawTitle(top, t);
    if (mode === 'title' && input.take('a')) start();
  } else if (scene.mini) {
    scene.mini.update(dt);
    if (scene.mini) scene.mini.draw(top, t);
  } else {
    if (menu.isOpen()) menu.update();
    else if (!world.W.lock && !dlg.busy()) {
      if (input.take('m')) menu.open('main');
      else if (input.take('s')) menu.open('bag');
    }
    world.update(dt);
    world.draw(top);
  }
  drawPad(pad);
  input.endFrame();
}
requestAnimationFrame(frame);

// Pour les tests depuis la console. turbo(n) fait tourner n images sans attendre l'affichage.
const tickCh = new MessageChannel();
const yieldNow = () => new Promise(res => { tickCh.port1.onmessage = res; tickCh.port2.postMessage(0); });
async function turbo(n = 60) { for (let i = 0; i < n; i++) { step(1 / 60); await yieldNow(); } }
window.game = { world, dlg, input, story, scene, turbo };
