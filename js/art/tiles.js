// Tuiles de décor 16x16, dessinées par code (pixel art original).

export const r = (c, x, y, w, h, col) => { c.fillStyle = col; c.fillRect(x, y, w, h); };
// pseudo-aléatoire stable par case
export const rnd = (x, y, k = 0) => {
  let n = (x * 374761393 + y * 668265263 + k * 2147483647) | 0;
  n = (n ^ (n >>> 13)) * 1274126177 | 0;
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
};

// Cases infranchissables
const SOLID = new Set(['#', ' ', 'F', 'R', 'H', 'w', 'f']);
export const isSolid = ch => ch === undefined || SOLID.has(ch);
const isWall = ch => ch === '#' || ch === undefined;
const isVoid = ch => ch === ' ' || ch === undefined;

function planks(c, px, py, x, y, base, line, grain) {
  r(c, px, py, 16, 16, base);
  r(c, px, py + 7, 16, 1, line); r(c, px, py + 15, 16, 1, line);
  const j1 = Math.floor(rnd(x, y, 1) * 14) + 1, j2 = Math.floor(rnd(x, y, 2) * 14) + 1;
  r(c, px + j1, py, 1, 7, line); r(c, px + j2, py + 8, 1, 7, line);
  for (let i = 0; i < 4; i++) {
    const gx = Math.floor(rnd(x, y, 10 + i) * 13), gy = Math.floor(rnd(x, y, 20 + i) * 14);
    if (gy !== 7) r(c, px + gx, py + gy, 3, 1, grain);
  }
}
function carpet(c, px, py, x, y, base, dark, light) {
  r(c, px, py, 16, 16, base);
  for (let i = 0; i < 10; i++) {
    const gx = Math.floor(rnd(x, y, i) * 16), gy = Math.floor(rnd(x, y, 30 + i) * 16);
    r(c, px + gx, py + gy, 1, 1, i % 2 ? dark : light);
  }
}

export function drawTile(c, m, x, y) {
  const ch = m.rows[y][x], px = x * 16, py = y * 16;
  const at = (dx, dy) => (m.rows[y + dy] || [])[x + dx];
  switch (ch) {
    case '.': case 'd': planks(c, px, py, x, y, '#cfa066', '#a97c46', '#dcb27a'); break;
    case ',': { // carrelage salle de bain
      r(c, px, py, 16, 16, '#e7f1f3');
      r(c, px + 8, py, 8, 8, '#d3e4e9'); r(c, px, py + 8, 8, 8, '#d3e4e9');
      r(c, px, py + 15, 16, 1, '#b9cdd4'); r(c, px + 15, py, 1, 16, '#b9cdd4');
      r(c, px, py + 7, 16, 1, '#c6d8de'); r(c, px + 7, py, 1, 16, '#c6d8de');
      break;
    }
    case ':': carpet(c, px, py, x, y, '#8fa6c0', '#7d94ae', '#a2b7ce'); break;
    case ';': carpet(c, px, py, x, y, '#d9a7a0', '#c9958e', '#e6bab3'); break;
    case '~': carpet(c, px, py, x, y, '#cdbf9f', '#bbad8d', '#dccfb2'); break;
    case '=': { // passerelle + garde-corps côté vide
      planks(c, px, py, x, y, '#b98654', '#8f6238', '#c99a66');
      const rail = '#5a4130', railL = '#8a6a4c';
      if (isVoid(at(0, -1))) { r(c, px, py, 16, 3, rail); r(c, px, py, 16, 1, railL); r(c, px + 7, py + 3, 2, 2, rail); }
      if (isVoid(at(0, 1))) { r(c, px, py + 13, 16, 3, rail); r(c, px, py + 13, 16, 1, railL); }
      if (isVoid(at(-1, 0))) { r(c, px, py, 3, 16, rail); r(c, px, py, 1, 16, railL); }
      if (isVoid(at(1, 0))) { r(c, px + 13, py, 3, 16, rail); r(c, px + 15, py, 1, 16, '#3e2c20'); }
      break;
    }
    case ' ': { // vide (on devine le salon en dessous)
      r(c, px, py, 16, 16, '#2c2535');
      if ((x + y) % 2) r(c, px + 4, py + 7, 8, 1, '#372f42');
      break;
    }
    case '#': {
      const below = at(0, 1), above = at(0, -1);
      const face = below !== undefined && !isWall(below) && !isVoid(below);
      const upper = isWall(below) && (() => { const b2 = at(0, 2); return b2 !== undefined && !isWall(b2) && !isVoid(b2) && y === 0; })();
      if (face || upper) {
        r(c, px, py, 16, 16, '#f1e8d2');
        if ((x * 7 + y * 3) % 5 === 0) r(c, px + 5, py + 6, 2, 1, '#e6dcc2');
        if (face) { r(c, px, py + 12, 16, 4, '#a5835a'); r(c, px, py + 12, 16, 1, '#c4a276'); r(c, px, py + 15, 16, 1, '#6e5438'); }
        if (upper || !isWall(above) || y > 1) {
          r(c, px, py, 16, 4, '#4b4459'); r(c, px, py, 16, 1, '#665e78'); r(c, px, py + 4, 16, 1, '#d6caae');
        } else r(c, px, py, 16, 1, '#e6dcc2');
      } else {
        r(c, px, py, 16, 16, '#4b4459');
        if (!isWall(at(-1, 0))) r(c, px, py, 1, 16, '#665e78');
        if (!isWall(at(1, 0))) r(c, px + 15, py, 1, 16, '#35303f');
        if (!isWall(above)) r(c, px, py, 16, 1, '#665e78');
      }
      break;
    }
    // ---------- Extérieur ----------
    case 'g': {
      r(c, px, py, 16, 16, '#6fb85a');
      for (let i = 0; i < 5; i++) {
        const gx = Math.floor(rnd(x, y, i) * 14), gy = Math.floor(rnd(x, y, 40 + i) * 13) + 1;
        r(c, px + gx, py + gy, 1, 2, i % 2 ? '#58a048' : '#8fd070'); r(c, px + gx + 1, py + gy + 1, 1, 1, '#58a048');
      }
      const fl = rnd(x, y, 77);
      if (fl > .72) { // petites fleurs
        const col = fl > .9 ? '#f8f0f8' : fl > .81 ? '#f8d850' : '#f098b8';
        for (const [a, b] of [[3, 4], [10, 9]]) { r(c, px + a, py + b + 1, 3, 1, col); r(c, px + a + 1, py + b, 1, 3, col); r(c, px + a + 1, py + b + 1, 1, 1, '#e89030'); }
      }
      break;
    }
    case 's': {
      r(c, px, py, 16, 16, '#cfc9c0');
      r(c, px, py + 15, 16, 1, '#b3ada3'); r(c, px + (y % 2 ? 7 : 15), py, 1, 16, '#b3ada3');
      if (rnd(x, y) > .6) r(c, px + 4, py + 5, 2, 1, '#bdb7ad');
      if (at(0, 1) === 'r') { r(c, px, py + 12, 16, 4, '#a39d93'); r(c, px, py + 12, 16, 1, '#e2ddd5'); }
      break;
    }
    case 'r': {
      r(c, px, py, 16, 16, '#5d5e6b');
      for (let i = 0; i < 4; i++) r(c, px + Math.floor(rnd(x, y, i) * 15), py + Math.floor(rnd(x, y, 9 + i) * 15), 1, 1, i % 2 ? '#6c6d7a' : '#50515d');
      if (at(0, -1) === 'r' && at(0, 1) === 'r' && x % 3 !== 2) r(c, px, py + 7, 16, 2, '#e8e4d0');
      break;
    }
    case 'F': { // façade en pierre claire
      r(c, px, py, 16, 16, '#e9dfc8');
      const o = y % 2 ? 0 : 8;
      r(c, px, py + 7, 16, 1, '#d2c6aa'); r(c, px, py + 15, 16, 1, '#d2c6aa');
      r(c, px + o, py, 1, 7, '#d2c6aa'); r(c, px + ((o + 8) % 16), py + 8, 1, 7, '#d2c6aa');
      if (rnd(x, y) > .5) r(c, px + 3, py + 2, 4, 3, '#dfd4b9');
      if (at(0, 1) === 's') { r(c, px, py + 12, 16, 4, '#8f8a90'); r(c, px, py + 12, 16, 1, '#a9a4aa'); }
      break;
    }
    case 'R': { // toit en ardoise
      r(c, px, py, 16, 16, '#4a5878');
      for (let j = 0; j < 4; j++) {
        r(c, px, py + j * 4 + 3, 16, 1, '#39456196'.slice(0, 7));
        for (let i = 0; i < 2; i++) r(c, px + i * 8 + (j % 2 ? 4 : 0), py + j * 4, 1, 3, '#394561');
      }
      if (at(0, 1) === 'F' || at(0, 1) === 'H') { r(c, px, py + 13, 16, 3, '#2c3550'); r(c, px, py + 13, 16, 1, '#6a7898'); }
      break;
    }
    case 'c': { // pavés de la place du marché
      r(c, px, py, 16, 16, '#8e877c');
      const tones = ['#bdb5a8', '#b3ab9e', '#c6beb1', '#aaa296'];
      for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) {
        const ox = (j + y) % 2 ? 4 : 0, sx = px + i * 8 + ox, sy = py + j * 8;
        const col = tones[Math.floor(rnd(x * 2 + i, y * 2 + j, 3) * 4)];
        // chaque pavé déborde éventuellement sur la case voisine : on le coupe aux bords de la tuile
        const x0 = Math.max(px, sx), x1 = Math.min(px + 16, sx + 7);
        r(c, x0, sy, x1 - x0, 7, col); r(c, x0, sy, x1 - x0, 1, '#d2cabd');
        if (ox && i === 1) { r(c, px, sy, 3, 7, tones[Math.floor(rnd(x * 2 - 1, y * 2 + j, 3) * 4)]); r(c, px, sy, 3, 1, '#d2cabd'); }
      }
      break;
    }
    case 'k': { // tomettes de l'épicerie
      r(c, px, py, 16, 16, '#a85a36');
      for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) {
        const col = rnd(x * 2 + i, y * 2 + j, 5) > .5 ? '#cf7a4e' : '#c56f44';
        r(c, px + i * 8, py + j * 8, 7, 7, col); r(c, px + i * 8, py + j * 8, 7, 1, '#dc8c60');
      }
      break;
    }
    case 'l': { // lino de la salle de TP du lycée
      r(c, px, py, 16, 16, (x + y) % 2 ? '#b9c4cc' : '#c4ced6');
      r(c, px, py + 15, 16, 1, '#a8b4bc'); r(c, px + 15, py, 1, 16, '#a8b4bc');
      if (rnd(x, y, 8) > .6) r(c, px + 4 + Math.floor(rnd(x, y, 9) * 8), py + 5, 2, 1, '#d2dae0');
      break;
    }
    case 'v': { // gravier du poste électrique
      r(c, px, py, 16, 16, '#a39c94');
      for (let i = 0; i < 12; i++) {
        const gx = Math.floor(rnd(x, y, i) * 15), gy = Math.floor(rnd(x, y, 50 + i) * 15);
        r(c, px + gx, py + gy, 2, 1, i % 3 === 0 ? '#c2bbb2' : i % 3 === 1 ? '#8a847c' : '#b3aca4');
      }
      break;
    }
    case 'p': { // chemin de terre du sentier côtier
      r(c, px, py, 16, 16, '#c8a878');
      for (let i = 0; i < 6; i++) r(c, px + Math.floor(rnd(x, y, i) * 14), py + Math.floor(rnd(x, y, 60 + i) * 15), 2, 1, i % 2 ? '#b89868' : '#d8bc90');
      if (at(0, -1) === 'g') r(c, px, py, 16, 2, '#8fb060');
      if (at(0, 1) === 'g') r(c, px, py + 14, 16, 2, '#8fb060');
      break;
    }
    case 'w': { // la mer
      r(c, px, py, 16, 16, '#3a62a8');
      r(c, px + ((x * 5 + y * 3) % 9), py + 4, 6, 1, '#5a84c8'); r(c, px + ((x * 3 + y * 7) % 8), py + 11, 5, 1, '#4a74b8');
      break;
    }
    case 'f': { // bord de falaise
      r(c, px, py, 16, 16, '#7a7068');
      r(c, px, py, 16, 5, '#6fb85a'); r(c, px, py + 5, 16, 1, '#4e8a40');
      for (let i = 0; i < 4; i++) { const gx = Math.floor(rnd(x, y, i) * 13); r(c, px + gx, py + 7 + i * 2, 3, 1, '#948a80'); r(c, px + (gx + 6) % 14, py + 8 + i * 2, 2, 1, '#5e564e'); }
      r(c, px, py + 14, 16, 2, '#e8f0f8'); r(c, px + (x % 2 ? 3 : 9), py + 13, 4, 1, '#e8f0f8');
      break;
    }
    case 'H': { // maisons à colombages
      const plaster = ['#f1e6cc', '#e9d3a4', '#dde6e2', '#efd3c8'][Math.floor(x / 5) % 4], beam = '#5a3a26', beamL = '#74503a';
      r(c, px, py, 16, 16, plaster);
      r(c, px, py, 16, 2, beam); r(c, px, py, 16, 1, beamL);                 // poutre horizontale
      if (x % 5 === 0) { r(c, px, py, 3, 16, beam); r(c, px, py, 1, 16, beamL); } // angle de maison
      else r(c, px + 7, py, 2, 16, beam);
      if ((x + y) % 2) for (let i = 0; i < 14; i++) r(c, px + (x % 5 === 0 ? 3 : 0) + Math.floor(i / 2), py + 15 - i, 2, 1, beam);
      else for (let i = 0; i < 14; i++) r(c, px + 9 + Math.floor(i / 2), py + 2 + i, 2, 1, beam);
      if (at(0, 1) === 'c') { r(c, px, py + 11, 16, 5, '#8f8a90'); r(c, px, py + 11, 16, 1, '#a9a4aa'); r(c, px + (x % 2 ? 5 : 11), py + 12, 1, 4, '#77727a'); }
      break;
    }
    default: r(c, px, py, 16, 16, '#000');
  }
}
