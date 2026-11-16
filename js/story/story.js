// Chef d'orchestre de l'histoire : lance les chapitres, sauvegarde et reprend une partie.
import * as world from '../engine/world.js';
import { W, api } from '../engine/world.js';
import { playMini } from '../engine/scene.js';
import { S, addItem, removeItem, hasItem, resetState } from '../engine/state.js';
import ch1 from './chapitre1.js';
import ch2 from './chapitre2.js';
import ch3 from './chapitre3.js';
import ch4 from './chapitre4.js';
import ch5 from './chapitre5.js';
import { WHO } from '../engine/dialogue.js';
import { music } from '../engine/audio.js';
import etageMap from '../maps/appart_etage.js';

// Décor qui dépend du chapitre : au chapitre 1, le bureau de Ketura est encore vide
// (jusqu'à la fin du chapitre du ménage, ses affaires sont encore dans les cartons)
function decor(n) { etageMap.objects.find(o => o.id === 'deskK').v = n === 1 ? 'vide' : 'elec'; }

// Les premiers jours. Chapitre 1 : rien n'est encore déballé. Chapitre 2 : Ketura a tout rangé pendant la nuit,
// mais elle n'a pas encore récuré la douche.
const AVANT = {
  deskK: { jusqua: 1, text: ['Un bureau vide, au fond du renfoncement.', 'k: Mes cours iront là. Quand j\'aurai défait les cartons.'] },
  wardrobeK: { jusqua: 1, text: ['L\'armoire à vêtements de Ketura.', 'k: Encore vide. Mes habits sont toujours dans les cartons.'] },
  shower: { jusqua: 2, text: ['La douche.', 'k: Hmm. Elle mérite un sérieux coup d\'éponge.'] },
};
const avant = id => (AVANT[id] && S.chapter <= AVANT[id].jusqua ? () => api.lines(AVANT[id].text) : null);

const chapters = { 1: ch1, 2: ch2, 3: ch3, 4: ch4, 5: ch5 };
export const LAST = 5; // dernier chapitre jouable pour l'instant
export const TITLES = { 1: 'La nouvelle coloc', 2: 'Opération Propreté', 3: 'Un goût d\'Haïti', 4: 'La chambre en plus', 5: 'Tempête sur le réseau' };
let cur = null;

// Carton de titre plein écran (« Chapitre 1 — ... »)
// Fondu de la musique vers le silence ; elle reprend (avec celle du lieu) à la fin du carton de chapitre
// Fondu de la musique vers le silence (coucher, fin de chapitre)
const FADE_OUT = .8;
function fadeMusic(sec = FADE_OUT) { W.musicHold = true; music.fadeOut(sec); }
// Coupure nette (on vient de choisir « Nouvelle partie », « Continuer » ou un chapitre)
function cutMusic() { W.musicHold = true; music.play(null); }

async function card(small, big) {
  if (!W.musicHold) cutMusic();
  const el = document.getElementById('card');
  el.innerHTML = `<div class="c1"><span>${small}</span></div><div class="c2"><span>${big}</span></div>`;
  el.classList.add('on');
  await world.wait(2.4);
  el.classList.remove('on');
  world.showBanner(); // le nom du lieu s'affiche quand le décor apparaît (il était caché sous le titre)
  W.musicHold = false; // le décor apparaît : la musique du lieu démarre tout de suite
}

// ---------- Sauvegarde ----------
// { chapter } seul = reprendre au début du chapitre ; avec snap = reprendre pile où on en était.
// ?test dans l'adresse : sauvegarde à part, pour essayer le jeu sans toucher à la vraie partie
const TEST = /[?&]test/.test(location.search) ? '-test' : '';
const KEY = 'ketoo-save' + TEST;
export function loadSave() { try { return JSON.parse(localStorage.getItem(KEY)); } catch (_) { return null; } }
function write(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); return true; } catch (_) { return false; } }

// Chapitres atteints : mémorisés à part, ils ne diminuent jamais (même si on rejoue un ancien chapitre)
const PKEY = 'ketoo-progress' + TEST;
export function unlocked() {
  let m = 1;
  try { m = (JSON.parse(localStorage.getItem(PKEY)) || {}).max || 1; } catch (_) {}
  const sv = loadSave();
  if (sv && sv.chapter > m) m = sv.chapter; // anciennes sauvegardes
  return Math.min(LAST, m);
}
function unlock(n) {
  try { if (n > ((JSON.parse(localStorage.getItem(PKEY)) || {}).max || 1)) localStorage.setItem(PKEY, JSON.stringify({ max: n })); } catch (_) {}
}

export function saveGame() {
  if (!cur || !cur.getState || !W.map) return write({ chapter: S.chapter });
  return write({
    chapter: S.chapter,
    snap: {
      st: cur.getState(), map: W.map.id, x: W.p.x, y: W.p.y, dir: W.p.dir, carry: W.p.carry || null,
      obj: document.getElementById('infoObj').textContent, dark: W.dark, money: S.money, bag: S.bag,
    },
  });
}

function resetWorld() {
  Object.assign(W, { hud: null, tickHook: null, frozen: false, noRun: false, walkDur: .22, dark: 0, cloud: null, hearts: null, weather: null, tint: null, look: 'ketura', dlgTop: null, musicOverride: null });
  if (W.p) W.p.carry = null;
}

// Antoine devient « Chou » après le premier bisou (fin du chapitre 4)
function applyNames(n) { WHO.a.name = n >= 5 ? 'Chou' : 'Antoine'; }

export async function resumeGame(d) {
  const s = d.snap;
  cutMusic(); // on coupe net la musique du menu
  applyNames(d.chapter); decor(d.chapter);
  S.chapter = d.chapter; S.money = s.money; S.bag = s.bag;
  resetWorld();
  cur = chapters[d.chapter];
  await world.run(async () => {
    W.fade = 1;
    cur.resume(api, s.st);
    world.load(s.map, s.x, s.y, s.dir);
    W.p.carry = s.carry; W.dark = s.dark;
    world.setObjective(s.obj);
    if (cur.afterResume) cur.afterResume();
    world.refresh();
    await world.wait(.6);
    W.musicHold = false; // le décor apparaît : la musique du lieu démarre
    await world.fadeTo(0, .8);
  });
}

export async function startChapter(n) {
  cutMusic();
  resetState(); // chaque chapitre repart avec le sac et le porte-monnaie de départ
  applyNames(n); decor(n);
  S.chapter = n; write({ chapter: n }); unlock(n); // sauvegarde automatique au début de chaque chapitre
  resetWorld();
  cur = chapters[n] || null;
  if (cur) { await world.run(() => cur.start(api)); return; }
  // Chapitres pas encore écrits : balade libre
  await world.run(async () => {
    world.load('rdc', 12, 10, 'right');
    await card('À suivre', `Chapitre ${n} — ${TITLES[n] || ''}`);
    await world.fadeTo(0, .5);
    await api.lines(['La suite de l\'histoire arrive bientôt.', '(En attendant, tu peux te balader dans l\'appart et dans la rue.)']);
    world.setObjective(`Chapitre ${n} : à venir`);
  });
}

// Retour à l'écran-titre : on oublie le chapitre en cours (la sauvegarde reste)
export function stop() { W.musicHold = false; cur = null; resetWorld(); W.map = null; W.npcs = []; }

// Fin du jeu : retour à l'écran-titre (branché par main.js)
let endFn = null;
export function onEnd(fn) { endFn = fn; }
const endGame = () => { if (endFn) endFn(); };

Object.assign(api, { fadeMusic, card, playMini, S, addItem, removeItem, hasItem, startChapter, endGame });

W.story = {
  objects: id => (cur && cur.objects ? cur.objects(id) : []),
  npcs: id => (cur ? (cur.npcs ? cur.npcs(id) : []) : id === 'rdc' ? [{ id: 'antoine', look: 'antoine', x: 14, y: 10, dir: 'left', talk: g => g.lines(['a: La suite arrive bientôt, Chou.']) }] : []),
  act: (id, o) => (cur && cur.act && cur.act(id, o)) || avant(id),
  touch: (id, o) => cur && cur.touch && cur.touch(id, o),
  step: (map, x, y) => cur && cur.step && cur.step(map, x, y),
  enter: id => cur && cur.enter && cur.enter(id),
  // passages fermés selon le moment de l'histoire (le marché n'ouvre qu'au chapitre 3)
  gate: wp => {
    if (!cur) return null;
    if (cur.gate) return cur.gate(wp);
    if (wp.to === 'marche') return () => api.lines(['k: Le marché, ce sera pour un autre jour.']);
    if (wp.to === 'poste') return () => api.lines(['Au bout de la rue, on aperçoit le poste électrique du quartier.', 'k: Rien à faire là-bas pour l\'instant.']);
    return null;
  },
};
