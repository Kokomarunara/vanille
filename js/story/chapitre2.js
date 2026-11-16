// Chapitre 2 — Opération Propreté.
// Ménage du salon, panne de la vieille machine à laver, tableau électrique, recâblage... et premier prout.
import { disjoncteur } from '../minigames/disjoncteur.js';
import { cablage } from '../minigames/cablage.js';
import rdc from '../maps/appart_rdc.js';

let g, st;

const STAINS = [[9, 3, 'crumbs'], [11, 4, 'stain'], [9, 6, 'sock'], [11, 7, 'stain'], [12, 9, 'crumbs'], [9, 10, 'pizza'], [13, 11, 'stain'], [11, 12, 'crumbs']];
// Antoine mange ses biscuits debout près de la table (13,7), tourné vers nous : ses miettes tombent juste devant lui
const ANTOINE_TABLE = { x: 13, y: 7, dir: 'down' };
const EXTRA = [[13, 8], [12, 8]];

const objective = () => g.setObjective(`Nettoie le salon : ${st.cleaned}/${st.total}\n(A, plusieurs fois, pour frotter)`);

async function discover() {
  const p = g.W.p;
  st.phase = 'clean';
  await g.emote(p, '!', .8);
  await g.lines([
    'k: ... C\'est quoi ce bazar ?!',
    'a: Ah, salut ! Bien dormi ? Oui, pardon, j\'ai mangé devant un film hier soir...',
    'Des miettes. Des taches. Un carton de pizza. Une chaussette.',
    'Quelque chose s\'éveille au fond de Ketura.',
  ]);
  g.sfx.win();
  await g.say(null, 'La passion de Ketura pour le ménage prend le dessus !');
  objective();
}

async function scrub(G, o) {
  const s = o.ref;
  s.hits++; g.spark(s.x, s.y); g.sfx.sparkle();
  if (s.hits < 3) return;
  st.stains.splice(st.stains.indexOf(s), 1);
  st.cleaned++; g.spark(s.x, s.y, '#a0e8ff'); g.refresh(); objective();
  if (s.type === 'sock') {
    g.addItem('Chaussette d\'Antoine', 'Orpheline. À tenir à bout de bras. Direction : la machine à laver.');
    await g.lines(['Une chaussette. D\'Antoine.', 'Ketura la ramasse à bout de bras et la glisse dans son sac. Ça ira à la machine.']);
  }
  if (!st.sat && st.drops < 2 && (st.cleaned === 3 || st.cleaned === 6)) {
    const [x, y] = EXTRA[st.drops++];
    await g.emote(g.npc('antoine'), 'note', .6);
    await g.say('a', '*crunch crunch crunch*');
    st.stains.push({ x, y, type: 'crumbs', hits: 0 }); st.total++; g.refresh(); objective();
    await g.emote(g.W.p, 'anger', .8);
    await g.lines(['k: ANTOINE.', 'a: Pardon ! C\'est les biscuits, ils s\'émiettent tout seuls !', '(Parle-lui pour régler le problème à la source.)']);
  }
  if (!st.stains.length) {
    st.phase = 'laundry';
    await g.lines([
      'k: Voilà. Là, c\'est un salon.',
      'a: On peut se voir dans le parquet...',
      'k: Reste la lessive.',
    ]);
    g.setObjective('Lance une machine.');
  }
}

async function talkAntoine(G, a) {
  if (st.phase === 'clean' && !st.sat) {
    await g.lines(['k: Toi. Canapé. Tu ne bouges plus.', 'a: Oui chef.']);
    await g.walk(a, 'ddrd'); a.dir = 'left'; // de la table jusqu'au canapé
    st.sat = true; st.apos = { x: 14, y: 10, dir: 'left' };
    await g.say('a', '(Elle fait un peu peur. J\'aime bien.)');
  } else if (st.phase === 'clean') await g.say('a', 'Je ne bouge pas. Je respire à peine.');
  else if (g.W.dark) await g.say('a', 'Je vois rien ! Le tableau est dans la buanderie, à côté de la porte !');
  else await g.say('a', 'Besoin d\'un coup de m— non, rien. J\'ai compris.');
}

async function washer(G, o) {
  if (st.phase === 'laundry') {
    g.removeItem('Chaussette d\'Antoine');
    await g.lines(['Ketura charge la machine. La chaussette d\'Antoine y passe aussi.', 'Programme coton, 40 degrés. Départ.']);
    o.shake = true; g.sfx.rumble();
    await g.wait(1.2);
    await g.say(null, 'BRRRRRRR... La vieille machine tremble comme un tracteur.');
    g.sfx.rumble(); await g.wait(.8);
    o.shake = false; g.sfx.zap(); g.W.dark = 1;
    await g.lines([
      'CLAC !',
      'Plus de courant. Tout l\'appart est dans le noir.',
      'a: Ah... ça fait ça des fois !',
      'k: Le différentiel a sauté. Défaut d\'isolement sur la machine, à tous les coups.',
      'k: Bon. Le tableau électrique.',
    ]);
    st.phase = 'panel1';
    g.setObjective('Trouve le tableau électrique.');
  } else if (st.phase === 'panel1') await g.say('k', 'Je ne touche à rien tant que le circuit n\'est pas consigné. D\'abord le tableau.');
  else if (st.phase === 'repair') {
    await g.lines(['Ketura tire la machine et ouvre le capot arrière.', 'Le fil de phase a fondu sur le bornier. Les trois conducteurs pendent.']);
    if (!await g.playMini(cablage(g))) return;
    st.phase = 'panel2';
    await g.say('k', 'Recâblé. Il n\'y a plus qu\'à remettre le départ en service.');
    g.setObjective('Réarme le départ de la machine.');
  } else if (st.phase === 'panel2') await g.say('k', 'C\'est réparé. Il faut réarmer son disjoncteur au tableau.');
}

async function panel() {
  if (st.phase === 'panel1') {
    await g.say(null, 'Ketura éclaire le tableau avec son téléphone. Le différentiel général est tombé.');
    if (!await g.playMini(disjoncteur(g))) return;
    g.W.dark = 0;
    st.phase = 'repair';
    await g.lines([
      'a: Oh ! La lumière !',
      'k: Départ machine coupé, donc consigné. Maintenant, on peut intervenir en sécurité.',
    ]);
    g.setObjective('Répare la machine à laver.');
  } else if (st.phase === 'panel2') {
    const w = g.W.map.all.find(o => o.id === 'washer');
    await g.say(null, 'Ketura rouvre le tableau. Le départ « Machine à laver » est toujours coupé.');
    if (!await g.playMini(disjoncteur(g, { rearm: true }))) return;
    w.spin = true;
    await g.lines(['La machine redémarre. Elle ronronne.', 'Plus un seul bruit de tracteur.']);
    await finale();
  }
}

async function finale() {
  st.phase = 'end';
  g.setObjective('');
  await g.fadeTo(1, .4);
  // vus de profil : Ketura à gauche, Antoine à droite, avec de la place derrière lui pour tomber
  st.apos = { x: 11, y: 8, dir: 'left' };
  g.load('rdc', 10, 8, 'right');
  await g.fadeTo(0, .4);
  const p = g.W.p, a = g.npc('antoine');
  await g.lines([
    'a: Attends. Tu viens de réparer la machine ? Toute seule ?',
    'k: Un fil de phase fondu sur le bornier. Rien de méchant.',
    'a: ... T\'es électricienne ?',
    'k: BTS électrotechnique, au lycée Félix Le Dantec.',
    'k: Plus tard, je veux travailler dans l\'énergie. Les éoliennes, le photovoltaïque...',
    'k: Et les transformateurs.',
    'a: Les transformateurs ?',
    'k: C\'est beau, un transformateur.',
  ]);
  await g.emote(p, 'heart', 1);
  await g.say(null, 'Pour la première fois, Ketura sourit.');
  await g.emote(a, '!', .8);
  await g.lines(['a: (Elle a souri !!)', 'Un silence complice s\'installe entre les deux colocs.', 'Et puis...']);
  g.sfx.prout();
  g.W.cloud = { x: p.px + 8, y: p.py + 8, t0: g.W.t, max: 54 };
  await g.wait(.9);
  await g.say(null, '*PROUT*');
  await g.emote(a, '?', .9);
  await g.lines(['a: C\'est... c\'est toi qui...', 'k: Non.', 'Le nuage atteint Antoine.']);
  await g.emote(a, 'sweat', .8);
  await g.say('a', 'C\'est... très... efficace...');
  a.ko = true; g.sfx.bump();
  await g.wait(.6);
  g.sfx.win();
  await g.lines(['Antoine est K.O. !', 'k: ... Oups.']);
  g.fadeMusic();
  await g.fadeTo(1, 1.2);
  await g.startChapter(3);
}

// La machine est un objet de la carte : on remet son état à zéro à chaque (re)démarrage du chapitre
function resetWasher() { const w = rdc.objects.find(o => o.id === 'washer'); w.spin = false; w.shake = false; }

export default {
  getState: () => st,
  resume(G, s) { g = G; st = s; resetWasher(); },
  async start(G) {
    g = G;
    resetWasher();
    st = { phase: 'wake', cleaned: 0, total: STAINS.length, drops: 0, sat: false, apos: { ...ANTOINE_TABLE }, stains: STAINS.map(([x, y, type]) => ({ x, y, type, hits: 0 })) };
    g.load('etage', 19, 8, 'up');
    g.setObjective('');
    await g.card('Chapitre 2', 'Opération Propreté');
    await g.fadeTo(0, .6);
    await g.lines([
      'Le lendemain matin.',
      'Les cartons sont vides. Les vêtements sont pliés dans l\'armoire, par couleur.',
      'Les cours sont rangés sur le bureau, classés par matière. Avec des intercalaires.',
      'k: ...',
      'k: J\'ai tout rangé cette nuit. Puis j\'ai révisé les couplages étoile-triangle.',
      'k: Jusqu\'à quatre heures du matin.',
    ]);
    await g.emote(g.W.p, 'sweat', .9);
    await g.lines(['k: J\'aurais pas dû.', 'k: Allez. Petit-déjeuner. Un thé. Bien fort.']);
    g.setObjective('Descends au salon.');
  },
  objects(id) {
    if (id !== 'rdc') return [];
    return st.stains.map(s => ({ t: 'stain', id: 'stain', spot: 1, x: s.x, y: s.y, v: s.type, ref: s }));
  },
  npcs(id) { return id === 'rdc' ? [{ id: 'antoine', look: 'antoine', ...st.apos, talk: talkAntoine }] : []; },
  enter(id) { if (id === 'rdc' && st.phase === 'wake') return discover; },
  act(id, o) {
    if (id === 'stain') return st.phase === 'clean' ? scrub : null;
    if (id === 'washer' && ['laundry', 'panel1', 'repair', 'panel2'].includes(st.phase)) return washer;
    if (id === 'panel' && (st.phase === 'panel1' || st.phase === 'panel2')) return panel;
    if (id === 'bedK') return () => g.lines(['k: Le lit est fait. On n\'y touche plus avant ce soir.']);
  },
};
