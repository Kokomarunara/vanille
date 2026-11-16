// Versions alternatives des musiques (compositions originales), à écouter sur la page musiques.html.
// Écriture : une note par croche (« C5 », « F#4 »...), « _ » = la note précédente continue, « - » = silence.
// Les « | » ne servent qu'à lire plus facilement (une mesure). drums : k = grosse caisse, s = caisse claire, h = charleston.
// leadWave / bassWave : timbre ('square' = rétro, 'triangle' = doux, 'sawtooth' = plus dur).
export const ALT = {
  // ---------- 0. Menu (écran-titre) ----------
  title_a: {
    name: 'Fanfare', desc: 'Héroïque, avec batterie : « l\'aventure commence »', bpm: 120,
    lead: 'G4 C5 E5 G5 _ E5 G5 C6 | _ _ B5 A5 G5 _ E5 _ | F5 A5 C6 A5 G5 _ E5 _ | D5 E5 F5 D5 C5 _ _ -',
    bass: 'C3 C3 G2 G2 C3 C3 G2 G2 | A2 A2 E3 E3 A2 A2 E3 E3 | F2 F2 C3 C3 C3 C3 G2 G2 | G2 G2 D3 D3 C3 _ _ -',
    drums: 'k - h - s - h - | k - h - s - h h | k - h - s - h - | k - s - k s s -',
  },
  title_b: {
    name: 'Berceuse', desc: 'Douce, à trois temps, timbre flûté', bpm: 90, leadWave: 'triangle',
    lead: 'E5 _ D5 C5 _ D5 | E5 _ G5 E5 _ _ | D5 _ C5 A4 _ C5 | D5 _ _ _ _ - | E5 _ D5 C5 _ D5 | E5 _ G5 A5 _ G5 | E5 _ D5 C5 _ D5 | C5 _ _ _ _ -',
    bass: 'A2 E3 A3 A2 E3 A3 | C3 G3 C4 C3 G3 C4 | F2 C3 F3 F2 C3 F3 | G2 D3 G3 G2 D3 G3 | A2 E3 A3 A2 E3 A3 | C3 G3 C4 C3 G3 C4 | F2 C3 F3 G2 D3 G3 | C3 G3 C4 C3 _ -',
  },
  title_c: {
    name: 'Kompa', desc: 'Rythme chaloupé, clin d\'œil à Haïti', bpm: 112,
    lead: 'C5 - E5 G5 - E5 G5 A5 | G5 _ E5 _ C5 - D5 E5 | F5 - A5 C6 - A5 G5 F5 | E5 _ D5 _ C5 _ - -',
    bass: 'C3 - - C3 - - G2 - | C3 - - C3 - - G2 - | F2 - - F2 - - C3 - | G2 - - G2 - - C3 -',
    drums: 'k - h s - k s h | k - h s - k s h | k - h s - k s h | k - h s k k s -',
  },

  // ---------- 1. Maison (l'appart) ----------
  home_a: {
    name: 'Dimanche matin', desc: 'Lente et douce, timbre flûté', bpm: 92, leadWave: 'triangle',
    lead: 'G5 _ E5 _ C5 _ E5 G5 | A5 _ G5 _ E5 _ _ - | F5 _ D5 _ B4 _ D5 F5 | E5 _ _ _ C5 _ _ -',
    bass: 'C3 G3 E3 G3 C3 G3 E3 G3 | A2 E3 C3 E3 A2 E3 C3 E3 | G2 D3 B2 D3 G2 D3 B2 D3 | C3 G3 E3 G3 C3 _ _ -',
  },
  home_b: {
    name: 'Thé à la vanille', desc: 'Un peu jazzy, posée', bpm: 80,
    lead: 'E5 _ G5 _ B5 _ A5 _ | G5 _ E5 _ D5 _ _ - | F5 _ A5 _ C6 _ B5 _ | A5 _ G5 _ E5 _ _ -',
    bass: 'C3 _ G3 _ C3 _ G3 _ | A2 _ E3 _ A2 _ E3 _ | D3 _ A3 _ D3 _ A3 _ | G2 _ D3 _ G2 _ D3 _',
  },
  home_c: {
    name: 'Ménage en musique', desc: 'Entraînante, avec batterie : on frotte en rythme', bpm: 128,
    lead: 'C5 C5 E5 G5 - G5 E5 C5 | D5 D5 F5 A5 - A5 F5 D5 | E5 G5 C6 G5 E5 G5 C6 E6 | D6 _ B5 _ G5 _ - -',
    bass: 'C3 - C3 - G2 - G2 - | D3 - D3 - A2 - A2 - | C3 - C3 - E3 - E3 - | G2 - G2 - G2 _ - -',
    drums: 'k - h - s - h - | k - h - s - h - | k - h - s - h - | k - s - s s s -',
  },

  // ---------- 2. Ville (rue, marché) ----------
  town_a: {
    name: 'Jour de marché', desc: 'Rapide et joyeuse, avec batterie', bpm: 140,
    lead: 'D5 F#5 A5 F#5 D5 F#5 A5 B5 | A5 _ F#5 _ D5 _ E5 _ | C#5 E5 A5 E5 C#5 E5 A5 B5 | A5 _ G5 _ F#5 _ E5 _',
    bass: 'D3 A3 D3 A3 D3 A3 D3 A3 | D3 A3 D3 A3 D3 A3 D3 A3 | A2 E3 A2 E3 A2 E3 A2 E3 | A2 E3 A2 E3 D3 _ - -',
    drums: 'k h s h k h s h | k h s h k h s h | k h s h k h s h | k h s h k s s s',
  },
  town_b: {
    name: 'Biniou', desc: 'Air à la bretonne, façon fest-noz', bpm: 132,
    lead: 'D5 E5 F5 G5 A5 _ A5 G5 | F5 G5 A5 C6 A5 _ G5 _ | F5 E5 D5 E5 F5 _ D5 _ | C5 D5 E5 C5 D5 _ _ -',
    bass: 'D3 - A2 - D3 - A2 - | F2 - C3 - F2 - C3 - | D3 - A2 - D3 - A2 - | C3 - G2 - D3 _ - -',
    drums: 'k - - h k - s - | k - - h k - s - | k - - h k - s - | k - s - k s s -',
  },
  town_c: {
    name: 'Balade tranquille', desc: 'Calme, sans batterie', bpm: 108,
    lead: 'B4 D5 G5 _ F#5 _ E5 D5 | E5 _ C5 _ _ - - - | A4 C5 F#5 _ E5 _ D5 C5 | D5 _ B4 _ _ - - -',
    bass: 'G2 - D3 - G2 - D3 - | C3 - G3 - C3 - G3 - | D3 - A3 - D3 - A3 - | G2 - D3 - G2 _ - -',
  },

  // ---------- 3. Tempête ----------
  storm_a: {
    name: 'Alerte rouge', desc: 'Très rapide et martelée, avec batterie', bpm: 150,
    lead: 'E5 - E5 - G5 - E5 - | D5 - D5 - F5 - D5 - | C5 - C5 - E5 - C5 - | B4 _ D#5 _ F#5 _ B5 _',
    bass: 'E2 E2 E3 E2 E2 E3 E2 E3 | D2 D2 D3 D2 D2 D3 D2 D3 | C2 C2 C3 C2 C2 C3 C2 C3 | B1 B1 B2 B1 B1 B2 B1 B2',
    drums: 'k h s h k k s h | k h s h k k s h | k h s h k k s h | k s k s k s s s', bassWave: 'sawtooth',
  },
  storm_b: {
    name: 'Vent du large', desc: 'Lente et inquiétante, presque vide', bpm: 100, leadWave: 'triangle',
    lead: 'A4 _ _ _ C5 _ B4 _ | A4 _ _ _ E4 _ _ - | F4 _ _ _ A4 _ G#4 _ | E4 _ _ _ _ _ _ -',
    bass: 'A2 _ A2 _ A2 _ A2 _ | A2 _ A2 _ A2 _ A2 _ | F2 _ F2 _ F2 _ F2 _ | E2 _ E2 _ E2 _ E2 _',
    drums: 'k - - - - - - - | k - - - - - h - | k - - - - - - - | k - - - s - - -',
  },
  storm_c: {
    name: 'Course contre la montre', desc: 'Effrénée, idéale pour le sprint', bpm: 168,
    lead: 'A5 G5 E5 G5 A5 G5 E5 C5 | D5 E5 G5 E5 D5 C5 A4 _ | A5 G5 E5 G5 A5 C6 B5 A5 | G#5 _ E5 _ B4 _ E5 _',
    bass: 'A2 A3 A2 A3 A2 A3 A2 A3 | F2 F3 F2 F3 F2 F3 F2 F3 | D2 D3 D2 D3 D2 D3 D2 D3 | E2 E3 E2 E3 E2 E3 E2 E3',
    drums: 'k h k h s h k h | k h k h s h k h | k h k h s h k h | k h k h s s s s',
  },

  // ---------- 4. Final (parc éolien, générique) ----------
  final_a: {
    name: 'Coucher de soleil', desc: 'Très lente et lumineuse, timbre flûté', bpm: 76, leadWave: 'triangle',
    lead: 'C5 _ E5 _ G5 _ _ _ | F5 _ E5 _ D5 _ _ _ | E5 _ G5 _ C6 _ _ _ | B5 _ A5 _ G5 _ _ -',
    bass: 'C3 G3 E3 G3 C3 G3 E3 G3 | F2 C3 A2 C3 F2 C3 A2 C3 | A2 E3 C3 E3 A2 E3 C3 E3 | G2 D3 B2 D3 G2 D3 G2 -',
  },
  final_b: {
    name: 'Valse des éoliennes', desc: 'À trois temps, les pales qui tournent', bpm: 96,
    lead: 'G5 _ _ E5 _ F5 | G5 _ _ C5 _ _ | A5 _ _ F5 _ G5 | A5 _ _ D5 _ _ | B5 _ _ G5 _ A5 | B5 _ _ E5 _ F5 | G5 _ E5 _ D5 _ | C5 _ _ _ _ -',
    bass: 'C3 G3 G3 C3 G3 G3 | C3 G3 G3 C3 G3 G3 | F2 C3 C3 F2 C3 C3 | F2 C3 C3 F2 C3 C3 | G2 D3 D3 G2 D3 D3 | E2 B2 B2 E2 B2 B2 | F2 C3 C3 G2 D3 D3 | C3 G3 G3 C3 _ -',
  },
  final_c: {
    name: 'Joyeux anniversaire', desc: 'L\'air traditionnel, version 8 bits', bpm: 100, leadWave: 'triangle',
    lead: 'G4 G4 A4 _ G4 _ | C5 _ B4 _ _ _ | G4 G4 A4 _ G4 _ | D5 _ C5 _ _ _ | G4 G4 G5 _ E5 _ | C5 _ B4 _ A4 _ | F5 F5 E5 _ C5 _ | D5 _ C5 _ _ -',
    bass: 'C3 G3 G3 C3 G3 G3 | G2 D3 D3 G2 D3 D3 | G2 D3 D3 G2 D3 D3 | C3 G3 G3 C3 G3 G3 | C3 G3 G3 C3 G3 G3 | F2 C3 C3 F2 C3 C3 | C3 G3 G3 F2 C3 C3 | G2 D3 D3 C3 _ -',
  },
  // ---------- 3. Tempête : nouvelles propositions ----------
  storm_d: {
    name: 'Éclairs', desc: 'Sombre et rapide, basse qui gronde', bpm: 138,
    lead: 'D5 _ F5 _ A5 _ G#5 _ | A5 _ F5 _ D5 _ - - | C5 _ E5 _ G5 _ F5 _ | E5 _ C#5 _ A4 _ - -',
    bass: 'D2 D3 D2 D3 D2 D3 D2 D3 | D2 D3 D2 D3 D2 D3 D2 D3 | C2 C3 C2 C3 C2 C3 C2 C3 | A1 A2 A1 A2 A1 A2 A1 A2',
    drums: 'k - h - s - h k | k - h - s - h - | k - h - s - h k | k - h s s - s s',
  },
  storm_e: {
    name: 'Mission Enedis', desc: 'Tendue mais déterminée : Ketura part au front', bpm: 132, bassWave: 'sawtooth',
    lead: 'E5 _ _ B4 E5 _ G5 _ | F#5 _ E5 _ D5 _ B4 _ | C5 _ _ G4 C5 _ E5 _ | D5 _ C5 _ B4 _ _ -',
    bass: 'E2 - E3 - E2 - E3 - | B1 - B2 - B1 - B2 - | C2 - C3 - C2 - C3 - | B1 - B2 - B1 B2 B1 -',
    drums: 'k - s - k k s - | k - s - k k s - | k - s - k k s - | k s k s k s s s',
  },
  storm_f: {
    name: 'Pluie battante', desc: 'Arpèges en gouttes de pluie, charleston continu', bpm: 116, leadWave: 'triangle',
    lead: 'A4 C5 E5 C5 A4 C5 E5 C5 | G4 B4 D5 B4 G4 B4 D5 B4 | F4 A4 C5 A4 F4 A4 C5 A4 | E4 G#4 B4 G#4 E4 G#4 B4 E5',
    bass: 'A2 _ _ _ A2 _ _ _ | G2 _ _ _ G2 _ _ _ | F2 _ _ _ F2 _ _ _ | E2 _ _ _ E2 _ _ _',
    drums: 'h h h h h h h h | h h h h h h s h | h h h h h h h h | h h h h s h s h',
  },

  // ---------- 4. Final : nouvelles propositions ----------
  final_d: {
    name: 'Mamour', desc: 'Ballade lente et tendre, flûtée', bpm: 72, leadWave: 'triangle',
    lead: 'A5 _ _ G5 F5 _ C5 _ | D5 _ F5 _ A5 _ _ - | A#5 _ _ A5 G5 _ D5 _ | E5 _ G5 _ C6 _ _ - | A5 _ _ G5 F5 _ A5 _ | G5 _ _ F5 E5 _ G5 _ | F5 _ _ _ A5 _ G5 _ | F5 _ _ _ _ _ _ -',
    bass: 'F2 C3 A3 C3 F2 C3 A3 C3 | D2 A2 F3 A2 D2 A2 F3 A2 | A#1 F2 D3 F2 A#1 F2 D3 F2 | C2 G2 E3 G2 C2 G2 E3 G2 | F2 C3 A3 C3 F2 C3 A3 C3 | C2 G2 E3 G2 C2 G2 E3 G2 | D2 A2 F3 A2 A#1 F2 D3 F2 | F2 C3 A3 C3 F2 _ _ -',
  },
  final_e: {
    name: 'Lumières de Lannion', desc: 'Ample et émouvante, batterie douce : la ville se rallume', bpm: 104,
    lead: 'D5 G5 B5 _ A5 G5 F#5 G5 | E5 _ _ _ D5 _ _ - | C5 E5 G5 _ F#5 E5 D5 E5 | F#5 _ _ _ D5 _ _ - | D5 G5 B5 _ D6 _ B5 _ | C6 _ A5 _ F#5 _ D5 _ | E5 _ F#5 _ A5 _ F#5 _ | G5 _ _ _ _ _ _ -',
    bass: 'G2 D3 G3 D3 G2 D3 G3 D3 | C3 G3 C4 G3 C3 G3 C4 G3 | A2 E3 A3 E3 A2 E3 A3 E3 | D3 A3 D4 A3 D3 A3 D4 A3 | G2 D3 G3 D3 E2 B2 E3 B2 | C3 G3 C4 G3 D3 A3 D4 A3 | C3 G3 C4 G3 D3 A3 D4 A3 | G2 D3 G3 D3 G2 _ _ -',
    drums: 'k - h - s - h - | k - h - s - h - | k - h - s - h - | k - h - s - h - | k - h - s - h - | k - h - s - h - | k - h - s - h - | k - h - s - - -',
  },
  final_f: {
    name: 'Boîte à musique', desc: 'Petites notes cristallines qui tournent, très douce', bpm: 88, leadWave: 'triangle',
    lead: 'C6 G5 E6 G5 C6 G5 E6 G5 | A5 F5 C6 F5 A5 F5 C6 F5 | B5 G5 D6 G5 B5 G5 D6 G5 | C6 G5 E6 G5 C6 _ _ -',
    bass: 'C3 _ _ _ E3 _ _ _ | F2 _ _ _ A2 _ _ _ | G2 _ _ _ B2 _ _ _ | C3 _ _ _ C3 _ _ -',
  },
};
