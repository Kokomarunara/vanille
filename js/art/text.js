// Texte net sur le canvas (mini-jeux, jauges) : rendu une fois dans un petit canvas, sans anti-crénelage,
// puis mis en cache. size : 16 = taille normale (7 px par lettre) ; 32 et 48 = titres (12 et 18 px par lettre).
const cache = new Map();

// À la taille normale, la police VT323 écrase M, W, m et w en pâtés : on les redessine à la main (7 px de large).
const FIX = {
  M: { y: 3, rows: ['##...##', '###.###', '###.###', '#######', '##.#.##', '##.#.##', '##...##', '##...##', '##...##', '##...##'] },
  W: { y: 3, rows: ['##...##', '##...##', '##...##', '##...##', '##.#.##', '##.#.##', '#######', '###.###', '###.###', '##...##'] },
  m: { y: 6, rows: ['######.', '#######', '##.#.##', '##.#.##', '##.#.##', '##.#.##', '##.#.##'] },
  w: { y: 6, rows: ['##...##', '##...##', '##.#.##', '##.#.##', '#######', '###.###', '.#...#.'] },
};

export function text(c, str, x, y, col = '#ffffff', align = 'left', size = 16) {
  const k = Math.max(1, Math.round(size / 16)), key = k + col + str;
  let cv = cache.get(key);
  if (!cv) {
    cv = document.createElement('canvas');
    const g = cv.getContext('2d', { willReadFrequently: true }), chars = [...str];
    if (k === 1) {
      // chaque lettre est posée sur un pixel entier (chasse fixe de 7 px)
      cv.width = Math.max(1, chars.length * 7 + 2); cv.height = 18;
      g.font = '16px VT323, monospace'; g.textBaseline = 'top'; g.fillStyle = col;
      chars.forEach((ch, i) => { if (!FIX[ch]) g.fillText(ch, 1 + i * 7, 0); });
    } else {
      // en grand, la police tombe pile sur la grille de pixels (12,5 px = 1 pixel de police pour 0,5 pixel d'écran)
      cv.width = Math.max(1, chars.length * 6 * k + 2); cv.height = 16 * k + 2;
      g.font = `${12.5 * k}px VT323, monospace`; g.textBaseline = 'alphabetic'; g.fillStyle = col;
      chars.forEach((ch, i) => g.fillText(ch, 1 + i * 6 * k, 12 * k));
    }
    const img = g.getImageData(0, 0, cv.width, cv.height), a = img.data;
    for (let i = 3; i < a.length; i += 4) a[i] = a[i] > 110 ? 255 : 0;
    g.putImageData(img, 0, 0);
    if (k === 1) chars.forEach((ch, i) => {
      const f = FIX[ch];
      if (f) f.rows.forEach((row, j) => [...row].forEach((v, n) => { if (v === '#') g.fillRect(1 + i * 7 + n, f.y + j, 1, 1); }));
    });
    if (document.fonts && document.fonts.check('16px VT323')) cache.set(key, cv);
  }
  c.drawImage(cv, Math.round(align === 'center' ? x - cv.width / 2 : align === 'right' ? x - cv.width : x), Math.round(y));
}

// Texte avec ombre portée d'un pixel
export function textS(c, str, x, y, col = '#ffffff', align = 'left', size = 16, shadow = '#1c2a3c') {
  text(c, str, x + 1, y + 1, shadow, align, size);
  text(c, str, x, y, col, align, size);
}
