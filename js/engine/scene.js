// Mini-jeu plein écran : remplace temporairement l'exploration sur l'écran du haut.
// Un mini-jeu est un objet { update(dt), draw(c, t), pointer?(type, x, y) } ;
// il appelle this.finish(resultat) pour rendre la main.
import { setTopHandler } from './input.js';

export const scene = { mini: null };

export function playMini(m) {
  return new Promise(res => {
    m.finish = v => { scene.mini = null; setTopHandler(null); res(v); };
    scene.mini = m;
    setTopHandler(m.pointer ? (k, x, y) => m.pointer(k, x, y) : null);
  });
}
