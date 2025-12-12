// =======================================================
// CONFIGURAÇÕES GLOBAIS
// =======================================================

const SAVE_SLOT_KEY = 'anelQuatroReinos_slot_'; 
const MAX_SAVE_SLOTS = 5;

// Declaração principal de gameState
let gameState = {
    playerName: "",
    playerClass: "",
    playerStats: { pv_current: 0, mp_current: 0, pv: 0, mp: 0, attack: 0, magic: 0, defense: 0, agility: 0 }, 
    inventory: [],
    currentPhase: 0, 
    hasRing: false,
    saveSlot: null,
    isMusicPlaying: true,
    playerAttacks: [], 
    activeBuffs: [],
    playerCoords: { left: 10, bottom: 0 },
    playerDirection: 'right',
    money: 0,
    enemyKills: 0,
    isBossActive: false,
    isFinalBossDefeated: false,
    quizState: {
        currentQuestion: null, 
        answeredQuestions: [], 
        inQuizScreen: false,
        isFinalQuiz: false
    }
};

let selectedClass = null; 

// Objeto temporário para armazenar o estado da batalha
let combatState = {
    active: false,
    enemyName: null,
    enemyStats: null, 
    chaseLoop: null,
    evasionBonus: 0 
};
