// État de la partie : argent et contenu du sac.
const START_BAG = [
  { name: 'Clés de l\'appart', qty: 1, desc: 'Le trousseau de la coloc, à Lannion.' },
  { name: 'Téléphone', qty: 1, desc: 'Ton téléphone. Il a même une lampe torche.' },
];

export const S = { chapter: 1, money: 20, bag: [] };

export function resetState() {
  S.money = 20;
  S.bag = START_BAG.map(i => ({ ...i }));
}
resetState();

export function addItem(name, desc = '', qty = 1) {
  const it = S.bag.find(i => i.name === name);
  if (it) it.qty += qty; else S.bag.push({ name, qty, desc });
}
export function hasItem(name) { return S.bag.some(i => i.name === name && i.qty > 0); }
export function removeItem(name, qty = 1) {
  const i = S.bag.findIndex(it => it.name === name);
  if (i < 0) return false;
  S.bag[i].qty -= qty;
  if (S.bag[i].qty <= 0) S.bag.splice(i, 1);
  return true;
}
export const euros = v => v.toFixed(2).replace('.', ',') + ' €';
