// Guides hors-ligne pour les urgences sans connexion

export const bikeOfflineGuides = {
  chain: JSON.stringify({
    'Danger': 'Faible',
    'Temps estimé': '5 à 8 min',
    '1. OUTILS NÉCESSAIRES': 'Tes mains et un bâton (ou un caillou).',
    'targetPart': 'transmission',
    'targetTools': ['zoom_cles_allen', 'zoom_degraissant'],
    'Diagnostic et Solution':
      "Ta chaîne s'est emmêlée ou est tombée ? On va régler ça sans forcer.\n\n" +
      "**Étape 1 : Donner du mou**\nRegarde la roue arrière. Il y a un bras articulé avec deux petites roulettes (le dérailleur). Pousse ce bras vers l'avant avec ta main : tu vas voir, la chaîne devient toute molle. C'est le secret pour la manipuler facilement.\n\n" +
      "**Étape 2 : Remettre en place**\nPendant que tu tiens le bras poussé, utilise ton autre main (ou un bâton pour rester propre) pour poser la chaîne sur les dents du cercle en métal au niveau des pédales. Choisis le plus petit cercle, c'est plus facile.\n\n" +
      "**Étape 3 : Le test**\nLâche doucement le bras articulé. Soulève l'arrière du vélo par la selle et fais tourner les pédales avec ta main. La chaîne va reprendre sa place toute seule.\n\n" +
      "**Étape 4 : Astuce si ça saute**\nSi la chaîne fait des bonds, un maillon est sûrement 'grippé' (il ne plie plus). Trouve-le, attrape la chaîne de chaque côté de ce point dur, et tords-la un peu vers la gauche et la droite pour le 'masser' jusqu'à ce qu'il bouge bien.",
  }),

  tire: JSON.stringify({
    'Danger': 'Moyen',
    'Temps estimé': '15 à 20 min',
    '1. OUTILS NÉCESSAIRES': 'Pompe, et si possible de quoi démonter (clé ou levier).',
    'targetPart': 'pneu',
    'targetTools': ['zoom_pompe_main', 'zoom_demonte_pneu'],
    'Diagnostic et Solution':
      "Pneu à plat ? On va essayer de te ramener à la maison.\n\n" +
      "**Étape 1 : Trouver la cause**\nFais tourner la roue lentement et cherche un clou, un bout de verre ou une épine. Si tu trouves quelque chose et que tu n'as pas de quoi réparer, LAISSE-LE dedans. Ça fera office de bouchon temporaire.\n\n" +
      "**Étape 2 : Le gonflage de survie**\nGonfle ton pneu le plus fort possible. Écoute bien : si tu entends un sifflement ('psschhh'), le trou est gros. Si ça ne siffle pas, pars vite ! Tu as peut-être 5 ou 10 minutes devant toi.\n\n" +
      "**Étape 3 : L'astuce ultime (Système D)**\nSi le trou est énorme et que tu es loin de tout : enlève le pneu, et remplis l'intérieur avec de l'herbe bien serrée ou de la paille. Remonte le pneu. Ça fera un 'coussin' qui sauvera ta jante en métal et te permettra de rouler doucement.",
  }),

  brake: JSON.stringify({
    'Danger': 'Élevé',
    'Temps estimé': '10 min',
    '1. OUTILS NÉCESSAIRES': 'Une clé Allen (souvent la taille 5) ou tes mains.',
    'targetPart': 'freins',
    'targetTools': ['zoom_cles_allen'],
    'Diagnostic et Solution':
      "Tes freins frottent ou ne répondent plus ? Ta sécurité avant tout.\n\n" +
      "**Étape 1 : Ça frotte et ça ralentit**\nLa pince est mal centrée. Desserre un tout petit peu les deux vis qui tiennent la pince sur le cadre. Appuie à fond sur ton levier de frein et reste appuyé : cela va centrer la pince tout seul. Tout en restant appuyé, resserre les vis.\n\n" +
      "**Étape 2 : Le frein est mou**\nSi tu dois écraser la manette contre le guidon pour ralentir, le câble est desserré. Cherche la petite molette là où le câble arrive sur la manette, et dévisse-la un peu : ça va retendre le câble.\n\n" +
      "**Étape 3 : Conseil de prudence**\nSi un seul de tes deux freins marche, ne dépasse pas la vitesse d'un homme qui court. Utilise le frein qui reste très progressivement pour ne pas basculer.",
  }),
};

export const scooterOfflineGuides = {
  pneu: JSON.stringify({
    'Danger': 'Moyen',
    'Temps estimé': '5 min',
    '1. OUTILS NÉCESSAIRES': 'Une pompe (si tu as de la chance) ou tes deux pieds pour marcher.',
    'targetPart': 'scooter_roue_av',
    'targetTools': ['zoom_pompe_main'],
    'Diagnostic et Solution':
      "Ton pneu est tout raplapla ? Sur une trottinette, c'est délicat car les roues sont petites et fragiles.\n\n" +
      "**Étape 1 : Le pneu gonflable (avec de l'air)**\nSi tu as une pompe, gonfle-le à bloc pour essayer de finir ton trajet. Mais attention : si le pneu reste à plat, NE ROULE PAS COMME ÇA. Le moteur se cache souvent juste à l'intérieur de la roue. Si tu roules sur le pneu vide, tu vas écraser et casser le moteur.\n\n" +
      "**Étape 2 : Le pneu dur (plein)**\nIl ne peut pas crever, mais s'il bouge tout seul ou s'il commence à sortir de la roue en métal, arrête-toi tout de suite. Il n'y a pas de solution miracle ici, c'est trop dangereux pour continuer.",
  }),

  jeu: JSON.stringify({
    'Danger': 'Élevé',
    'Temps estimé': '10 min',
    '1. OUTILS NÉCESSAIRES': 'Un jeu de clés en L (Clés Allen).',
    'targetPart': 'scooter_pliage',
    'targetTools': ['zoom_cles_allen'],
    'Diagnostic et Solution':
      "Ton guidon bouge d'avant en arrière comme s'il allait se détacher ? C'est le 'coude' qui permet de la plier qui est fatigué.\n\n" +
      "**Étape 1 : Action de sécurité**\nArrête-toi immédiatement. Si le guidon lâche pendant que tu roules, c'est la chute assurée. Regarde au niveau de la pliure : cherche les petites vis tout autour. Resserre-les le plus fort possible avec tes clés.\n\n" +
      "**Étape 2 : L'astuce du bout de carton**\nSi ça bouge encore un peu même après avoir serré, trouve un morceau de carton ou du scotch épais. Coince-le dans la mâchoire du mécanisme de pliage avant de la refermer. Ça va 'combler le vide' et bloquer le mouvement pour te permettre de rentrer doucement.",
  }),

  bip: JSON.stringify({
    'Danger': 'Faible',
    'Temps estimé': '2 min',
    '1. OUTILS NÉCESSAIRES': 'Aucun, juste tes doigts.',
    'targetPart': 'scooter_guidon',
    'targetTools': [],
    'Diagnostic et Solution':
      "Ta trottinette fait 'BIP BIP' et ne veut plus avancer ? Elle n'est pas cassée, elle est juste en train de te dire qu'elle a un souci.\n\n" +
      "**Étape 1 : La redémarrer**\nÉteins-la complètement. Compte jusqu'à 10 doucement, puis rallume-la. Souvent, ça suffit à lui remettre les idées en place.\n\n" +
      "**Étape 2 : Le frein bloqué**\nSi ta trottinette pense que tu es en train de freiner, elle refuse d'allumer le moteur. Actionne la poignée de frein plusieurs fois d'un coup sec pour vérifier qu'elle revient bien jusqu'au bout.\n\n" +
      "**Étape 3 : Elle a trop chaud**\nSi tu viens de monter une pente très raide, le moteur est en surchauffe. Pose-la à l'ombre et attends 15 minutes qu'elle refroidisse.",
  }),
};
