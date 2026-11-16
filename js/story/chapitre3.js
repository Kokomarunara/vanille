// Chapitre 3 — Un goût d'Haïti.
// Courses au marché de Lannion, sprint pour le dernier giraumon, cuisine, et un dîner où Ketura commence à draguer.
import { WHO } from '../engine/dialogue.js';
import { r } from '../art/tiles.js';
import { text } from '../art/text.js';
import { cuisine } from '../minigames/cuisine.js';
import { euros } from '../engine/state.js';

// Les gens du marché (onglet de nom au-dessus de la boîte de dialogue)
Object.assign(WHO, {
  y: { name: 'Yann', color: '#3f8f45' },
  b: { name: 'Le boucher', color: '#a83a34' },
  c: { name: 'La crêpière', color: '#c88820' },
  p: { name: 'Le poissonnier', color: '#2c5ea0' },
  e: { name: 'L\'épicier', color: '#2c6e50' },
  m: { name: 'Mamie Soizic', color: '#7a5c98' },
  l: { name: 'Loïc', color: '#b08a10' },
});

let g, st;

const LIST = [
  ['leg', 'Légumes à soupe', 'Carottes, chou, navets, poireaux : la base de la soup joumou.', 3.5],
  ['boeuf', 'Bœuf à mijoter', 'Du paleron, à faire mariner au citron, à l\'ail et au piment.', 6],
  ['pois', 'Pois rouges', 'Pour le riz sauce pois.', 2.5],
  ['bananes', 'Bananes plantain', 'Bien vertes. À écraser et à frire deux fois : les bananes pesées.', 3],
  ['giraumon', 'Giraumon', 'La courge des Antilles. Sans elle, pas de soup joumou.', 2],
];
const count = () => LIST.filter(([k]) => st.got[k]).length;
const hasAll = () => count() === LIST.length;

function updateList() {
  const it = g.S.bag.find(i => i.name === 'Liste de courses');
  if (it) it.desc = LIST.map(([k, n]) => `${st.got[k] ? '[x]' : '[ ]'} ${n}`).join('   ');
}
function objective() {
  if (st.phase !== 'shop') return;
  g.setObjective(hasAll() ? 'Rentre à l\'appart.' : `Fais les courses : ${count()}/${LIST.length}`);
}

async function buy(key) {
  const [, name, desc, price] = LIST.find(l => l[0] === key);
  g.S.money -= price; st.got[key] = true;
  g.addItem(name, desc); updateList();
  g.sfx.ok();
  await g.say(null, `${name} : ${euros(price)}. Il reste ${euros(g.S.money)} dans le porte-monnaie.`);
  objective();
  if (hasAll()) await g.say('k', 'J\'ai tout. À la maison !');
}

// ---------- le marché ----------
async function talkLeg() {
  if (!st.got.leg) {
    await g.lines(['y: Bonjour ! Qu\'est-ce que je vous sers ?', 'k: Carottes, chou, navets, poireaux. C\'est pour une soupe.', 'y: Ça marche. Tout frais de ce matin !']);
    await buy('leg');
  }
  if (!st.got.giraumon && !st.asked) {
    st.asked = true;
    await g.lines([
      'k: Et vous auriez du giraumon ?',
      'y: Du quoi ?',
      'k: Du giraumon. Une courge des Antilles.',
      'y: Ah ! J\'ai mieux : une citrouille d\'Halloween. Avec le sourire déjà sculpté !',
    ]);
    await g.choose(['Non merci.', 'Ce n\'est PAS pareil.']);
    await g.lines(['y: Bon, bon. Voyez à l\'épicerie du monde, au coin de la place.']);
  } else if (!st.got.giraumon) await g.lines(['y: Toujours pas tentée par la citrouille ?', 'k: Toujours pas.']);
  else await g.lines(['y: Vous l\'avez trouvé, votre giraumon ? Faudra me faire goûter cette soupe !']);
}

async function talkBoucher() {
  if (st.got.boeuf) { await g.lines(['b: Faites-le bien mariner, hein !', 'k: Citron, ail, piment. Je sais.']); return; }
  await g.lines(['b: Madame ?', 'k: Du bœuf à mijoter, s\'il vous plaît.', 'b: Du paleron. Parfait pour une soupe.']);
  await buy('boeuf');
}

async function talkCrepes() {
  if (st.crepe) { await g.say('c', 'Elle était bonne, hein ? C\'est le beurre salé.'); return; }
  await g.say('c', 'Une crêpe beurre-sucre, toute chaude ? 2,50 € !');
  const need = LIST.filter(([k]) => !st.got[k]).reduce((s, l) => s + l[3], 0);
  const k = await g.choose(['Une crêpe, oui !', 'Non merci.']);
  if (k === 1) { await g.say('c', 'Une autre fois !'); return; }
  if (g.S.money - 2.5 < need) { await g.say('k', 'Hmm. Les courses d\'abord. Je compte mes sous.'); return; }
  g.S.money -= 2.5; st.crepe = true; g.sfx.ok();
  await g.lines(['Ketura mange sa crêpe en trois bouchées.', 'k: Bon. La Bretagne a quand même du bon.']);
}

const talkPoisson = () => g.lines(['p: Maquereaux de ce matin ! Pêchés au large de Perros !', 'k: Pas aujourd\'hui, merci.']);

async function talkMamie() {
  if (st.got.giraumon) await g.lines(['m: Alors, vous l\'avez eu, votre légume ? Vous avez filé comme une flèche !']);
  else await g.lines(['m: Je vous vois courir tous les matins sur le chemin de halage, vous.', 'm: Vous allez drôlement vite.', 'k: C\'est ma passion.']);
}

// ---------- l'épicerie ----------
async function talkEpicier() {
  if (st.got.pois) {
    if (!st.got.bananes) await g.say('e', 'Les bananes plantain sont tout au fond, derrière les sacs de riz.');
    else if (!st.got.giraumon) await g.say('e', 'Dépêchez-vous, Loïc repart à midi pile !');
    else await g.say('e', 'Bonne soupe ! Et bon appétit à votre invité.');
    return;
  }
  await g.lines([
    'e: Bonjour ! Bienvenue à l\'épicerie du monde.',
    'k: Bonjour. Il me faut des pois rouges, des bananes plantain et du giraumon.',
    'e: De la soup joumou ? Quelqu\'un a de la chance, ce soir.',
    'e: Les pois rouges, les voilà.',
  ]);
  await buy('pois');
  if (!st.got.bananes) await g.say('e', 'Les bananes plantain sont tout au fond, derrière les sacs de riz. Servez-vous.');
  if (!st.got.giraumon) {
    await g.say('e', 'Le giraumon, par contre... j\'ai vendu le dernier ce matin.');
    await g.emote(g.W.p, '...', .9);
    await g.lines([
      'e: Mais Loïc, un maraîcher du coin, en fait pousser sous serre. Il livre sur la place en ce moment.',
      'e: Son camion est tout au bout, de l\'autre côté de la fontaine.',
      'e: Dépêchez-vous : il repart à midi pile. Et il est midi moins une.',
    ]);
    st.van = true;
  }
}

async function takeBananas() {
  if (st.got.bananes) { await g.say(null, 'Il reste quelques bananes plantain dans la cagette.'); return; }
  if (!st.got.pois) { await g.lines(['Des bananes plantain, bien vertes. Parfaites.', 'k: Je vais d\'abord dire bonjour à l\'épicier.']); return; }
  await g.lines(['Des bananes plantain, bien vertes. Parfaites pour les peser.', 'Ketura en choisit quatre et passe à la caisse.']);
  await buy('bananes');
}

// ---------- le sprint pour le dernier giraumon ----------
function hud(c) {
  const s = st.sprint;
  if (!s) return;
  const late = s.t <= 0;
  r(c, 150, 5, 102, 16, '#1c2a3c'); r(c, 151, 6, 100, 14, late ? '#f8d8d8' : '#fbf8ee');
  text(c, late ? 'Midi pile !' : `Midi dans ${Math.ceil(s.t)} s`, 201, 4, late ? '#c0405a' : '#34506e', 'center');
}
function armSprint() {
  g.W.hud = hud;
  g.W.tickHook = dt => {
    const s = st.sprint;
    if (!s || s.t <= 0) return;
    const before = Math.ceil(s.t);
    s.t -= dt;
    if (Math.ceil(s.t) < before && s.t > 0 && s.t < 5) g.sfx.move();
    if (s.t <= 0) { s.t = 0; g.sfx.clac(); }
  };
}
async function startSprint() {
  await g.lines(['Midi moins une. Le camion de Loïc est tout au bout de la place.', 'k: Cours, Ketoo. Cours !', 'Maintiens B pour courir.']);
  st.sprint = { t: 8 };
  armSprint();
  g.setObjective('Rattrape le camion de Loïc !');
}

async function talkLoic() {
  const late = st.sprint && st.sprint.t <= 0;
  st.sprint = null; g.W.hud = null; g.W.tickHook = null;
  if (st.got.giraumon) { await g.lines(['l: Régalez-vous ! Et gardez-moi les graines, hein.']); return; }
  if (late) await g.lines([
    'Midi sonne au clocher. Le camion démarre... tousse... et cale.',
    'l: Ah, cette batterie !',
    'k: Vos cosses sont oxydées. Un coup de brosse métallique et ça repart.',
    'l: ... Vous êtes garagiste ?',
    'k: Électrotechnicienne. Et il me faut un giraumon.',
  ]);
  else await g.lines([
    'l: Holà ! Vous avez failli me rater, je pars dans dix secondes !',
    'k: Un... giraumon... s\'il vous plaît.',
    'l: Reprenez votre souffle ! Vous courez vite, dites donc.',
    'k: C\'est ma passion.',
  ]);
  await g.say('l', 'Tenez, c\'est mon dernier. Il vous attendait.');
  await buy('giraumon');
}

// ---------- retour à l'appart : cuisine et dîner ----------
async function comeHome() {
  st.phase = 'cook';
  const a = g.npc('antoine');
  await g.emote(a, '!', .7);
  await g.lines(['a: Ça y est, t\'as tout trouvé ?', 'k: Même le giraumon. J\'ai dû courir.', 'a: Je peux aider ?']);
  const k = await g.choose(['Non.', 'Tu peux mettre la table.']);
  if (k === 0) await g.lines(['a: Je m\'en doutais.', 'k: ...', 'k: Bon. Tu peux mettre la table.']);
  await g.emote(a, 'note', .8);
  await g.say('a', 'Avec plaisir !');
  g.setObjective('Prépare le repas.');
}

async function cook() {
  await g.lines(['Le bœuf marine dans le citron, l\'ail et le piment.', 'Le giraumon attend sur la planche.', 'k: Allez. Comme à la maison.']);
  st.stars = await g.playMini(cuisine(g));
  for (const [, name] of LIST) g.removeItem(name);
  g.removeItem('Liste de courses');
  await g.say(null, st.stars === 3 ? 'Tout l\'appart sent Port-au-Prince un dimanche matin.'
    : st.stars === 2 ? 'Ça sent drôlement bon dans tout l\'appart.' : 'C\'est un peu accroché au fond, mais ça sent bon quand même.');
  await dinner();
}

async function dinner() {
  st.phase = 'dinner'; st.dish = 'meal';
  g.setObjective('');
  await g.fadeTo(1, .5);
  st.apos = { x: 14, y: 5, dir: 'down' };
  g.load('rdc', 14, 8, 'up');
  const p = g.W.p, a = g.npc('antoine');
  p.top = a.top = true; // assis à table : dessinés par-dessus les chaises
  await g.fadeTo(0, .6);
  await g.lines([
    'La table est mise. Antoine a même plié les serviettes.',
    'a: Alors... c\'est quoi, tout ça ?',
    'k: Soup joumou, bananes pesées, riz sauce pois.',
    'Antoine goûte la soupe.',
  ]);
  await g.emote(a, '!', .8);
  await g.lines([
    'a: Mais c\'est incroyable !',
    'k: Chez moi, on la mange le premier janvier. Pour fêter l\'indépendance d\'Haïti.',
    'k: Avant 1804, les esclaves n\'avaient pas le droit d\'y toucher. Depuis, c\'est la soupe de la liberté.',
    'a: ... Et tu me fais goûter ça à moi.',
    'a: Tu cuisines souvent comme ça ?',
  ]);
  let bold = await g.choose(['Pour les gens que j\'aime bien.', 'Pour les colocs mignons.', 'Seulement pour toi.']);
  await g.emote(a, bold ? 'heart' : '...', .9);
  await g.lines([
    bold === 2 ? 'a: Pour... Ah. Oh. D\'accord.' : bold === 1 ? 'a: Mignon ? Moi ? Il n\'y a qu\'un coloc, ici...' : 'a: Les gens que t\'aimes bien. OK. Cool. Très cool.',
    'Antoine fait tomber sa cuillère.',
    'a: Je... tu veux de l\'eau ? Je vais chercher de l\'eau.',
  ]);
  const b2 = await g.choose(['Je veux bien. Merci, Antoine.', 'Reste assis. T\'es bien, là.', 'Je préfère te regarder manger.']);
  bold += b2;
  await g.emote(a, b2 ? 'sweat' : 'note', .9);
  await g.lines([
    b2 === 2 ? 'a: Me regarder... manger. Bien sûr. Normal.' : b2 === 1 ? 'a: Je suis bien. Oui. Très bien, même.' : 'a: Elle a dit mon prénom...',
    'Les bols se vident. Les bananes pesées disparaissent une à une.',
  ]);
  st.dish = 'dessert'; g.refresh();
  await g.lines([
    'Pour finir, Ketura sort deux petites crèmes du frigo.',
    'k: Vanille. Mon parfum préféré.',
    'a: T\'en as un peu, là. Au coin de la bouche.',
  ]);
  const b3 = await g.choose(['Où ça ?', 'Enlève-la-moi.', 'Viens la chercher.']);
  bold += b3;
  await g.emote(a, b3 ? 'heart' : '?', 1);
  await g.lines([
    b3 === 2 ? 'Antoine devient rouge jusqu\'aux oreilles.' : b3 === 1 ? 'Antoine tend sa serviette. Sa main tremble un peu.' : 'a: Là. Non, là. Juste... là.',
    bold >= 4 ? 'k: (Il est fichu. Il ne le sait pas encore.)' : 'k: (Il rougit. C\'est bon signe.)',
    'Ce soir-là, Antoine comprit deux choses.',
    'Un : la soup joumou, c\'est délicieux.',
    'Deux : il était dans de beaux draps.',
    'Et puis...',
  ]);
  g.sfx.prout();
  g.W.cloud = { x: p.px + 8, y: p.py + 8, t0: g.W.t, max: 30 };
  await g.wait(.8);
  await g.lines(['*prout*', 'a: ...', 'a: C\'est les pois ?', 'k: C\'est les pois.']);
  await g.emote(a, 'note', .8);
  await g.lines(['Ils éclatent de rire tous les deux.', 'Cette fois, Antoine tient debout. Il progresse.']);
  g.fadeMusic();
  await g.fadeTo(1, 1.2);
  await g.startChapter(4);
}

async function talkAntoine() {
  if (st.phase === 'intro') return;
  if (st.phase === 'shop') await g.lines(['a: T\'es sûre que tu ne veux pas que je vienne porter les sacs ?', 'k: Sûre.']);
  else await g.lines(['a: La table est mise ! Les couverts sont dans le bon sens, j\'ai vérifié.']);
}

export default {
  getState: () => st,
  resume(G, s) { g = G; st = s; },
  afterResume() { if (st.sprint) armSprint(); },
  async start(G) {
    g = G;
    st = { phase: 'intro', got: {}, asked: false, van: false, sprint: null, crepe: false, stars: 0, dish: null, apos: { x: 11, y: 3, dir: 'left' } }; // près de la fenêtre du salon (à l'ancienne place de l'escalier), le soir
    g.load('rdc', 10, 3, 'right');
    g.setObjective('');
    await g.card('Chapitre 3', 'Un goût d\'Haïti');
    await g.fadeTo(0, .6);
    const a = g.npc('antoine');
    await g.lines([
      'Quelques semaines ont passé. La coloc a trouvé son rythme.',
      'a: T\'as l\'air ailleurs, ce soir.',
      'k: Je pensais à la maison. À Haïti.',
      'k: Ce qui me manque le plus, c\'est la cuisine de ma mère.',
      'a: C\'est quoi, ton plat préféré ?',
      'k: La soup joumou. Avec des bananes pesées et du riz sauce pois.',
      'a: Je ne connais rien de tout ça.',
      'k: ...',
      'k: Demain soir, je cuisine. Pour deux.',
    ]);
    await g.emote(a, '!', .8);
    await g.lines(['a: Pour deux ? Genre... toi et moi ?', 'k: Tu vois quelqu\'un d\'autre dans cette coloc ?']);
    await g.fadeTo(1, .6);
    st.phase = 'shop';
    st.apos = { x: 14, y: 10, dir: 'left' }; // pendant les courses, il attend sur le canapé
    g.addItem('Liste de courses', '');
    updateList();
    g.load('rue', 9, 5, 'down');
    await g.fadeTo(0, .6);
    await g.lines(['Le lendemain. Jour de marché à Lannion.', 'k: Légumes, bœuf, pois, bananes plantain... et un giraumon.', 'k: Le marché est au bout de la rue.']);
    objective();
  },
  objects(id) {
    const o = [];
    if (id === 'marche' && st.van) o.push({ t: 'van', id: 'van', x: 21, y: 13, w: 3, h: 2, text: ['Le camion de Loïc. Il sent la terre et les légumes frais.'] });
    if (id === 'rdc' && st.dish) o.push({ t: 'dinner', id: 'dinner', v: st.dish, x: 14, y: 6, w: 3, h: 2 });
    return o;
  },
  npcs(id) {
    if (id === 'rdc') return [{ id: 'antoine', look: 'antoine', ...st.apos, talk: talkAntoine }];
    if (id === 'epicerie') return [{ id: 'epicier', look: 'epicier', x: 10, y: 5, dir: 'down', talk: talkEpicier }];
    if (id === 'marche') {
      const n = [
        { id: 'yann', look: 'yann', x: 9, y: 7, dir: 'down', talk: talkLeg },
        { id: 'crepiere', look: 'crepiere', x: 15, y: 7, dir: 'down', talk: talkCrepes },
        { id: 'boucher', look: 'boucher', x: 21, y: 7, dir: 'down', talk: talkBoucher },
        { id: 'poissonnier', look: 'poissonnier', x: 4, y: 11, dir: 'down', talk: talkPoisson },
        { id: 'mamie', look: 'mamie', x: 15, y: 13, dir: 'left', talk: talkMamie },
      ];
      if (st.van) n.push({ id: 'loic', look: 'loic', x: 20, y: 14, dir: 'left', talk: talkLoic });
      return n;
    }
    return [];
  },
  // le marché n'est ouvert que pendant les courses
  gate(wp) { if (wp.to === 'marche' && st.phase !== 'shop') return () => g.lines(['k: Plus rien à acheter. On rentre.']); },
  enter(id) {
    if (id === 'marche' && st.van && !st.got.giraumon && !st.sprint) return startSprint;
    if (id === 'rdc' && st.phase === 'shop' && hasAll()) return comeHome;
  },
  act(id) {
    if (id === 'stallLeg') return talkLeg;
    if (id === 'stallViande') return talkBoucher;
    if (id === 'stallCrepes') return talkCrepes;
    if (id === 'stallPoisson') return talkPoisson;
    if (id === 'counterShop') return talkEpicier;
    if (id === 'bananas') return takeBananas;
    if (id === 'van' && !st.got.giraumon) return talkLoic;
    if (id === 'counter' && st.phase === 'cook') return cook;
    if (id === 'cabinet' && st.phase === 'cook') return () => g.lines(['Du riz, de l\'ail, un piment qui traîne. Tout est là.']);
    if (id === 'bedK') return () => g.lines(['k: Pas le moment de dormir. J\'ai un repas à préparer.']);
  },
  step(map, x, y) {
    // pendant le sprint, arriver à côté de Loïc suffit
    if (map === 'marche' && st.sprint && Math.abs(x - 20) + Math.abs(y - 14) === 1) return talkLoic;
  },
};
