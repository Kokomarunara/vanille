// Son du jeu, entièrement synthétisé (WebAudio) : bruitages et petites musiques originales façon console portable.
// Le contexte audio n'est créé qu'au premier toucher (contrainte d'iOS).
let ac = null, master = null, musicBus = null; // musicBus : volume de la musique seule (pour les fondus)
// Réglage « Son : oui/non » du MENU. Avec ?test dans l'adresse, il est rangé à part (comme la sauvegarde),
// pour que les tests ne coupent jamais le son de la vraie partie.
const SON = 'ketoo-son' + (/[?&]test/.test(location.search) ? '-test' : '');
let muted = false;
try { muted = localStorage.getItem(SON) === 'non'; } catch (_) {}

export function unlock() {
  // Sur iPhone, sans ça, le son est coupé quand le bouton « silencieux » est activé
  try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (_) {}
  if (!ac) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ac = new AC();
    master = ac.createGain(); master.gain.value = muted ? 0 : 1; master.connect(ac.destination);
    musicBus = ac.createGain(); musicBus.connect(master);
  }
  silentPlayer();
  // « suspended » (pas encore autorisé) ou « interrupted » (appel, autre appli sur iPhone) : on relance
  if (ac.state !== 'running') {
    try { ac.resume(); } catch (_) {}
    // Astuce iOS : jouer un son vide pendant le geste débloque définitivement l'audio
    try { const s = ac.createBufferSource(); s.buffer = ac.createBuffer(1, 1, 22050); s.connect(ac.destination); s.start(0); } catch (_) {}
  }
}

// Safari sur iPhone n'autorise le son que pendant un vrai geste : doigt relâché (touchend), clic ou touche.
// Le simple fait de poser le doigt (pointerdown) ne suffit pas. On réessaie donc à chaque geste tant que le son
// n'est pas actif, et on reste à l'écoute : iOS peut couper l'audio après un appel ou un passage dans une autre appli.
export function installUnlock(onReady) {
  const tryUnlock = () => {
    if (ac && ac.state === 'running') return;
    unlock();
    if (onReady) setTimeout(() => { if (ac && ac.state === 'running') onReady(); }, 60);
  };
  for (const ev of ['touchend', 'pointerup', 'click', 'keydown']) window.addEventListener(ev, tryUnlock, { capture: true, passive: true });
}
export const audioState = () => (ac ? ac.state : 'none');

// Avant iOS 17, le bouton « silencieux » de l'iPhone coupe le son des jeux web. Astuce connue : faire jouer
// un vrai lecteur <audio> (ici du silence, en boucle) bascule l'iPhone en mode « lecture », et le son du jeu passe.
let silent = null;
function silentPlayer() {
  if (navigator.audioSession || silent) return; // iOS 17+ : déjà réglé par audioSession
  const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (!ios) return; // inutile ailleurs
  try {
    const n = 4410, buf = new ArrayBuffer(44 + n * 2), v = new DataView(buf); // 0,1 s de silence en WAV
    const w = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
    w(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); w(8, 'WAVEfmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true);
    v.setUint16(22, 1, true); v.setUint32(24, 44100, true); v.setUint32(28, 88200, true); v.setUint16(32, 2, true);
    v.setUint16(34, 16, true); w(36, 'data'); v.setUint32(40, n * 2, true);
    silent = new Audio(URL.createObjectURL(new Blob([buf], { type: 'audio/wav' })));
    silent.loop = true; silent.setAttribute('playsinline', '');
    const p = silent.play(); if (p && p.catch) p.catch(() => { silent = null; }); // refusé : on réessaiera au prochain geste
  } catch (_) { silent = null; }
}
export const isMuted = () => muted;
export function setMuted(v) {
  muted = v;
  try { localStorage.setItem(SON, v ? 'non' : 'oui'); } catch (_) {}
  if (master) master.gain.value = v ? 0 : 1;
}

function blip(freq, dur, type = 'square', vol = 0.05, slide = 0, delay = 0) {
  if (!ac || ac.state !== 'running') return;
  const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + delay;
  o.type = type; o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.linearRampToValueAtTime(Math.max(20, freq + slide), t + dur);
  g.gain.setValueAtTime(vol, t); g.gain.linearRampToValueAtTime(0, t + dur);
  o.connect(g).connect(master); o.start(t); o.stop(t + dur);
}
export const sfx = {
  text: () => blip(880, 0.03, 'square', 0.02),
  ok: () => blip(660, 0.07, 'square', 0.04, 300),
  move: () => blip(520, 0.04, 'square', 0.03),
  bump: () => blip(110, 0.08, 'triangle', 0.08),
  door: () => blip(300, 0.1, 'triangle', 0.07, -120),
  clac: () => { blip(160, 0.05, 'square', 0.09, -100); blip(90, 0.08, 'triangle', 0.1, -40, 0.03); },
  zap: () => { for (let i = 0; i < 5; i++) blip(900 - i * 120, 0.05, 'sawtooth', 0.05, 400, i * 0.045); },
  sparkle: () => { blip(1320, 0.05, 'square', 0.03); blip(1760, 0.06, 'square', 0.03, 0, 0.05); },
  prout: () => { blip(95, 0.5, 'sawtooth', 0.11, -45); blip(70, 0.35, 'square', 0.05, 30, 0.12); },
  win: () => { [523, 659, 784, 1047].forEach((f, i) => blip(f, 0.14, 'square', 0.045, 0, i * 0.11)); },
  rumble: () => { for (let i = 0; i < 8; i++) blip(60 + (i % 2) * 25, 0.09, 'sawtooth', 0.06, 0, i * 0.09); },
};

// ---------- Musiques ----------
// Chaque morceau : un tempo et deux voix (mélodie, basse) écrites pas à pas, en croches.
// « - » = silence ; « _ » = la note précédente continue.
const TRACKS = {
  title: { // l'écran-titre et le menu : joyeuse, un peu « début d'aventure »
    bpm: 112,
    lead: 'C5 E5 G5 C6 _ G5 E5 G5 A5 _ F5 _ A5 C6 _ - B4 D5 G5 B5 _ G5 F5 D5 C5 _ E5 _ G5 _ - -',
    bass: 'C3 G3 C3 G3 C3 G3 C3 G3 F2 C3 F2 C3 F2 C3 F2 C3 G2 D3 G2 D3 G2 D3 G2 D3 C3 G3 C3 G3 C3 _ - -',
  },
  home: { // l'appart : tranquille et chaleureux
    bpm: 100,
    lead: 'E5 G5 C6 G5 E5 G5 C6 - D5 F5 A5 F5 D5 F5 A5 - E5 G5 C6 G5 A5 G5 E5 - D5 E5 F5 D5 C5 _ - -',
    bass: 'C3 - G3 - C3 - G3 - D3 - A3 - D3 - A3 - C3 - G3 - A2 - E3 - G2 - D3 - C3 _ - -',
  },
  town: { // la rue et le marché : sautillant
    bpm: 132,
    lead: 'G5 B5 D6 B5 G5 B5 A5 - F#5 A5 D6 A5 F#5 A5 G5 - E5 G5 C6 G5 E5 G5 D5 F#5 G5 _ B5 _ G5 _ - -',
    bass: 'G2 D3 G2 D3 G2 D3 G2 D3 D2 A2 D2 A2 D2 A2 D2 A2 C3 G3 C3 G3 C3 G3 D3 A3 G2 - D3 - G2 _ - -',
  },
  storm: { // la tempête : tendu
    bpm: 126,
    lead: 'A4 _ C5 _ E5 _ C5 - A4 _ C5 _ F5 E5 C5 - G#4 _ B4 _ E5 _ B4 - A4 _ _ _ - - - -',
    bass: 'A2 A2 - A2 A2 - A2 - F2 F2 - F2 F2 - F2 - E2 E2 - E2 E2 - E2 - A2 A2 - A2 E2 - A2 -',
  },
  final: { // le parc éolien au coucher du soleil : tendre
    bpm: 84,
    lead: 'A5 _ C6 _ F5 _ A5 _ G5 _ A#5 _ E5 _ G5 _ F5 _ A5 _ C6 _ F6 _ E6 _ D6 _ C6 _ _ -',
    bass: 'F3 C4 F3 C4 F3 C4 F3 C4 C3 G3 C3 G3 C3 G3 C3 G3 D3 A3 D3 A3 A#2 F3 A#2 F3 C3 G3 C3 G3 F3 _ - -',
  },
};
import { ALT } from './musiques_alt.js';
Object.assign(TRACKS, ALT);
// Chaque version d'origine reste jouable sous son propre nom (ex. « home_o »), même si une alternative est choisie
for (const k of ['title', 'home', 'town', 'storm', 'final']) TRACKS[k + '_o'] = TRACKS[k];

// Quelle version joue dans le jeu pour chaque moment. Pour choisir une alternative,
// remplace par exemple 'home' par 'home_b' (voir la page musiques.html).
export const CHOICE = { title: 'title_b', home: 'home_c', town: 'town_a', storm: 'storm_d', final: 'final_d' };

const SEMI = { C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11 };
const freq = n => { const m = /^([A-G]#?)(\d)$/.exec(n); return 440 * Math.pow(2, (SEMI[m[1]] + (+m[2] + 1) * 12 - 69) / 12); };
const toks = s => s.replace(/\|/g, ' ').trim().split(/\s+/);
for (const tr of Object.values(TRACKS)) { tr.L = toks(tr.lead); tr.B = toks(tr.bass); tr.D = tr.drums ? toks(tr.drums) : null; }

let cur = null, step = 0, nextT = 0, timer = null, noiseBuf = null, fadeTimer = 0;

function note(tokens, i, t, stepDur, type, vol) {
  const tok = tokens[i % tokens.length];
  if (tok === '-' || tok === '_') return;
  let len = 1;
  while (tokens[(i + len) % tokens.length] === '_' && len < 8) len++;
  const o = ac.createOscillator(), g = ac.createGain(), dur = stepDur * len * .92;
  o.type = type; o.frequency.setValueAtTime(freq(tok), t);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .012);
  g.gain.setValueAtTime(vol, t + dur * .6); g.gain.linearRampToValueAtTime(0, t + dur);
  o.connect(g).connect(musicBus); o.start(t); o.stop(t + dur + .02);
}
// Petite batterie : k = grosse caisse, s = caisse claire, h = charleston
function drum(tok, t) {
  if (tok === 'k') {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(45, t + .12);
    g.gain.setValueAtTime(.16, t); g.gain.exponentialRampToValueAtTime(.001, t + .15);
    o.connect(g).connect(musicBus); o.start(t); o.stop(t + .16);
  } else if (tok === 's' || tok === 'h') {
    if (!noiseBuf) {
      noiseBuf = ac.createBuffer(1, ac.sampleRate * .2, ac.sampleRate);
      const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const n = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(), hat = tok === 'h';
    n.buffer = noiseBuf; f.type = hat ? 'highpass' : 'bandpass'; f.frequency.value = hat ? 7000 : 1800;
    const len = hat ? .04 : .11;
    g.gain.setValueAtTime(hat ? .025 : .07, t); g.gain.exponentialRampToValueAtTime(.001, t + len);
    n.connect(f).connect(g).connect(musicBus); n.start(t); n.stop(t + len + .01);
  }
}
function schedule() {
  if (!cur || !ac || ac.state !== 'running') return;
  const tr = TRACKS[cur], stepDur = 30 / tr.bpm;
  if (nextT < ac.currentTime) nextT = ac.currentTime + .05; // reprise après une pause de l'onglet
  while (nextT < ac.currentTime + .25) {
    note(tr.L, step, nextT, stepDur, tr.leadWave || 'square', tr.leadWave === 'triangle' ? .05 : .022);
    note(tr.B, step, nextT, stepDur, tr.bassWave || 'triangle', .05);
    if (tr.D) drum(tr.D[step % tr.D.length], nextT);
    step++; nextT += stepDur;
  }
}
export const music = {
  // name : un moment du jeu ('title', 'home', 'town', 'storm', 'final'), une version précise ('home_b'), ou null
  play(name) {
    const id = name && (CHOICE[name] || name);
    if (id === cur) return;
    clearTimeout(fadeTimer);
    // la nouvelle musique démarre tout de suite, à plein volume
    if (musicBus) { const t = ac.currentTime; musicBus.gain.cancelScheduledValues(t); musicBus.gain.setValueAtTime(1, t); }
    cur = TRACKS[id] ? id : null; step = 0; nextT = 0;
    if (cur && !timer) timer = setInterval(schedule, 60);
    if (!cur && timer) { clearInterval(timer); timer = null; }
  },
  current: () => cur,
  // baisse doucement la musique en cours jusqu'au silence (sommeil, changement de chapitre)
  fadeOut(sec = 1.5) {
    if (!cur || !musicBus) { music.play(null); return; }
    const t = ac.currentTime;
    musicBus.gain.cancelScheduledValues(t); musicBus.gain.setValueAtTime(musicBus.gain.value, t); musicBus.gain.linearRampToValueAtTime(0, t + sec);
    clearTimeout(fadeTimer);
    fadeTimer = setTimeout(() => music.play(null), sec * 1000 + 50);
  },
  // pour la page d'écoute : tous les morceaux, avec leur nom et leur description
  list: () => TRACKS,
};
