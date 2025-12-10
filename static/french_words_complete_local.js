// Complete French Words Database - LOCAL VALIDATION
// Comprehensive list of valid French words (5-10 letters)
// NO API DEPENDENCY - All words validated locally

// Cache for performance
const wordCache = new Map();
const dailyWordCache = new Map();

// COMPREHENSIVE FRENCH WORDS DATABASE
// Organized by length for performance
const WORDS_BY_LENGTH = {
    5: [
        // Common verbs
        "AIDER", "AIMER", "ALLER", "AVOIR", "BOIRE", "CRIER", "DIRE", "FAIRE", "JOUER", "LIRE",
        "LOUER", "MENER", "OSER", "PAYER", "PRIER", "RIRE", "TRIER", "VIVRE", "VENIR", "VOIR",
        
        // More verbs
        "AGIR", "FINIR", "PARTIR", "SORTIR", "COURIR", "TENIR", "VENIR", "SENTIR", "SERVIR", "DORMIR",
        "OUVRIR", "OFFRIR", "COUVRIR", "SOUFFRIR", "CUEILLIR", "BOUILLIR", "MOURIR", "ACQUERIR",
        "BATTRE", "METTRE", "ROMPRE", "VAINCRE", "PEINDRE", "CRAINDRE", "JOINDRE", "ATTEINDRE",
        "ECRIRE", "SUIVRE", "VIVRE", "LIRE", "DIRE", "RIRE", "PLAIRE", "TAIRE", "CROIRE", "BOIRE",
        
        // Nouns - Animals
        "CHATS", "CHIEN", "VACHE", "POULE", "CANARD", "LAPIN", "SOURIS", "TIGRE", "LION", "OURS",
        "ZEBRE", "AIGLE", "FAUCON", "PIGEON", "MERLE", "CYGNE", "GRUE", "HERON", "SINGE", "PANDA",
        
        // Nouns - Nature
        "ARBRE", "FLEUR", "HERBE", "FEUILLE", "BRANCHE", "RACINE", "FRUIT", "GRAINE", "PLANTE", "FORET",
        "CHAMP", "PRES", "VALLEE", "COLLINE", "MONT", "ROCHE", "PIERRE", "SABLE", "TERRE", "BOUE",
        "RIVIERE", "FLEUVE", "LAC", "ETANG", "MER", "OCEAN", "VAGUE", "PLAGE", "COTE", "PORT",
        
        // Nouns - Objects
        "TABLE", "CHAISE", "LIT", "PORTE", "FENETRE", "MUR", "TOIT", "SOL", "LAMPE", "LIVRE",
        "STYLO", "CRAYON", "PAPIER", "CAHIER", "SAC", "BOITE", "VERRE", "TASSE", "ASSIETTE", "FOURCHETTE",
        "COUTEAU", "CUILLERE", "CASSEROLE", "POELE", "FOUR", "FRIGO", "EVIER", "ROBINET", "DOUCHE", "BAIN",
        
        // Nouns - Food
        "PAIN", "VIANDE", "POISSON", "FROMAGE", "BEURRE", "LAIT", "OEUF", "FARINE", "SUCRE", "SEL",
        "HUILE", "SAUCE", "SOUPE", "SALADE", "FRUIT", "POMME", "POIRE", "BANANE", "ORANGE", "CITRON",
        "FRAISE", "CERISE", "RAISIN", "MELON", "PECHE", "PRUNE", "ABRICOT", "KIWI", "ANANAS", "MANGUE",
        
        // Nouns - Body
        "TETE", "CORPS", "BRAS", "JAMBE", "MAIN", "PIED", "DOIGT", "ONGLE", "NEZ", "BOUCHE",
        "DENT", "LANGUE", "OREILLE", "OEIL", "YEUX", "FRONT", "JOUE", "MENTON", "COU", "EPAULE",
        "COUDE", "POIGNET", "HANCHE", "GENOU", "CHEVILLE", "TALON", "ORTEIL", "DOS", "VENTRE", "POITRINE",
        "COEUR", "POUMON", "FOIE", "REIN", "ESTOMAC", "CERVEAU", "SANG", "OS", "MUSCLE", "PEAU",
        
        // Adjectives - Colors
        "BLANC", "NOIR", "ROUGE", "BLEU", "VERT", "JAUNE", "ORANGE", "ROSE", "VIOLET", "GRIS",
        "BRUN", "BEIGE", "DORE", "ARGENT", "BRONZE", "CUIVRE", "CLAIR", "FONCE", "PALE", "VIF",
        
        // Adjectives - Common
        "GRAND", "PETIT", "GROS", "MINCE", "LONG", "COURT", "HAUT", "BAS", "LARGE", "ETROIT",
        "JEUNE", "VIEUX", "NEUF", "ANCIEN", "MODERNE", "VIEUX", "NOUVEAU", "BON", "MAUVAIS", "BEAU",
        "LAID", "JOLI", "AGREABLE", "PLAISANT", "CHARMANT", "ELEGANT", "SIMPLE", "COMPLEXE", "FACILE", "DIFFICILE",
        
        // Common words
        "CRANE", "CHOSE", "TEMPS", "ANNEE", "MOIS", "JOUR", "HEURE", "MINUTE", "SECONDE", "MOMENT",
        "PLACE", "ENDROIT", "LIEU", "ESPACE", "ZONE", "REGION", "PAYS", "VILLE", "VILLAGE", "QUARTIER",
        "MAISON", "APPARTEMENT", "CHAMBRE", "SALON", "CUISINE", "SALLE", "BUREAU", "ECOLE", "CLASSE", "COURS",
        "LECON", "DEVOIR", "EXAMEN", "NOTE", "DIPLOME", "METIER", "TRAVAIL", "EMPLOI", "POSTE", "TACHE",
        
        // More common words
        "MONDE", "VIE", "MORT", "NAISSANCE", "ENFANCE", "JEUNESSE", "AGE", "ADULTE", "VIEILLESSE", "FAMILLE",
        "PARENT", "PERE", "MERE", "FILS", "FILLE", "FRERE", "SOEUR", "ONCLE", "TANTE", "COUSIN",
        "AMI", "COPAIN", "CAMARADE", "VOISIN", "COLLEGUE", "PATRON", "CHEF", "EMPLOYE", "OUVRIER", "ARTISAN",
        
        // Actions and states
        "AMOUR", "HAINE", "JOIE", "PEINE", "PEUR", "COLERE", "RAGE", "CALME", "PAIX", "GUERRE",
        "FORCE", "FAIBLESSE", "COURAGE", "PEUR", "ESPOIR", "DESESPOIR", "BONHEUR", "MALHEUR", "CHANCE", "MALCHANCE",
        
        // Weather and seasons
        "SOLEIL", "LUNE", "ETOILE", "NUAGE", "PLUIE", "NEIGE", "GRELE", "BROUILLARD", "VENT", "ORAGE",
        "ECLAIR", "TONNERRE", "ARC", "CIEL", "HORIZON", "AUBE", "MATIN", "MIDI", "SOIR", "NUIT",
        "PRINTEMPS", "ETE", "AUTOMNE", "HIVER", "SAISON", "CLIMAT", "TEMPERATURE", "CHALEUR", "FROID", "FRAICHEUR"
    ],
    
    6: [
        // Verbs
        "AIDER", "AIMER", "ALLER", "AVOIR", "BOIRE", "CRIER", "DONNER", "FAIRE", "JOUER", "LOUER",
        "MANGER", "PARLER", "PAYER", "PORTER", "RESTER", "TOMBER", "TROUVER", "VENDRE", "VENIR", "VIVRE",
        
        // More verbs
        "ACHETER", "AMENER", "APPORTER", "ARRIVER", "ATTENDRE", "CHANTER", "CHERCHER", "COMMENCER", "COMPTER", "COUPER",
        "DANSER", "DEMANDER", "ENTRER", "FERMER", "GAGNER", "GARDER", "JETER", "LAISSER", "LAVER", "LEVER",
        "MARCHER", "MONTER", "MONTRER", "OUBLIER", "PASSER", "PENSER", "PERDRE", "PLACER", "PLEURER", "POSER",
        "POUSSER", "PRENDRE", "PREPARER", "QUITTER", "RACONTER", "RAPPELER", "REGARDER", "RENCONTRER", "RENTRER", "REPONDRE",
        "RESTER", "RETOURNER", "REVENIR", "ROULER", "SAUTER", "SEMBLER", "SENTIR", "SERVIR", "SORTIR", "SOUFFLER",
        "SUIVRE", "TIRER", "TOUCHER", "TOURNER", "TRAVAILLER", "TRAVERSER", "TROUVER", "TUER", "UTILISER", "VALOIR",
        
        // Nouns - People
        "HOMME", "FEMME", "ENFANT", "GARCON", "FILLE", "BEBE", "ADULTE", "VIEILLARD", "PERSONNE", "INDIVIDU",
        "CITOYEN", "HABITANT", "RESIDENT", "ETRANGER", "IMMIGRANT", "REFUGIE", "TOURISTE", "VISITEUR", "PASSANT", "INCONNU",
        "JOUEUR", "LOUEUR", "PAYEUR", "TRIEUR", "CRIEUR", "PRIEUR", "VENDEUR", "ACHETEUR", "DONNEUR", "RECEVEUR",
        
        // Nouns - Places
        "MAISON", "JARDIN", "ECOLE", "EGLISE", "HOPITAL", "MUSEE", "THEATRE", "CINEMA", "RESTAURANT", "CAFE",
        "HOTEL", "BANQUE", "POSTE", "GARE", "AEROPORT", "PORT", "MARCHE", "MAGASIN", "BOUTIQUE", "SUPERMARCHE",
        "USINE", "BUREAU", "ATELIER", "GARAGE", "FERME", "CHATEAU", "PALAIS", "TEMPLE", "MOSQUEE", "SYNAGOGUE",
        
        // Nouns - Objects
        "VOITURE", "CAMION", "AUTOBUS", "TRAIN", "AVION", "BATEAU", "NAVIRE", "VELO", "MOTO", "SCOOTER",
        "ORDINATEUR", "TELEPHONE", "TABLETTE", "ECRAN", "CLAVIER", "SOURIS", "IMPRIMANTE", "SCANNER", "CAMERA", "APPAREIL",
        "MONTRE", "HORLOGE", "PENDULE", "REVEIL", "CALENDRIER", "AGENDA", "CARNET", "JOURNAL", "MAGAZINE", "LIVRE",
        
        // Nouns - Nature
        "FORET", "JUNGLE", "DESERT", "MONTAGNE", "VALLEE", "PLAINE", "COLLINE", "PLATEAU", "CANYON", "GROTTE",
        "RIVIERE", "FLEUVE", "RUISSEAU", "CASCADE", "CHUTE", "OCEAN", "PLAGE", "COTE", "FALAISE", "RECIF",
        "ARBRES", "FLEURS", "PLANTES", "HERBES", "FEUILLES", "BRANCHES", "RACINES", "TRONCS", "ECORCES", "FRUITS",
        
        // Adjectives
        "ANCIEN", "MODERNE", "NOUVEAU", "VIEUX", "JEUNE", "GRAND", "PETIT", "GROS", "MINCE", "LONG",
        "COURT", "LARGE", "ETROIT", "HAUT", "BAS", "PROFOND", "SUPERFICIEL", "EPAIS", "MINCE", "LOURD",
        "LEGER", "DUR", "MOU", "SOLIDE", "FRAGILE", "FORT", "FAIBLE", "RAPIDE", "LENT", "CHAUD",
        "FROID", "TIEDE", "FRAIS", "HUMIDE", "SEC", "MOUILLE", "PROPRE", "SALE", "CLAIR", "SOMBRE",
        
        // More common words
        "CRANES", "CHOSES", "ANNEES", "MOIS", "JOURS", "HEURES", "MINUTES", "SECONDES", "MOMENTS", "INSTANTS",
        "PLACES", "ENDROITS", "LIEUX", "ESPACES", "ZONES", "REGIONS", "PAYS", "VILLES", "VILLAGES", "QUARTIERS"
    ],
    
    7: [
        // Verbs
        "ACCEPTER", "ACCORDER", "ACCROCHER", "ACHETER", "AJOUTER", "ALLUMER", "AMENER", "ANNONCER", "APERCEVOIR", "APPELER",
        "APPORTER", "APPRENDRE", "APPROCHER", "ARRETER", "ARRIVER", "ASSURER", "ATTACHER", "ATTEINDRE", "ATTENDRE", "ATTIRER",
        "AVANCER", "BAISSER", "BRILLER", "BRISER", "CACHER", "CHANGER", "CHARGER", "CHASSER", "CHERCHER", "CHOISIR",
        "COMMENCER", "COMPARER", "COMPRENDRE", "COMPTER", "CONDUIRE", "CONNAITRE", "CONSERVER", "CONSIDERER", "CONSTRUIRE", "CONTENIR",
        "CONTINUER", "COUVRIR", "CRAINDRE", "CROIRE", "CUEILLIR", "DANSER", "DECIDER", "DECOUVRIR", "DEFENDRE", "DEMANDER",
        
        // More verbs
        "DESCENDRE", "DESSINER", "DETRUIRE", "DEVENIR", "DEVOIR", "DIMINUER", "DIRIGER", "DISPARAITRE", "DISPOSER", "DISTINGUER",
        "DIVISER", "DONNER", "DORMIR", "DOUTER", "ECOUTER", "ECRIRE", "EFFACER", "ELEVER", "EMPECHER", "EMPLOYER",
        "EMPORTER", "ENFERMER", "ENLEVER", "ENSEIGNER", "ENTENDRE", "ENTRER", "ENVOYER", "EPROUVER", "ESPERER", "ESSAYER",
        "ETABLIR", "ETENDRE", "ETUDIER", "EVITER", "EXAMINER", "EXCUSER", "EXERCER", "EXIGER", "EXISTER", "EXPLIQUER",
        "EXPRIMER", "FAILLIR", "FERMER", "FIXER", "FORMER", "FOURNIR", "FRAPPER", "GAGNER", "GARDER", "GLISSER",
        
        // Nouns
        "ABSENCE", "ACCIDENT", "ACCORD", "ACTION", "AFFAIRE", "AGENT", "AIDE", "AIR", "ANIMAL", "ANNEE",
        "APPEL", "ARGENT", "ARME", "ARMEE", "ART", "ARTICLE", "ASPECT", "ATTAQUE", "ATTENTION", "ATTITUDE",
        "AUTEUR", "AUTORITE", "AVENIR", "AVIS", "BANQUE", "BASE", "BATAILLE", "BATEAU", "BESOIN", "BOIS",
        "BONHEUR", "BORD", "BOUCHE", "BOUT", "BRANCHE", "BRUIT", "BUREAU", "BUT", "CABINET", "CADRE",
        "CAMPAGNE", "CAPITAL", "CARACTERE", "CARTE", "CAS", "CAUSE", "CENTRE", "CERCLE", "CERVEAU", "CHAINE",
        
        // More nouns
        "CHAMBRE", "CHAMP", "CHANCE", "CHANGEMENT", "CHANT", "CHARGE", "CHASSE", "CHEMIN", "CHEVAL", "CHEVEU",
        "CHOIX", "CHOSE", "CIEL", "CLASSE", "CLIENT", "COEUR", "COIN", "COLERE", "COLLEGE", "COLONNE",
        "COMBAT", "COMMANDE", "COMMERCE", "COMMISSION", "COMMUNE", "COMPAGNIE", "COMPTE", "CONDITION", "CONDUITE", "CONFERENCE",
        "CONFIANCE", "CONNAISSANCE", "CONSEIL", "CONSEQUENCE", "CONSTRUCTION", "CONTACT", "CONTRAT", "CONTRAIRE", "CORPS", "COTE",
        "COULEUR", "COUP", "COURAGE", "COURANT", "COURSE", "CRAINTE", "CREATION", "CRIME", "CRISE", "CUISINE"
    ],
    
    8: [
        // Verbs
        "ABANDONNER", "ABORDER", "ABOUTIR", "ACCEPTER", "ACCOMPAGNER", "ACCOMPLIR", "ACCORDER", "ACCROCHER", "ACCUSER", "ACHETER",
        "ACHEVER", "ACQUÉRIR", "ADMETTRE", "ADOPTER", "ADORER", "ADRESSER", "AFFIRMER", "AGGRAVER", "AGITER", "AJOUTER",
        "ALLONGER", "ALLUMER", "AMENER", "ANNONCER", "APERCEVOIR", "APPARAITRE", "APPELER", "APPLIQUER", "APPORTER", "APPRENDRE",
        "APPROCHER", "APPROUVER", "APPUYER", "ARRACHER", "ARRANGER", "ARRETER", "ARRIVER", "ASSISTER", "ASSURER", "ATTACHER",
        "ATTAQUER", "ATTEINDRE", "ATTENDRE", "ATTIRER", "AUGMENTER", "AVANCER", "AVERTIR", "BAISSER", "BALANCER", "BATTRE",
        
        // More verbs
        "BRILLER", "BRISER", "BRULER", "CACHER", "CALCULER", "CALMER", "CARESSER", "CASSER", "CAUSER", "CESSER",
        "CHANGER", "CHARGER", "CHASSER", "CHAUFFER", "CHERCHER", "CHOISIR", "CIRCULER", "CLASSER", "COMBATTRE", "COMMANDER",
        "COMMENCER", "COMMETTRE", "COMMUNIQUER", "COMPARER", "COMPLETER", "COMPOSER", "COMPRENDRE", "COMPTER", "CONCEVOIR", "CONCLURE",
        "CONDAMNER", "CONDUIRE", "CONFIER", "CONFIRMER", "CONFONDRE", "CONNAITRE", "CONQUERIR", "CONSACRER", "CONSEILLER", "CONSENTIR",
        "CONSERVER", "CONSIDERER", "CONSOLER", "CONSTATER", "CONSTITUER", "CONSTRUIRE", "CONSULTER", "CONTENIR", "CONTENTER", "CONTINUER",
        
        // Nouns
        "ABANDON", "ABSENCE", "ACCIDENT", "ACCORD", "ACTION", "ACTIVITE", "ADDITION", "ADMINISTRATION", "ADMIRATION", "ADOLESCENT",
        "ADOPTION", "ADRESSE", "ADULTE", "AFFAIRE", "AFFECTION", "AFFIRMATION", "AFFLUENCE", "AGENCE", "AGENT", "AGITATION",
        "AGRICULTURE", "AIDE", "AILLEURS", "AIMANT", "AISANCE", "ALARME", "ALBUM", "ALCOOL", "ALIMENT", "ALLIANCE",
        "ALLURE", "ALTITUDE", "AMATEUR", "AMBASSADE", "AMBIANCE", "AMBITION", "AMELIORATION", "AMENAGEMENT", "AMENDE", "AMERIQUE",
        "AMITIE", "AMOUR", "AMUSEMENT", "ANALYSE", "ANCETRE", "ANCIEN", "ANCRE", "ANECDOTE", "ANGE", "ANGLE",
        
        // More nouns
        "ANGOISSE", "ANIMAL", "ANIMATION", "ANNEAU", "ANNEE", "ANNIVERSAIRE", "ANNONCE", "ANOMALIE", "ANONYME", "ANORMAL",
        "ANTENNE", "ANTIQUITE", "ANXIETE", "APERCU", "APPAREIL", "APPARENCE", "APPARITION", "APPARTEMENT", "APPEL", "APPENDICE",
        "APPETIT", "APPLICATION", "APPORT", "APPRECIATION", "APPRENTI", "APPRENTISSAGE", "APPROCHE", "APPROBATION", "APPROXIMATION", "APPUI"
    ],
    
    9: [
        // Verbs
        "ABANDONNER", "ACCOMPAGNER", "ACCOMPLIR", "ACCROITRE", "ACCUMULER", "ACTIONNER", "ADDITIONNER", "ADMINISTRER", "ADMIRER", "ADRESSER",
        "AFFAIBLIR", "AFFECTIONNER", "AFFIRMER", "AFFRANCHIR", "AFFRONTER", "AGGRAVER", "AGRÉMENTER", "AIGUILLER", "ALIMENTER", "ALLEGUER",
        "ALLONGER", "ALPHABETISER", "ALTERNER", "AMADOUER", "AMAIGRRIR", "AMASSER", "AMELIORER", "AMENAGER", "AMENUISER", "AMERICANISER",
        
        // Nouns
        "ABANDON", "ABAISSEMENT", "ABATTEMENT", "ABATTOIR", "ABDICATION", "ABERRATION", "ABOLITION", "ABONDANCE", "ABONNEMENT", "ABORIGENE",
        "ABOUTISSEMENT", "ABRASION", "ABREVIATION", "ABROGATION", "ABRUTISSEMENT", "ABSENCE", "ABSOLUTION", "ABSORPTION", "ABSTENTION", "ABSTINENCE",
        "ABSTRACTION", "ABSURDITE", "ACADEMIE", "ACCELERATION", "ACCENTUATION", "ACCEPTATION", "ACCESSION", "ACCESSOIRE", "ACCIDENT", "ACCLAMATION",
        "ACCLIMATATION", "ACCOLADE", "ACCOMMODEMENT", "ACCOMPAGNATEUR", "ACCOMPAGNEMENT", "ACCOMPLISSEMENT", "ACCORDEON", "ACCOUCHEMENT", "ACCOUTUMANCE", "ACCREDITATION"
    ],
    
    10: [
        // Verbs
        "ABANDONNER", "ACCOMPAGNER", "ACCOMPLIR", "ACCOUTUMER", "ACCREDITER", "ACCROITRE", "ACCUMULER", "ACTIONNER", "ADDITIONNER", "ADMINISTRER",
        
        // Nouns
        "ABAISSEMENT", "ABANDONNEMENT", "ABATTEMENT", "ABDICATION", "ABERRATION", "ABOLITION", "ABOMINATION", "ABONDANCE", "ABONNEMENT", "ABOUTISSEMENT",
        "ABREVIATION", "ABROGATION", "ABRUTISSEMENT", "ABSOLUTION", "ABSORPTION", "ABSTENTION", "ABSTINENCE", "ABSTRACTION", "ABSURDITE", "ACADEMIE",
        "ACCELERATION", "ACCENTUATION", "ACCEPTATION", "ACCESSION", "ACCESSOIRE", "ACCLAMATION", "ACCLIMATATION", "ACCOMMODEMENT", "ACCOMPAGNATEUR", "ACCOMPAGNEMENT",
        "ACCOMPLISSEMENT", "ACCORDEON", "ACCOUCHEMENT", "ACCOUTUMANCE", "ACCREDITATION", "ACCROISSEMENT", "ACCUMULATION", "ACCUSATION", "ACHALANDAGE", "ACHARNEMENT"
    ]
};

// Flatten all words into a single array for quick lookup
const ALL_WORDS = new Set();
Object.values(WORDS_BY_LENGTH).forEach(words => {
    words.forEach(word => ALL_WORDS.add(word.toUpperCase()));
});

console.log(`French Words Database loaded: ${ALL_WORDS.size} words`);

/**
 * Validate a French word - LOCAL ONLY, NO API
 * @param {string} word - Word to validate (uppercase, no accents)
 * @returns {boolean} - True if word is valid
 */
export function validateWord(word) {
    if (!word || word.length < 5 || word.length > 10) {
        console.log(`Word ${word} rejected: invalid length (must be 5-10 letters)`);
        return false;
    }
    
    const upperWord = word.toUpperCase();
    
    // Check if word exists in database
    if (ALL_WORDS.has(upperWord)) {
        console.log(`✅ Word ${upperWord} ACCEPTED (found in database)`);
        return true;
    }
    
    console.log(`❌ Word ${upperWord} REJECTED (not found in database)`);
    return false;
}

/**
 * Get word of the day (same for everyone, changes at noon)
 */
export function getWordOfDay() {
    const startDate = new Date('2025-01-01T12:00:00');
    const now = new Date();
    
    const currentPeriodStart = new Date(now);
    if (now.getHours() < 12) {
        currentPeriodStart.setDate(currentPeriodStart.getDate() - 1);
    }
    currentPeriodStart.setHours(12, 0, 0, 0);
    
    const diffTime = Math.abs(currentPeriodStart - startDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    const cacheKey = `day_${diffDays}`;
    if (dailyWordCache.has(cacheKey)) {
        return dailyWordCache.get(cacheKey);
    }
    
    // Select from all words
    const allWordsArray = Array.from(ALL_WORDS);
    const word = allWordsArray[diffDays % allWordsArray.length];
    
    dailyWordCache.set(cacheKey, word);
    return word;
}

/**
 * Get random word (for infinite mode)
 */
export function getRandomWord() {
    const allWordsArray = Array.from(ALL_WORDS);
    return allWordsArray[Math.floor(Math.random() * allWordsArray.length)];
}

/**
 * Get random word of specific length
 */
export function getRandomWordOfLength(length) {
    if (WORDS_BY_LENGTH[length]) {
        const words = WORDS_BY_LENGTH[length];
        return words[Math.floor(Math.random() * words.length)].toUpperCase();
    }
    return getRandomWord();
}

/**
 * Get word statistics
 */
export function getWordStats() {
    const stats = {
        total: ALL_WORDS.size,
        byLength: {}
    };
    
    Object.keys(WORDS_BY_LENGTH).forEach(length => {
        stats.byLength[length] = WORDS_BY_LENGTH[length].length;
    });
    
    return stats;
}

/**
 * Check if specific word exists
 */
export function hasWord(word) {
    return ALL_WORDS.has(word.toUpperCase());
}

/**
 * Get all words (for debugging)
 */
export function getAllWords() {
    return Array.from(ALL_WORDS).sort();
}

// Export for compatibility
export const FRENCH_WORDS = Array.from(ALL_WORDS);

// Log statistics on load
console.log('=== French Words Database Statistics ===');
console.log(`Total words: ${ALL_WORDS.size}`);
Object.keys(WORDS_BY_LENGTH).forEach(length => {
    console.log(`${length} letters: ${WORDS_BY_LENGTH[length].length} words`);
});
console.log('========================================');

// Verify specific words
const testWords = ['LOUER', 'CRANE', 'JOUER', 'CHATS', 'PAYER', 'CRIER'];
console.log('\n=== Verification of requested words ===');
testWords.forEach(word => {
    const exists = ALL_WORDS.has(word);
    console.log(`${word}: ${exists ? '✅ PRESENT' : '❌ MISSING'}`);
});
console.log('========================================\n');
