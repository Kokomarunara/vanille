// Le final : panorama du parc éolien au coucher du soleil, Lannion qui se rallume au loin,
// le gâteau aux 28 bougies, la nuit étoilée, puis le générique avec les photos.
import * as input from '../engine/input.js';
import { r } from '../art/tiles.js';
import { text } from '../art/text.js';
import { disc } from '../art/furniture.js';
import { sprite } from '../art/sprites.js';
import { bigTurbine } from '../art/storm.js';
import { DECLARATION, MOT_FINAL } from './mots_antoine.js';
import { music } from '../engine/audio.js';

const SKY = ['#2b2a5c', '#3d3270', '#5a3c80', '#8a4a84', '#c05a80', '#e87a70', '#f6a070', '#fbc888'];
const stars = Array.from({ length: 46 }, (_, i) => [(i * 97 + 13) % 256, (i * 41 + 7) % 92, i]);
// fenêtres de Lannion, au loin : [x, y]
const WIN = [[8, 109], [14, 112], [21, 108], [27, 111], [33, 106], [38, 110], [44, 107], [50, 111], [56, 105], [61, 109], [67, 107], [72, 111], [78, 108], [84, 110], [90, 109], [12, 106], [47, 103], [64, 104]];
const N = 28;

function scene(g) {
  const S = {
    fade: 1, clear: 0, lit: 0, night: 0, big: 0, dim: 0, cloud: 0,
    cake: false, heart: false, fw: false, kdir: 'up', adir: 'up', ax: 124,
    mode: 'pano', skip: false, candles: Array(N).fill(true),
  };
  const tw = [], parts = [], puffs = [];
  let t = 0, fwT = 0, blowRes = null, blowEnd = 0;

  const sc = {
    S,
    to(key, v, dur) { return new Promise(res => tw.push({ key, from: S[key], to: v, t: 0, dur, res })); },
    blow() { S.mode = 'cake'; return new Promise(res => { blowRes = res; }); },

    update(dt) {
      t += dt;
      for (let i = tw.length - 1; i >= 0; i--) {
        const w = tw[i]; w.t += dt;
        const k = Math.min(1, w.t / w.dur);
        S[w.key] = w.from + (w.to - w.from) * k;
        if (k >= 1) { tw.splice(i, 1); w.res(); }
      }
      // feux d'artifice
      if (S.fw && (fwT -= dt) <= 0) {
        fwT = .7 + Math.random() * .9;
        const x = 30 + Math.random() * 196, y = 18 + Math.random() * 50, col = ['#f8e070', '#f06a8a', '#70c8f0', '#90f0a8', '#f8a050'][Math.floor(Math.random() * 5)];
        for (let i = 0; i < 22; i++) { const a = i / 22 * Math.PI * 2, v = 22 + Math.random() * 14; parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, t: 1 + Math.random() * .4, col }); }
        g.sfx.sparkle();
      }
      for (let i = parts.length - 1; i >= 0; i--) { const p = parts[i]; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 22 * dt; p.vx *= 1 - dt; if ((p.t -= dt) <= 0) parts.splice(i, 1); }
      for (let i = puffs.length - 1; i >= 0; i--) { const p = puffs[i]; p.y -= 14 * dt; if ((p.t -= dt) <= 0) puffs.splice(i, 1); }
      // les bougies : chaque appui en souffle quelques-unes
      if (S.mode === 'cake' && blowRes) {
        const lit = S.candles.map((v, i) => (v ? i : -1)).filter(i => i >= 0);
        if (lit.length && input.take('a')) {
          g.sfx.door();
          for (let k = 0; k < 5 && lit.length; k++) {
            const i = lit.splice(Math.floor(Math.random() * lit.length), 1)[0];
            S.candles[i] = false; const [cx, cy] = candlePos(i); puffs.push({ x: cx, y: cy - 12, t: 1 });
          }
        }
        if (!lit.length && (blowEnd += dt) > 1.1) { const res = blowRes; blowRes = null; S.mode = 'pano'; res(); }
      }
      if (S.mode === 'credits' && input.take('a')) S.skip = true;
    },

    draw(c) {
      // ----- ciel -----
      SKY.forEach((col, i) => { r(c, 0, i * 15, 256, 15, col); if (i) for (let x = 0; x < 256; x += 2) { r(c, x, i * 15, 1, 1, SKY[i - 1]); r(c, x + 1, i * 15 - 1, 1, 1, col); } });
      const sunY = 100 + S.night * 30;
      if (S.clear > 0) { c.globalAlpha = S.clear; disc(c, 170, sunY, 19, '#fde6a8'); disc(c, 170, sunY, 16, '#fff6d8'); c.globalAlpha = 1; }
      if (S.night > 0) { c.globalAlpha = S.night * .88; r(c, 0, 0, 256, 120, '#0c1030'); c.globalAlpha = 1; }
      if (S.clear < 1) { // nuages d'orage qui se déchirent
        c.globalAlpha = (1 - S.clear) * .9; r(c, 0, 0, 256, 120, '#1a2040'); c.globalAlpha = 1;
        for (let i = 0; i < 7; i++) { const cx = ((i * 60 - t * (6 + i)) % 320 + 320) % 320 - 40 - S.clear * (i % 2 ? 140 : -140); c.globalAlpha = 1 - S.clear; r(c, Math.round(cx), 8 + (i * 13) % 50, 60, 9, '#10152e'); r(c, Math.round(cx) + 10, 3 + (i * 13) % 50, 36, 7, '#10152e'); c.globalAlpha = 1; }
      }
      if (S.night > .2) {
        c.globalAlpha = Math.min(1, (S.night - .2) * 1.5);
        for (const [x, y, i] of stars) if (Math.sin(t * 2 + i) > -.5) r(c, x, y, 1, 1, i % 4 ? '#f8e8c8' : '#ffffff');
        disc(c, 236, 70, 8, '#f4f0d8'); disc(c, 240, 68, 7, '#0c1030');
        const sh = (t % 9); if (sh < .5) for (let k = 0; k < 6; k++) r(c, Math.round(40 + sh * 260 - k * 4), Math.round(20 + sh * 50 - k), 2, 1, `rgba(255,255,255,${(1 - k / 6).toFixed(2)})`);
        c.globalAlpha = 1;
      }
      for (const p of parts) r(c, Math.round(p.x), Math.round(p.y), 2, 2, p.col);
      // ----- mer -----
      r(c, 0, 120, 256, 44, '#3c4c94'); r(c, 0, 120, 256, 1, '#f8c090');
      if (S.clear > .3 && S.night < .8) for (let i = 0; i < 14; i++) { const w = 40 - i * 2 + Math.round(Math.sin(t * 3 + i * 1.7) * 5); c.globalAlpha = S.clear * (1 - S.night); r(c, 170 - w / 2, 122 + i * 2, w, 1, i % 2 ? '#f6a070' : '#fbd6a0'); c.globalAlpha = 1; }
      for (let i = 0; i < 12; i++) r(c, (i * 67 + Math.floor(t * 6)) % 256, 124 + (i * 11) % 34, 5, 1, '#5a6cb4');
      c.globalAlpha = Math.max((1 - S.clear) * .6, S.night * .7); r(c, 0, 120, 256, 44, '#0c1030'); c.globalAlpha = 1;
      // ----- Lannion au loin -----
      const far = '#1a2038';
      for (let x = 0; x < 104; x++) { const y = Math.round(114 + Math.sin(x / 26) * 2 + (x > 80 ? (x - 80) * .3 : 0)); r(c, x, y, 1, 122 - y, far); }
      for (let i = 0; i < 12; i++) { const hx = 4 + i * 8, hh = 6 + (i * 5) % 6; r(c, hx, 114 - hh, 7, hh + 2, far); r(c, hx + 1, 113 - hh, 5, 1, far); r(c, hx + 2, 112 - hh, 3, 1, far); }
      r(c, 46, 96, 4, 18, far); r(c, 47, 91, 2, 5, far); r(c, 55, 100, 6, 14, far); // clocher
      WIN.forEach(([x, y], i) => { if (i < S.lit * WIN.length) r(c, x, y, 2, 2, Math.sin(t * 3 + i) > -.8 ? '#f8e070' : '#c8a840'); });
      if (S.lit > 0) { // halo doux au-dessus de la ville rallumée
        for (let dy = 0; dy < 12; dy++) { c.globalAlpha = S.lit * .2 * (1 - dy / 12); r(c, 0, 110 - dy, 98 - dy * 3, 1, '#f8d060'); }
        c.globalAlpha = 1;
      }
      // ----- collines et éoliennes -----
      const hill = (base, amp, ph, col) => { for (let x = 0; x < 256; x++) { const y = Math.round(base + Math.sin(x / 40 + ph) * amp + Math.sin(x / 13 + ph) * 2); r(c, x, y, 1, 192 - y, col); } };
      hill(150, 5, 1.2, '#22314e');
      const sp = t * (1.2 + S.clear);
      bigTurbine(c, 132, 152, 50, sp, 24, true); bigTurbine(c, 236, 150, 44, sp * .9 + 1, 21, true);
      hill(164, 7, 3.4, '#1a2740');
      bigTurbine(c, 196, 170, 78, sp * 1.1 + 2, 38, true);
      hill(176, 4, 5, '#121a30');
      for (let x = 3; x < 256; x += 7) { const s = Math.round(Math.sin(t * 2.5 + x)); r(c, x + s, 178 + (x * 7) % 9, 1, 3, '#22305a'); }
      // ----- Ketura et Chou -----
      const who = (look, dir, x) => { r(c, x + 6, 181, 24, 3, 'rgba(0,0,0,.35)'); c.drawImage(sprite(look, dir, 0), 0, 0, 18, 27, x, 130, 36, 54); };
      who('ketura_pro', S.kdir, 82);
      who('antoine', S.adir, Math.round(S.ax));
      if (S.cake) { // le gâteau, tenu à deux mains
        const gx = Math.round(S.ax) - 10, gy = 150;
        r(c, gx - 1, gy + 5, 22, 3, '#2a202c'); r(c, gx, gy + 5, 20, 2, '#f4f4ee');
        r(c, gx + 1, gy - 3, 18, 9, '#2a202c'); r(c, gx + 2, gy - 2, 16, 7, '#f8f0d0'); r(c, gx + 2, gy - 2, 16, 2, '#fffaf0'); r(c, gx + 2, gy + 2, 16, 1, '#e8c890');
        for (let i = 0; i < 6; i++) { r(c, gx + 3 + i * 3, gy - 6, 1, 4, i % 2 ? '#f06a8a' : '#70c8f0'); if (S.candles.some(Boolean)) r(c, gx + 3 + i * 3, gy - 8 - (Math.floor(t * 9 + i) % 2), 1, 2, '#f8e070'); }
      }
      if (S.heart) { const hy = 118 - Math.round(Math.abs(Math.sin(t * 2)) * 3), hx = Math.round((82 + S.ax) / 2) + 14; r(c, hx, hy, 3, 3, '#f06a8a'); r(c, hx + 4, hy, 3, 3, '#f06a8a'); r(c, hx - 1, hy + 1, 9, 3, '#f06a8a'); r(c, hx, hy + 4, 7, 1, '#f06a8a'); r(c, hx + 1, hy + 5, 5, 1, '#f06a8a'); r(c, hx + 2, hy + 6, 3, 1, '#f06a8a'); r(c, hx + 3, hy + 7, 1, 1, '#f06a8a'); }
      if (S.cloud > 0) for (let i = 0; i < 7; i++) { const a = i * .9 + t * .5, d = i ? S.cloud * 16 : 0, rr = Math.max(2, S.cloud * (9 + 3 * Math.sin(t * 3 + i))); c.fillStyle = i % 2 ? 'rgba(150,200,70,.45)' : 'rgba(120,180,60,.45)'; const x = Math.round(92 + Math.cos(a) * d), y = Math.round(172 + Math.sin(a) * d * .6); for (let dy = -rr; dy <= rr; dy++) { const w = Math.floor(Math.sqrt(rr * rr - dy * dy)); c.fillRect(x - w, Math.round(y + dy), w * 2, 1); } }
      // ----- le gâteau en gros plan -----
      if (S.mode === 'cake') drawCake(c, S, t, puffs);
      if (S.dim > 0) { c.globalAlpha = S.dim; r(c, 0, 0, 256, 192, '#0c0a14'); c.globalAlpha = 1; }
      if (S.big > 0) {
        c.globalAlpha = Math.min(1, S.big);
        for (const [dx, dy, col] of [[2, 2, '#3a2452'], [0, 0, '#fff3c8'], [1, 0, '#fff3c8']]) text(c, 'Joyeux anniversaire', 128 + dx, 8 + dy, col, 'center', 32);
        text(c, 'Mamour', 131, 43, '#b0405e', 'center', 48); text(c, 'Mamour', 128, 40, '#fff3c8', 'center', 48);
        c.globalAlpha = 1;
      }
      if (S.fade > 0) { c.globalAlpha = Math.min(1, Math.ceil(S.fade * 6) / 6); r(c, 0, 0, 256, 192, '#0c0a14'); c.globalAlpha = 1; }
    },
  };
  return sc;
}

// 28 bougies sur deux rangées de 14
function candlePos(i) { const row = i < 14 ? 0 : 1, k = i % 14; return [50 + k * 12 + row * 6, 92 + row * 12]; }

function drawCake(c, S, t, puffs) {
  c.globalAlpha = .72; r(c, 0, 0, 256, 192, '#0c0a14'); c.globalAlpha = 1;
  const OL = '#2a202c';
  // plat et gâteau à la vanille
  for (let dy = -9; dy <= 9; dy++) { const w = Math.floor(Math.sqrt(1 - (dy * dy) / 81) * 112); r(c, 128 - w, 150 + dy, w * 2, 1, dy < 6 ? '#f4f4ee' : '#c8ccd4'); }
  r(c, 34, 96, 188, 52, OL); r(c, 36, 98, 184, 48, '#f3e2b0'); r(c, 36, 98, 184, 3, '#fbf0cc');
  r(c, 36, 120, 184, 4, '#fffaf0'); r(c, 36, 124, 184, 1, '#e0c890');
  for (let x = 36; x < 220; x += 12) { r(c, x, 98, 12, 9, '#fffaf0'); r(c, x + 2, 107, 8, 3, '#fffaf0'); r(c, x + 4, 110, 4, 2, '#fffaf0'); } // glaçage qui coule
  for (let x = 44; x < 216; x += 18) { r(c, x, 132, 3, 3, '#3a2a1a'); r(c, x + 9, 138, 2, 2, '#3a2a1a'); }                          // grains de vanille
  r(c, 32, 84, 192, 16, OL); r(c, 34, 86, 188, 12, '#fffaf0'); r(c, 34, 86, 188, 2, '#ffffff');
  for (let i = 0; i < N; i++) {
    const [x, y] = candlePos(i), col = ['#f06a8a', '#70c8f0', '#f8e070', '#90f0a8'][i % 4];
    r(c, x - 2, y - 16, 5, 17, OL); r(c, x - 1, y - 15, 3, 15, col); r(c, x - 1, y - 12, 3, 1, '#ffffff'); r(c, x - 1, y - 7, 3, 1, '#ffffff'); r(c, x, y - 18, 1, 3, OL);
    if (S.candles[i]) { const f = Math.floor(t * 10 + i * 1.7) % 3; r(c, x - 2, y - 24 - (f === 1 ? 1 : 0), 5, 6, '#f8a030'); r(c, x - 1, y - 23 - (f === 1 ? 1 : 0), 3, 4, '#f8e070'); r(c, x, y - 25 - f, 1, 2, '#f8a030'); r(c, x, y - 21, 1, 1, '#ffffff'); }
  }
  for (const p of puffs) { c.globalAlpha = Math.min(1, p.t); r(c, Math.round(p.x + Math.sin(p.y / 3) * 2) - 1, Math.round(p.y), 3, 3, '#c8ccd4'); c.globalAlpha = 1; }
  const left = S.candles.filter(Boolean).length;
  text(c, left ? 'Un souhait... et souffle !' : 'Toutes soufflées !', 128, 20, '#fff3c8', 'center');
  if (left) { text(c, `${left} bougie${left > 1 ? 's' : ''}`, 128, 40, '#a9cbe6', 'center'); if (Math.floor(t * 2) % 2) text(c, 'A : souffler', 128, 168, '#f8e070', 'center'); }
}

const $ = id => document.getElementById(id);

// ---------- le générique : photos encadrées, puis le mot d'Antoine ----------
async function credits(g, sc) {
  const S = sc.S, el = $('credits'), frame = $('crFrame'), img = $('crImg'), cap = $('crCap'), msg = $('crMsg');
  const pause = async sec => { S.skip = false; for (let k = 0; k < sec * 10 && !S.skip; k++) await g.wait(.1); S.skip = false; };
  let list = [];
  try { list = (await import('../../photos/liste.js')).default; } catch (_) { /* pas de photos : on passe directement au mot de la fin */ }
  S.mode = 'credits';
  await sc.to('dim', .55, 1);
  el.classList.add('on');
  msg.innerHTML = '<div class="big"><span>Ketoo — Version Vanille</span></div><div><span>d\'après une histoire vraie</span></div>';
  msg.classList.add('show');
  await pause(3.5);
  msg.classList.remove('show');
  await g.wait(.5);
  for (let i = 0; i < list.length; i++) {
    const ph = list[i];
    const ok = await new Promise(res => { img.onload = () => res(true); img.onerror = () => res(false); img.src = 'photos/' + ph.fichier; });
    if (!ok) continue;
    cap.innerHTML = `<span>${ph.legende || ''}</span>`;
    frame.style.setProperty('--rot', (i % 2 ? 2.5 : -2.5) + 'deg');
    frame.classList.add('show');
    await pause(4.5);
    frame.classList.remove('show');
    await g.wait(.6);
  }
  // le mot de la fin, ligne après ligne
  msg.innerHTML = '';
  msg.classList.add('show');
  for (const l of MOT_FINAL) {
    const d = document.createElement('div');
    d.innerHTML = `<span>${l}</span>`;
    msg.appendChild(d);
    g.sfx.text();
    await pause(1.6);
  }
  await pause(3);
  const fin = document.createElement('div');
  fin.className = 'fin'; fin.innerHTML = '<span>FIN</span>';
  msg.appendChild(fin);
  g.sfx.win();
  S.skip = false;
  while (!S.skip) await g.wait(.1); // on attend un appui pour revenir au titre
  msg.classList.remove('show'); el.classList.remove('on');
  msg.innerHTML = '';
}

// Déroulé complet du final (appelé à la fin du chapitre 5)
export async function playFinale(g) {
  const sc = scene(g), S = sc.S;
  g.W.dlgTop = true; // les textes en haut : Ketura et Chou sont en bas de l'image
  g.playMini(sc);
  music.play('final');
  await sc.to('fade', 0, 1.2);
  await g.lines(['En haut de la falaise, le vent retombe.']);
  await sc.to('clear', 1, 3.5);
  await g.lines(['Les trois éoliennes tournent. Le soleil perce, et descend sur la mer.', 'Et au loin, quartier après quartier...']);
  await sc.to('lit', 1, 4.5);
  S.kdir = 'right'; S.adir = 'left';
  await g.lines([
    '... Lannion se rallume.',
    'k: C\'est moi qui ai fait ça ?',
    'a: C\'est toi qui as fait ça.',
    'a: Maintenant, ferme les yeux.',
    'k: Chou...',
    'a: Ferme.',
  ]);
  await sc.to('fade', 1, .5);
  S.cake = true;
  await g.wait(.6);
  await sc.to('fade', 0, .8);
  await g.lines(['Quand elle les rouvre, il tient un gâteau. À la vanille. Avec vingt-huit bougies.', 'k: Tu as monté ça jusqu\'ici ? Sous la tempête ?', 'a: J\'ai failli le lâcher trois fois.']);
  await g.lines(DECLARATION);
  S.heart = true;
  await g.lines(['a: Fais un vœu, Mamour.']);
  await sc.blow();
  g.sfx.win();
  await g.lines(['Vingt-huit bougies. Presque d\'un seul souffle.']);
  S.kdir = 'up'; S.adir = 'up';
  await sc.to('night', 1, 3.5);
  S.fw = true;
  await g.lines(['La nuit tombe sur la côte. Au-dessus de Lannion, quelqu\'un tire un feu d\'artifice.', 'a: Joyeux anniversaire, Mamour.']);
  await sc.to('big', 1, 1);
  await g.wait(3.5);
  await sc.to('big', 0, .8);
  await g.lines(['Et sous les étoiles, dans le silence...']);
  g.sfx.prout();
  await sc.to('cloud', 1, .8);
  await g.lines(['*prout*', 'a: ...', 'a: Même ça, je l\'aime.', 'k: Chou !!', 'Ils rient. Les pales tournent. Le vent travaille pour eux.']);
  sc.to('cloud', 0, 2);
  await credits(g, sc);
  await sc.to('fade', 1, 1);
  g.W.dlgTop = null;
  sc.finish();
}
