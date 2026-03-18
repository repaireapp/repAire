export interface CodexZone {
  id: string;
  target?: string;
  top: number;
  left: number;
  width: number;
  height: number;
  label?: string;
}

export interface CodexEntry {
  image: any;
  title: string;
  description: string;
  zones: CodexZone[];
}

export const codexData: Record<string, CodexEntry> = {
  // === VUE GLOBALE VÉLO ===
  global: {
    image: require('../../assets/images/velo.jpg'),
    title: 'Le Vélo',
    description: 'Touche une zone pour voir les détails.',
    zones: [
      { id: 'guidon', target: 'guidon', top: 33, left: 60, width: 30, height: 8, label: 'Guidon' },
      { id: 'roue_ar', target: 'transmission', top: 53, left: 7, width: 20, height: 13, label: 'Transmission' },
      { id: 'trans', target: 'pedalier', top: 55, left: 30, width: 30, height: 13, label: 'Pédalier' },
      { id: 'freins_av', target: 'freins', top: 44, left: 68, width: 15, height: 7, label: 'Freins' },
      { id: 'attache_av', target: 'roue', top: 55, left: 70, width: 12, height: 8, label: 'Attache Av.' },
      { id: 'pneu', target: 'pneu', top: 47, left: 83, width: 15, height: 15, label: 'Pneu' },
    ],
  },

  // === ZOOMS VÉLO ===
  guidon: {
    image: require('../../assets/images/guidon.jpg'),
    title: 'Poste de Pilotage',
    description: 'Vérifie que la potence est bien serrée et alignée avec la roue avant.',
    zones: [],
  },
  freins: {
    image: require('../../assets/images/freins.jpg'),
    title: 'Freins à Patins',
    description: "Le système classique. Vérifie que les patins sont bien alignés sur la jante et qu'ils ne sont pas usés jusqu'au métal.",
    zones: [],
  },
  frein_disque: {
    image: require('../../assets/images/frein_disque.jpg'),
    title: 'Frein à Disque (Hydraulique)',
    description: "Freinage puissant. Attention : Ne jamais appuyer sur le levier si la roue est enlevée. Ne touche pas le disque avec les doigts.",
    zones: [],
  },
  roue: {
    image: require('../../assets/images/roue.jpg'),
    title: 'Moyeu & Axe',
    description: "L'attache rapide doit être fermée fermement. Vérifie qu'il n'y a pas de jeu dans le moyeu.",
    zones: [],
  },
  transmission: {
    image: require('../../assets/images/transmission.jpg'),
    title: 'Cassette & Dérailleur',
    description: "C'est ici que les vitesses passent. Garde la cassette propre et le dérailleur bien réglé.",
    zones: [],
  },
  pedalier: {
    image: require('../../assets/images/pedalier.jpg'),
    title: 'Pédalier & Plateaux',
    description: "C'est la force motrice. Vérifie qu'il n'y a pas de jeu latéral quand tu tires sur la manivelle.",
    zones: [],
  },
  pneu: {
    image: require('../../assets/images/pneu.jpg'),
    title: 'Lire son Pneu',
    description: "L'info cruciale est ici ! Regarde les petits chiffres sur le flanc pour connaître la pression (ex: Min 2.5 - Max 4.5 BAR) et la taille (ex: 700x25).",
    zones: [],
  },

  // === VUE GLOBALE TROTTINETTE ===
  scooter_global: {
    image: require('../../assets/images/scooter_global.jpg'),
    title: 'Trottinette Électrique',
    description: "Le moyen de transport urbain par excellence. Touche une zone pour voir les détails d'entretien.",
    zones: [
      { id: 'scooter_guidon', top: 35, left: 45, width: 20, height: 10 },
      { id: 'scooter_pliage', top: 50, left: 52, width: 12, height: 8 },
      { id: 'scooter_roue_av', top: 60, left: 55, width: 14, height: 8 },
      { id: 'scooter_roue_ar', top: 60, left: 18, width: 14, height: 8 },
    ],
  },

  // === ZOOMS TROTTINETTE ===
  scooter_guidon: {
    image: require('../../assets/images/scooter_guidon.jpg'),
    title: 'Guidon & Commandes',
    description: "Le centre de contrôle. \n\n🔴 PANNES FRÉQUENTES :\n- Code erreur (bips) : Souvent un problème de connecteur dans le tube.\n- Accélérateur mou : Ressort cassé ou frottement.\n- Jeu dans les poignées : Resserre les petites vis BTR sous les grips.",
    zones: [],
  },
  scooter_pliage: {
    image: require('../../assets/images/scooter_pliage.jpg'),
    title: 'Système de Pliage',
    description: "⚠️ POINT CRITIQUE DE SÉCURITÉ.\nCe mécanisme subit tout ton poids. \n\n🔧 ENTRETIEN :\n- Si le guidon bouge d'avant en arrière : Resserre la vis centrale à l'intérieur du loquet.\n- Graisse le mécanisme une fois par mois pour éviter qu'il casse net.",
    zones: [],
  },
  scooter_roue_av: {
    image: require('../../assets/images/scooter_roue_av.jpg'),
    title: 'Roue Avant',
    description: "\n- Pression : 3.5 à 4 bars (les petites roues perdent vite de l'air).\n- Roulements : Si ça grogne en roulant, les roulements sont morts (humidité).",
    zones: [],
  },
  scooter_roue_ar: {
    image: require('../../assets/images/scooter_roue_ar.jpg'),
    title: 'Moteur & Frein Arrière',
    description: "Le cœur de la bête.\n🔧 PNEU :\nSi c'est un pneu plein (dur) : Pas de crevaison possible, mais moins d'adhérence.\n\n- Roulements : Si ça grogne en roulant, les roulements sont morts (humidité).",
    zones: [],
  },
  scooter_freins: {
    image: require('../../assets/images/scooter_freins.jpg'),
    title: 'Freinage Trottinette',
    description: "Disque ou tambour. Vérifie la tension du câble et l'usure des plaquettes.",
    zones: [],
  },

  // === ÉTABLI / OUTILS ===
  outils: {
    image: require('../../assets/images/outils.jpg'),
    title: "L'Établi du Mécano",
    description: "Touche un outil pour apprendre à t'en servir.",
    zones: [
      { id: 'z_pompe_pied', target: 'zoom_pompe_pied', top: 35, left: 2, width: 25, height: 30, label: 'Pompe à pied' },
      { id: 'z_pompe_main', target: 'zoom_pompe_main', top: 35, left: 28, width: 10, height: 30, label: 'Pompe à main' },
      { id: 'z_allen', target: 'zoom_cles_allen', top: 35, left: 40, width: 15, height: 30, label: 'Clés Allen' },
      { id: 'z_plates', target: 'zoom_cles_plates', top: 35, left: 56, width: 20, height: 30, label: 'Clés Plates' },
      { id: 'z_wd40', target: 'zoom_degraissant', top: 35, left: 78, width: 10, height: 30, label: 'Dégraissant' },
      { id: 'z_tournevis', target: 'zoom_tournevis', top: 35, left: 88, width: 8, height: 30, label: 'Tournevis' },
    ],
  },

  // === ZOOMS OUTILS ===
  zoom_pompe_pied: {
    image: require('../../assets/images/pompe_pied.jpg'),
    title: 'Pompe à Pied',
    description: "L'indispensable à la maison. Le manomètre te permet de gonfler à la pression exacte (indiquée en 'BAR' ou 'PSI' sur le flanc du pneu).",
    zones: [],
  },
  zoom_pompe_main: {
    image: require('../../assets/images/pompe_main.jpg'),
    title: 'Pompe à Main',
    description: "La dépanneuse. À fixer sur le cadre pour les sorties. Elle sert à rentrer en cas de crevaison, mais c'est dur d'atteindre une haute pression avec.",
    zones: [],
  },
  zoom_cles_allen: {
    image: require('../../assets/images/cles_allen.jpg'),
    title: 'Jeu de Clés Allen (BTR)',
    description: "L'outil roi du vélo moderne. 90% des vis (guidon, selle, porte-bidon, freins) se règlent avec ces clés (surtout les tailles 4mm et 5mm).",
    zones: [],
  },
  zoom_cles_plates: {
    image: require('../../assets/images/cles_plates.jpg'),
    title: 'Clés Plates',
    description: "Utiles pour les vélos plus anciens ou basiques. La clé de 15mm est le standard absolu pour démonter les pédales.",
    zones: [],
  },
  zoom_degraissant: {
    image: require('../../assets/images/degraissant.jpg'),
    title: 'Dégraissant / WD-40',
    description: "Magique pour débloquer une vis rouillée ou nettoyer une vieille chaîne. ATTENTION : Ce n'est pas de l'huile ! Il faut remettre de l'huile après avoir nettoyé avec ça.",
    zones: [],
  },
  zoom_tournevis: {
    image: require('../../assets/images/tournevis.jpg'),
    title: 'Tournevis Cruciforme',
    description: "Surtout utilisé pour les vis de réglage des dérailleurs (les petites vis H et L). Indispensable pour un passage de vitesses fluide.",
    zones: [],
  },
  zoom_demonte_pneu: {
    image: require('../../assets/images/demonte_pneu.jpg'),
    title: 'Démonte-Pneus',
    description: "Indispensables par 3 ! Ils servent à faire levier pour sortir le pneu de la jante. N'utilise jamais de tournevis à la place, tu percerais la chambre à air immédiatement.",
    zones: [],
  },
};
