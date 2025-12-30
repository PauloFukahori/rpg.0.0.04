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
    money: 500, // Dinheiro inicial para comprar itens básicos
    meditationCharges: 4, // Limite de meditação (max 4)
    mobsDefeatedInPhase: 0, // Progresso para o Boss
    defeatedMobNames: [], // Rastreia quais mobs especificos morreram
    enemyKills: 0,
    isBossActive: false,
    isFinalBossDefeated: false,
    quizState: {
        currentQuestion: null,
        answeredQuestions: [],
        inQuizScreen: false,
        isFinalQuiz: false
    },

    // Sistema de vidas extras
    extraLives: 3,

    // Sistema de anéis - 4 slots para equipar anéis de boss
    equippedRings: {
        slot1: null,
        slot2: null,
        slot3: null,
        slot4: null
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
