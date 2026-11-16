// Chapitre 1 — La nouvelle coloc.
// Ketura arrive à Lannion, refuse toute aide et monte ses trois cartons toute seule.
import * as input from '../engine/input.js';
import { r } from '../art/tiles.js';
import { text, textS } from '../art/text.js';

let g, st;

const BOXES = ['carton « Vêtements »', 'carton « Cours d\'élec » (lourd)', 'carton « Produits ménagers » (très lourd)'];
const DRAIN = [.03, .07, .1]; // effort perdu à chaque pas, selon le carton

function hud(c) {
  r(c, 166, 5, 86, 16, '#1c2a3c'); r(c, 167, 6, 84, 14, '#fbf8ee');
  text(c, 'Effort', 170, 4, '#34506e');
  r(c, 208, 9, 40, 8, '#34506e'); r(c, 209, 10, 38, 6, '#d8d4c8');
  const v = Math.max(0, st.gauge);
  r(c, 209, 10, Math.round(38 * v), 6, v > .5 ? '#50b860' : v > .25 ? '#e8a838' : '#d04848');
  if (g.W.frozen) { r(c, 60, 30, 136, 18, '#1c2a3c'); r(c, 61, 31, 134, 16, '#fbf8ee'); text(c, 'A : souffler un coup !', 128, 31, '#c0405a', 'center'); }
}

function stopCarry() {
  const W = g.W;
  W.p.carry = null; W.p.emote = null;
  Object.assign(W, { hud: null, tickHook: null, noRun: false, walkDur: .22, frozen: false });
}

function startCarry() {
  const W = g.W;
  st.gauge = 1;
  Object.assign(W, { hud, noRun: true, walkDur: .28 });
  W.tickHook = dt => {
    if (W.frozen) {
      if (input.take('a')) { st.gauge = Math.min(1, st.gauge + .14); g.sfx.move(); }
      if (st.gauge >= .6) { W.frozen = false; W.p.emote = null; }
    } else if (!W.p.mv) st.gauge = Math.min(1, st.gauge + dt * .05);
  };
}

async function meet() {
  const p = g.W.p;
  st.phase = 'meet';
  await g.stepChar(p, 'down'); p.dir = 'up';
  g.sfx.door(); g.refresh();
  const a = g.npc('antoine');
  await g.emote(a, '!', .7);
  await g.lines([
    'a: Oh ! Salut ! Tu dois être Ketura, la nouvelle coloc ?',
    'k: Oui.',
    'a: Moi c\'est Antoine. Bienvenue ! Le livreur a déposé tes cartons dans l\'entrée.',
    'a: Ils ont l\'air super lourds. Tu veux un coup de main ?',
  ]);
  await g.choose(['Non.', 'Non merci.', 'Je gère.']);
  await g.emote(a, '...', .9);
  await g.lines([
    'a: Ah. D\'accord. Très bien.',
    'a: Ta chambre est à l\'étage, au bout de la passerelle. Je... je te laisse faire, alors.',
  ]);
  st.phase = 'boxes';
  await g.warp('rdc', 8, 12, 'up');
  g.setObjective('Monte tes 3 cartons dans ta chambre.');
  await g.lines(['L\'entrée de l\'appart. Trois cartons attendent, bien empilés.', '(Examine la pile avec A pour soulever un carton.)']);
}

async function pick() {
  const p = g.W.p, i = st.picked;
  if (p.carry) { await g.say('k', 'Un carton à la fois. Je suis forte, pas folle.'); return; }
  if (i === 2) {
    await g.say('a', 'Attends, celui-là c\'est les produits ménagers, il pèse une tonne. Laisse-moi au m—');
    const c = await g.choose(['Non.', 'NON.', '... Tiens-moi juste la porte.']);
    if (c === 2) { st.thaw = true; await g.lines(['a: Avec plaisir !', 'a: (Elle m\'a laissé tenir une porte !!)']); }
    else await g.say('a', 'OK, OK... Je regarde, alors.');
  }
  st.picked++; p.carry = 'box'; g.refresh();
  await g.say(null, `Ketura soulève le ${BOXES[i]}.`);
  if (i === 0) await g.say(null, '(La jauge d\'effort est en haut à droite. Si elle se vide, appuie sur A pour souffler.)');
  startCarry();
}

async function drop() {
  stopCarry();
  st.done++; g.sfx.bump(); g.refresh();
  if (st.done === 1) await g.lines(['k: Et d\'un.']);
  else if (st.done === 2) await g.lines(['k: Et de deux. Même pas mal.', '(Elle a très mal.)']);
  else {
    await g.lines([
      'k: Et de trois !',
      'Ketura a tout monté toute seule. Par le colimaçon.',
      'En bas, Antoine n\'a pas bougé. Il a tout regardé, médusé.',
    ]);
    st.phase = 'evening';
    g.setObjective('Redescends voir Antoine.');
    return;
  }
  g.setObjective(`Cartons montés : ${st.done}/3.\nRedescends chercher le suivant.`);
}

async function talkAntoine(G, a) {
  if (st.phase === 'boxes') {
    if (g.W.p.carry) await g.lines(['a: Ça va aller ? Vraiment ?', 'k: Oui.']);
    else await g.lines(['a: Tes cartons sont près de l\'entrée. Ta chambre est en haut, au bout de la passerelle.', 'a: Et si jamais tu changes d\'avis pour le coup de main...', 'k: Non.']);
  } else if (st.phase === 'evening') {
    await g.lines([
      'a: Trois cartons. Toute seule. Par l\'escalier en colimaçon.',
      'a: Respect.',
      'k: ...',
      'k: Merci.',
    ]);
    await g.emote(a, '!', .8);
    await g.lines([
      'a: (Elle a dit merci !)',
      'a: Bon... bonne nuit, Ketura. Et bienvenue à la coloc.',
      'Ce soir-là, Antoine se dit que la nouvelle coloc était un peu froide.',
      'Il ne savait pas encore à quel point il se trompait.',
    ]);
    st.phase = 'sleep';
    g.setObjective('Va te coucher.');
  } else await g.lines(['a: Bonne nuit !']);
}

async function sleep() {
  await g.say('k', 'Longue journée. Au lit.');
  g.fadeMusic();
  await g.fadeTo(1, 1.2);
  await g.say(null, 'Zzz...');
  await g.startChapter(2);
}

export default {
  getState: () => st,
  resume(G, s) { g = G; st = s; },
  afterResume() { if (g.W.p.carry) startCarry(); },
  async start(G) {
    g = G;
    st = { phase: 'arrive', picked: 0, done: 0, thaw: false, gauge: 1 };
    g.load('rue', 2, 6, 'right');
    g.setObjective('');
    await g.card('Chapitre 1', 'La nouvelle coloc');
    await g.fadeTo(0, .6);
    await g.lines([
      'Lannion, Côtes-d\'Armor. Un jour de septembre.',
      'k: Bon. C\'est ici, la coloc.',
      'k: BTS électrotechnique, me voilà.',
    ]);
    g.setObjective('Entre dans l\'appart.');
  },
  objects(id) {
    const o = [];
    if (id === 'rdc' && st.phase === 'boxes' && st.picked < 3) o.push({ t: 'boxes', id: 'boxes', x: 10, y: 12, v: 3 - st.picked });
    if (id === 'etage') {
      if (st.done > 0) o.push({ t: 'boxes', id: 'stack', x: 21, y: 5, v: st.done, text: ['Les cartons de Ketura. Montés à la force des bras.'] });
      if (g.W.p && g.W.p.carry) o.push({ t: 'marker', id: 'drop', x: 19, y: 6, spot: 1 });
    }
    return o;
  },
  npcs(id) {
    if (id === 'rue' && st.phase === 'meet') return [{ id: 'antoine', look: 'antoine', x: 9, y: 5, dir: 'down' }];
    if (id === 'rdc' && st.phase !== 'arrive' && st.phase !== 'meet') return [{ id: 'antoine', look: 'antoine', x: 12, y: 10, dir: 'left', talk: talkAntoine }];
    return [];
  },
  touch(id) { if (id === 'door' && st.phase === 'arrive') return meet; },
  act(id) {
    if (id === 'boxes') return pick;
    if (id === 'bedK' && st.phase === 'sleep') return sleep;
    if (id === 'bedK' && st.phase !== 'sleep') return () => g.lines(['Ton lit.', 'k: Pas encore. J\'ai des choses à finir.']);
  },
  step(map, x, y) {
    const p = g.W.p;
    if (!p.carry) return;
    st.gauge -= DRAIN[st.picked - 1];
    if (st.gauge <= 0) { st.gauge = 0; g.W.frozen = true; p.emote = 'sweat'; g.sfx.bump(); }
    if (map === 'etage' && x === 19 && y === 6) return drop;
  },
};
