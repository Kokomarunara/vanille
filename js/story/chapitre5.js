// Chapitre 5 — Tempête sur le réseau.
// Veille d'anniversaire : la tempête plonge Lannion dans le noir, Chou a disparu en laissant un mot.
// Ketura répare le poste, court jusqu'au parc éolien, relance les machines... et trouve ce qui l'attendait.
import { WHO } from '../engine/dialogue.js';
import { transfo } from '../minigames/transfo.js';
import { course } from '../minigames/course.js';
import { eolienne } from '../minigames/eolienne.js';
import { playFinale } from './final.js';
import posteMap from '../maps/poste.js';

Object.assign(WHO, {
  r: { name: 'Mme Kervarrec', color: '#4a4a58' },
  j: { name: 'Maxime', color: '#3f7a54' },
  t: { name: 'Florian', color: '#1f3c84' },
});

let g, st;
const TURB = [[5, 8], [13, 6], [21, 8]]; // position des trois éoliennes sur la carte du parc
const nOn = () => st.on.filter(Boolean).length;

// Météo, tenue et obscurité selon le moment du chapitre (au lancement comme à la reprise d'une sauvegarde)
function ambiance() {
  const W = g.W;
  W.look = st.pro ? 'ketura_pro' : 'ketura';
  if (W.p) W.p.look = W.look;
  W.weather = st.phase === 'tp' || st.phase === 'final' ? null : 'storm';
  W.tint = st.phase === 'final' ? 'rgba(255,150,80,.2)' : null;
  // le transformateur du poste ronronne une fois réparé
  posteMap.objects.find(o => o.id === 'transfo').on = ['run', 'parc', 'final'].includes(st.phase);
}

// ---------- le lycée ----------
// Mme Kervarrec, la prof préférée de Ketura : on peut lui parler avant le TP
async function talkProf() {
  if (st.phase !== 'tp') { await g.lines(['r: Restez calmes, ça va revenir.']); return; }
  if (st.profTalk) { await g.lines(['r: Ta paillasse t\'attend, Ketura. Je viens voir ton montage dans cinq minutes.']); return; }
  st.profTalk = true;
  await g.lines([
    'r: Ah, Ketura. Ton dernier compte rendu sur les couplages était remarquable.',
    'r: Clair, rigoureux, et propre. Même la mise en page.',
    'k: J\'aime quand c\'est rangé.',
    'r: Ça se voit. Un bon électrotechnicien, c\'est d\'abord quelqu\'un d\'ordonné.',
  ]);
  await g.emote(g.W.p, 'heart', .9);
  await g.say('r', 'Allez, à ta paillasse. Je compte sur toi pour montrer l\'exemple.');
}

async function tp() {
  if (st.phase !== 'tp') return;
  await g.lines([
    'Sur la paillasse : un transformateur monophasé et deux multimètres.',
    'r: Ketura, à toi. Primaire : 400 volts, 200 spires. Secondaire : 100 spires.',
    'r: Quelle tension au secondaire ?',
  ]);
  const k = await g.choose(['100 V', '200 V', '800 V']);
  if (k === 1) {
    await g.lines(['r: Exact. Comme toujours.', 'r: Tu sais, Ketura, des élèves qui comprennent ce qui se passe DANS le transformateur, j\'en ai peu.', 'r: Tu iras loin. Dans l\'énergie, j\'en suis sûre.']);
    await g.emote(g.W.p, 'heart', .9);
    await g.say('k', 'Merci, madame.');
  }
  else await g.lines(['r: Presque. Le rapport de transformation, c\'est N2 sur N1...', 'k: 100 sur 200, un demi. Donc 200 volts.', 'r: Voilà. Je savais que tu le trouverais toute seule.']);
  await g.lines([
    'j: Tu m\'expliqueras les couplages ? J\'ai rien compris.',
    'k: Demain, promis.',
    'j: Demain, c\'est pas ton anniversaire ?',
    'k: ... Chut.',
  ]);
  g.sfx.rumble(); await g.wait(.9);
  g.sfx.zap(); g.W.dark = 1;
  await g.lines([
    'CLAC !',
    'Un éclair, et toute la salle plonge dans le noir.',
    'r: Coupure générale ! Personne ne touche aux paillasses.',
    'Le téléphone de Ketura vibre. C\'est Florian Le Cornec, son tuteur de stage chez Enedis.',
    't: Ketura ? La foudre est tombée sur le poste au bout de ta rue. La moitié de Lannion est dans le noir.',
    't: Toute l\'équipe est déjà sur d\'autres pannes. J\'ai besoin de toi.',
    'k: J\'arrive. Je passe prendre ma tenue.',
    'Ketura se tourne vers Mme Kervarrec. Elle a tout entendu.',
    'r: Enedis t\'appelle ? Alors file.',
    'r: Consignation, vérification, sécurité. Comme je te l\'ai appris. Et montre-leur ce que tu sais faire.',
    'k: (Je ne vous décevrai pas, madame.)',
    'En chemin, elle appelle Chou. Une fois. Deux fois. Pas de réponse.',
  ]);
  await g.fadeTo(1, .6);
  st.phase = 'home'; ambiance();
  g.load('etage', 19, 7, 'up');
  await g.fadeTo(0, .6);
  await g.lines(['L\'appart est plongé dans le noir.', 'k: Chou ? T\'es là ?', 'Personne.']);
  g.setObjective('Enfile ta tenue d\'intervention.');
}

// ---------- l'appart dans le noir ----------
async function dressUp() {
  await g.say(null, 'Veste, casque, gants isolants, chaussures de sécurité.');
  await g.fadeTo(1, .3);
  st.pro = true; ambiance(); g.refresh();
  await g.fadeTo(0, .3);
  await g.lines(['k: Prête.', 'En refermant l\'armoire, elle aperçoit un papier posé sur son bureau.']);
  g.setObjective('Lis le mot sur ton bureau.');
}

async function note() {
  st.note = true; st.phase = 'goposte'; g.refresh();
  await g.lines([
    'Un mot. L\'écriture de Chou.',
    '« Mamour, si tu lis ça dans le noir, c\'est que la tempête a été plus rapide que moi. »',
    '« Fais ce que tu sais faire. Et quand la lumière sera revenue... »',
    '« ... rejoins-moi là où le vent travaille pour nous. »',
    'k: Là où le vent travaille pour nous ?',
    'k: Qu\'est-ce qu\'il mijote, celui-là...',
  ]);
  g.addItem('Mot de Chou', '« Rejoins-moi là où le vent travaille pour nous. »');
  g.setObjective('Rejoins Florian au poste électrique.');
}

// ---------- le poste électrique ----------
async function arrivePoste() {
  st.phase = 'poste';
  await g.lines([
    't: Ah, te voilà ! Regarde-moi ce bazar.',
    't: Un fusible haute tension a fondu avec la foudre. Il faut consigner, le remplacer, puis remettre les départs.',
    't: Je te laisse faire. Je vérifie derrière toi. Comme à l\'examen.',
    'k: Comme à l\'examen.',
  ]);
  g.setObjective('Répare le poste.');
}

async function repair() {
  await g.say(null, 'Ketura ouvre la porte du poste. Derrière : les cellules haute tension.');
  if (!await g.playMini(transfo(g))) return;
  st.phase = 'run'; g.W.dark = 0; ambiance(); g.refresh();
  g.setObjective('');
  await g.lines([
    'Le transformateur se remet à ronronner.',
    'Au bout de la rue, une fenêtre s\'allume. Puis une autre.',
    't: Beau travail. Vraiment.',
    't: Mais on manque de puissance. Avec les rafales, le parc éolien de la côte s\'est mis en sécurité.',
    't: Il faudrait quelqu\'un là-haut pour le relancer à la main. Et la route est coupée par un arbre.',
    'k: ...',
    'k: Le sentier côtier, lui, n\'est pas coupé.',
    't: À pied ? C\'est à quatre kilomètres !',
    'k: Justement.',
    'Ketura resserre ses lacets.',
  ]);
  const hits = await g.playMini(course(g));
  await g.fadeTo(1, .01);
  st.phase = 'parc'; ambiance();
  g.load('parc', 1, 12, 'right');
  await g.fadeTo(0, .7);
  await g.lines([
    hits === 0 ? 'Quatre kilomètres. Pas une flaque, pas une branche. Un sans-faute.' : `Quatre kilomètres, ${hits} éclaboussure${hits > 1 ? 's' : ''}... et pas une seconde de perdue.`,
    'Le parc éolien de la côte. Trois machines, toutes à l\'arrêt.',
    'k: « Là où le vent travaille pour nous. »',
    'k: Chou... ?',
    'Personne. Juste le vent.',
  ]);
  g.setObjective('Relance les éoliennes : 0/3');
}

// ---------- le parc éolien ----------
async function restart(i) {
  if (st.on[i]) { await g.say(null, 'Elle tourne. Le vent travaille.'); return; }
  await g.say(null, 'Ketura ouvre l\'armoire de commande au pied du mât.');
  if (!await g.playMini(eolienne(g, nOn()))) return;
  st.on[i] = true; g.refresh();
  const n = nOn();
  g.setObjective(n < 3 ? `Relance les éoliennes : ${n}/3` : '');
  if (n === 1) await g.lines(['La première machine repart. Ses pales fendent la pluie.']);
  else if (n === 2) await g.lines(['Deux sur trois. Vers l\'ouest, le ciel s\'éclaircit.']);
  else await ending(i);
}

async function ending(i) {
  const p = g.W.p, [tx, ty] = TURB[i];
  st.phase = 'final';
  await g.say(null, 'La troisième éolienne s\'ébranle, lentement, puis de plus en plus vite.');
  ambiance(); g.sfx.win();
  await g.wait(.8);
  await g.lines(['La pluie s\'arrête d\'un coup. Le soleil perce sous les nuages.']);
  // Chou sort de derrière la dernière éolienne, du côté où Ketura n'est pas
  const side = p.x > tx ? -1 : 1;
  st.apos = { x: tx + side, y: ty, dir: side > 0 ? 'left' : 'right' };
  g.refresh();
  const a = g.npc('antoine');
  a.dir = p.x === a.x ? (p.y > a.y ? 'down' : 'up') : (p.x > a.x ? 'right' : 'left');
  await g.emote(p, '!', .9);
  await g.lines([
    'Une silhouette sort de derrière le mât.',
    'k: Chou ?!',
    'a: Tu en as mis, du temps. J\'ai failli manger le gâteau tout seul.',
    'k: Qu\'est-ce que tu fais là ?!',
    'a: Je t\'attends depuis ce matin. « Là où le vent travaille pour nous. »',
    'a: La tempête n\'était pas prévue au programme. Mais toi, je savais que tu viendrais.',
    'a: Viens voir.',
  ]);
  await g.fadeTo(1, .8);
  await playFinale(g);
  g.endGame();
}

export default {
  getState: () => st,
  resume(G, s) { g = G; st = s; ambiance(); },
  afterResume() { ambiance(); },
  async start(G) {
    g = G;
    st = { phase: 'tp', pro: false, note: false, on: [false, false, false], apos: null };
    ambiance();
    g.load('lycee', 3, 8, 'up');
    g.setObjective('');
    await g.card('Chapitre 5', 'Tempête sur le réseau');
    await g.fadeTo(0, .6);
    await g.lines([
      'Quelques mois plus tard. Lycée Félix Le Dantec, salle de TP.',
      'Dehors, le vent se lève sur la baie de Lannion.',
      'Au tableau : Mme Kervarrec. Agrégée, exigeante, toujours juste. La prof préférée de Ketura.',
      'Avec elle, un transformateur devient presque de la poésie.',
      'r: Avis de tempête pour ce soir. On termine ce TP et tout le monde rentre.',
      'r: Et on ne bâcle rien. Le vent n\'est pas une excuse pour un câblage approximatif.',
    ]);
    await g.emote(g.W.p, 'heart', .9);
    await g.say('k', '(Mme Kervarrec. C\'est grâce à elle que j\'aime autant l\'électrotechnique.)');
    g.setObjective('Termine ton TP.');
  },
  objects(id) {
    const o = [];
    if (id === 'etage' && st.pro && !st.note) o.push({ t: 'marker', id: 'noteMark', x: 13, y: 2, spot: 1 });
    if (id === 'parc') TURB.forEach(([x, y], i) => o.push({ t: 'turbine', id: 't' + i, x, y, on: st.on[i] }));
    return o;
  },
  npcs(id) {
    if (id === 'lycee') return [
      { id: 'prof', look: 'prof', x: 7, y: 2, dir: 'down', talk: talkProf },
      { id: 'maxime', look: 'eleve', x: 11, y: 8, dir: 'up', talk: () => g.lines(['j: Mon montage fait un bruit bizarre. C\'est normal ?', 'k: Non.']) },
    ];
    if (id === 'poste') return [{ id: 'florian', look: 'florian', x: 8, y: 6, dir: 'down', talk: () => g.lines(st.phase === 'poste' ? ['t: La porte du poste est juste là. Consignation d\'abord, hein.'] : ['t: File, je gère le reste !']) }];
    if (id === 'parc' && st.apos) return [{ id: 'antoine', look: 'antoine', ...st.apos }];
    return [];
  },
  gate(wp) {
    if (wp.to === 'marche') return () => g.lines(['k: Pas le moment de faire des courses.']);
    if (wp.to === 'poste' && (st.phase === 'tp' || st.phase === 'home')) return () => g.lines([st.pro ? 'k: Il y a un papier sur mon bureau. Je regarde ça d\'abord.' : 'k: D\'abord ma tenue.']);
    if (wp.to === 'rue' && st.phase === 'poste') return () => g.lines(['k: Pas avant d\'avoir remis le courant.']);
  },
  enter(id) { if (id === 'poste' && st.phase === 'goposte') return arrivePoste; },
  act(id, o) {
    if (id === 'benchK' && st.phase === 'tp') return tp;
    if (id === 'wardrobeK' && st.phase === 'home' && !st.pro) return dressUp;
    if ((id === 'deskK' || id === 'noteMark') && st.pro && !st.note) return note;
    if (id === 'sofa') return () => g.lines(['Le canapé est vide.', 'k: Ça ne lui ressemble pas, de sortir par ce temps.']);
    if (id === 'bedK') return () => g.lines(['k: Dormir ? Avec la moitié de la ville dans le noir ?']);
    if (id === 'cellule' && st.phase === 'poste') return repair;
    if (id === 'transfo' && st.phase === 'poste') return () => g.lines(['Le transformateur est silencieux. Trop silencieux.', 'k: On va te réveiller, toi.']);
    if (st.phase === 'parc' && /^t[012]$/.test(id)) return () => restart(+id[1]);
  },
};
