// Chapitre 4 — La chambre en plus.
// Un futur coloc doit arriver : Ketura et Antoine vont vérifier la chambre vide... et testent le lit.
import { WHO } from '../engine/dialogue.js';

let g, st;

async function antoineArrives() {
  st.phase = 'visit';
  st.apos = { x: 7, y: 6, dir: 'left' };
  g.refresh();
  const a = g.npc('antoine');
  await g.walk(a, 'l');
  st.apos = { x: 6, y: 6, dir: 'left' };
  await g.lines(['a: Me voilà ! Alors, cette chambre ?', 'k: On vérifie tout. Le bureau, la fenêtre, le lit.']);
  g.setObjective('Inspecte la chambre.');
}

async function desk() {
  if (st.seen.desk) { await g.say(null, 'Le bureau brille. On pourrait manger dessus.'); return; }
  st.seen.desk = true;
  await g.lines(['Un bureau vide, sous une fine couche de poussière.', 'Ketura sort un chiffon de sa poche.']);
  g.spark(1, 6); g.sfx.sparkle(); await g.wait(.4); g.spark(1, 5); g.sfx.sparkle(); await g.wait(.4);
  await g.lines(['a: Tu te balades avec un chiffon sur toi ?', 'k: Toujours.', 'a: (C\'est fou. J\'adore.)']);
}

async function win() {
  if (st.seen.win) { await g.say(null, 'Dehors, le vent secoue les arbres de la rue.'); return; }
  st.seen.win = true;
  await g.lines([
    'La fenêtre ferme bien. Dehors, le vent secoue les arbres de la rue.',
    'a: Il sera bien ici, le nouveau.',
    'k: Mmh. Pas trop bien quand même.',
    'a: Pourquoi ?',
    'k: Pour rien.',
  ]);
}

async function bed() {
  if (!st.seen.desk || !st.seen.win) { await g.lines(['k: Le lit en dernier. D\'abord le bureau et la fenêtre.']); return; }
  const W = g.W;
  await g.lines(['k: Il a l\'air bien, ce lit.', 'a: Faudrait le tester. Par acquis de conscience.']);
  const k = await g.choose(['Par acquis de conscience.', 'Toi d\'abord.', 'Pousse-toi, je teste.']);
  await g.say('a', k === 2 ? 'À tes ordres.' : k === 1 ? 'Ensemble, alors. À trois. Un, deux...' : 'Purement professionnel.');
  st.phase = 'bed';
  g.setObjective('');
  await g.fadeTo(1, .5);
  // tous les deux allongés sur le lit, la tête sur les oreillers
  st.apos = { x: 5, y: 11, dir: 'down' };
  g.load('etage', 3, 11, 'down');
  const p = W.p, a = g.npc('antoine');
  p.lie = a.lie = true; p.top = a.top = true;
  W.musicOverride = 'final'; // le thème tendre
  // le lit occupe la case : load() a pu poser Ketura à côté, on la remet sur le lit, à la même hauteur qu'Antoine
  p.x = 3; p.y = a.y; p.mv = null; p.px = 50; p.py = a.py; a.px = 78;
  await g.fadeTo(0, .7);
  await g.lines([
    'Ils s\'allongent côte à côte et regardent le plafond.',
    'a: Verdict ?',
    'k: Confortable.',
    'a: Très.',
    'Un silence.',
    'k: T\'as vu la tache, là-haut ? On dirait la Bretagne.',
    'a: Moi je vois plutôt un transformateur.',
  ]);
  await g.emote(p, 'note', .8);
  await g.say(null, 'Elle éclate de rire. Lui aussi.');
  const closer = async (px, ax) => { for (let i = 0; i < 8; i++) { p.px += (px - p.px) * .35; a.px += (ax - a.px) * .35; await g.wait(.05); } p.px = px; a.px = ax; };
  await closer(54, 73);
  await g.say(null, 'Ils rient tellement qu\'ils se rapprochent sans faire exprès.');
  await closer(57, 69);
  await g.lines(['Enfin... elle, un peu exprès.', 'a: Ketura...', 'k: Chut.']);
  await g.choose(['Se rapprocher encore', 'Se rapprocher encore (mais vraiment)']);
  await closer(59, 66);
  W.hearts = { t0: W.t };
  g.sfx.win();
  await g.wait(1.8);
  await g.say(null, 'Premier bisou.');
  await g.wait(1.2);
  await g.lines([
    'C\'est comme ça que tout a commencé. Dans la chambre en plus.',
    'k: ... Chou ?',
    'a: Chou ?!',
    'k: Ça te va bien.',
  ]);
  WHO.a.name = 'Chou'; // à partir d'ici, Antoine s'appelle Chou dans tout le jeu
  await g.lines([
    'a: Alors toi... tu seras Mamour.',
    'k: Mamour. Ça me va.',
    'Le futur coloc n\'a jamais su pourquoi son lit était si bien testé.',
  ]);
  g.fadeMusic();
  await g.fadeTo(1, 1);
  await g.startChapter(5);
}

async function talkAntoine() {
  if (st.phase === 'go') await g.lines(['a: Passe devant, je finis ma tasse et j\'arrive.']);
  else await g.lines(['a: Je te regarde faire. T\'es impressionnante, avec un chiffon.']);
}

export default {
  getState: () => st,
  resume(G, s) { g = G; st = s; },
  async start(G) {
    g = G;
    st = { phase: 'intro', seen: {}, apos: { x: 8, y: 5, dir: 'right' } }; // un thé à la main, contre le plan de travail
    g.load('rdc', 9, 5, 'left');
    g.setObjective('');
    await g.card('Chapitre 4', 'La chambre en plus');
    await g.fadeTo(0, .6);
    await g.lines([
      'L\'automne s\'installe sur Lannion. Un matin, autour d\'un thé dans la cuisine.',
      'Dans la coloc, on rit de plus en plus.',
      'a: Le propriétaire a appelé. Un nouveau coloc arrive le mois prochain.',
      'k: Dans la chambre en plus ?',
      'a: Oui. Il faudrait vérifier qu\'elle est en état avant.',
      'k: On y va maintenant.',
      'a: Passe devant, je finis ma tasse et j\'arrive.',
    ]);
    st.phase = 'go';
    g.setObjective('Va voir la chambre en plus.');
  },
  npcs(id) {
    if (id === 'rdc' && (st.phase === 'intro' || st.phase === 'go')) return [{ id: 'antoine', look: 'antoine', ...st.apos, talk: talkAntoine }];
    if (id === 'etage' && (st.phase === 'visit' || st.phase === 'bed')) return [{ id: 'antoine', look: 'antoine', ...st.apos, talk: talkAntoine }];
    return [];
  },
  step(map, x) { if (map === 'etage' && st.phase === 'go' && x <= 5) return antoineArrives; },
  act(id) {
    if (st.phase === 'visit') {
      if (id === 'desk17') return desk;
      if (id === 'win16') return win;
      if (id === 'bed16') return bed;
    }
    if (id === 'bedK') return () => g.lines(['k: Mon lit est fait. C\'est l\'autre chambre qu\'on doit vérifier.']);
  },
};
