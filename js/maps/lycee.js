// Lycée Félix Le Dantec, à Lannion : la salle de TP d'électrotechnique.
export default {
  id: 'lycee',
  name: 'Lycée Félix Le Dantec — Salle de TP',
  rows: [
    '################',
    '################',
    '#llllllllllllll#',
    '#llllllllllllll#',
    '#llllllllllllll#',
    '#llllllllllllll#',
    '#llllllllllllll#',
    '#llllllllllllll#',
    '#llllllllllllll#',
    '#llllllllllllll#',
    '################',
  ],
  objects: [
    { t: 'window', x: 2, y: 1, back: 1 }, { t: 'window', x: 12, y: 1, back: 1 },
    { t: 'blackboard', x: 5, y: 1, w: 5, back: 1, text: ['Au tableau : le schéma d\'un transformateur, et la formule du rapport de transformation.'] },
    { t: 'locker', x: 14, y: 2, h: 2, text: ['L\'armoire électrique pédagogique. Elle a vu passer des générations de BTS.'] },
    { t: 'tpbench', x: 2, y: 4, w: 3, text: ['Une paillasse de TP. Le binôme d\'à côté a tout câblé à l\'envers.'] },
    { t: 'tpbench', x: 10, y: 4, w: 3, text: ['Une paillasse de TP.'] },
    { t: 'tpbench', id: 'benchK', v: 'k', x: 2, y: 7, w: 3, text: ['Ta paillasse. Câblage propre, fils rangés par couleur.'] },
    { t: 'tpbench', x: 10, y: 7, w: 3, text: ['La paillasse de Maxime. C\'est... créatif.'] },
    { t: 'plant', x: 1, y: 2, text: ['Une plante. Personne ne sait qui l\'arrose.'] },
  ],
};
