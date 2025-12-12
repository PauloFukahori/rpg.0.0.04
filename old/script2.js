// =======================================================
// VARIÁVEIS GLOBAIS E CONFIGURAÇÕES
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

let combatState = {
    active: false,
    enemyName: null,
    enemyStats: null, 
    chaseLoop: null,
    evasionBonus: 0,
    attackDelayMs: 1200 // Delay para simular perseguição/ataque
};


// =======================================================
// DADOS DE CLASSE, FASES, INIMIGOS, ITENS, LOJA E QUIZ
// =======================================================

const CLASSES = {
    'Guerreiro do Leão': {
        description: 'Mestre do combate corpo a corpo. Alto PV e Dano Físico.',
        baseStats: { pv: 120, mp: 30, attack: 15, magic: 5, defense: 10, agility: 5 },
        image: 'assets/images/classes/guerreiro-leao.png', 
        attacks: [
            { id: 'golpeBasico', name: "Golpe Básico", type: "physical", cost: 0, multiplier: 1.0, icon: "⚔️", description: "Ataque físico padrão." },
            { id: 'furia', name: "Fúria", type: "physical", cost: 10, multiplier: 1.5, icon: "💥", description: "Ataque físico poderoso que custa 10 MP." },
            { id: 'gritoGuerra', name: "Grito de Guerra", type: "buff", cost: 5, targetStat: "defense", value: 5, duration: 3, icon: "🛡️", description: "Aumenta a Defesa em 5 por 3 turnos." }
        ]
    },
    'Mago Dracônico': {
        description: 'Arcanista poderoso, mestre em magias destrutivas. Alto Dano Mágico.',
        baseStats: { pv: 70, mp: 100, attack: 5, magic: 20, defense: 3, agility: 7 },
        image: 'assets/images/classes/mago-draconico.png', 
        attacks: [
            { id: 'bolaFogo', name: "Bola de Fogo", type: "magic", cost: 10, multiplier: 1.2, icon: "🔥", description: "Dano mágico de fogo." },
            { id: 'escudoArcano', name: "Escudo Arcano", type: "buff", cost: 15, targetStat: "magic", value: 5, duration: 3, icon: "✨", description: "Aumenta o Poder Mágico em 5 por 3 turnos." },
            { id: 'raioGelo', name: "Raio de Gelo", type: "magic", cost: 12, multiplier: 1.0, icon: "❄️", description: "Dano mágico com chance de lentidão." }
        ]
    },
    'Ladino das Ondas': {
        description: 'Rápido e furtivo, focado em ataques críticos e esquiva. Alta Agilidade.',
        baseStats: { pv: 90, mp: 50, attack: 12, magic: 8, defense: 5, agility: 15 },
        image: 'assets/images/classes/ladino-ondas.png', 
        attacks: [
            { id: 'ataqueRapido', name: "Ataque Rápido", type: "physical", cost: 5, multiplier: 0.8, icon: "🗡️", description: "Ataque com alta chance de acerto." },
            { id: 'fugaSombra', name: "Fuga Sombra", type: "buff", cost: 10, targetStat: "agility", value: 5, duration: 2, icon: "💨", description: "Aumenta a Agilidade em 5 por 2 turnos." },
            { id: 'punhalVeneno', name: "Punhal de Veneno", type: "physical", cost: 8, multiplier: 1.1, icon: "🧪", description: "Dano físico com efeito de veneno." }
        ]
    },
    'Monge de Cristal': {
        description: 'Defensor inabalável. Focado em sobrevivência e suporte. Alta Defesa.',
        baseStats: { pv: 100, mp: 70, attack: 10, magic: 10, defense: 15, agility: 5 },
        image: 'assets/images/classes/monge-cristal.png', 
        attacks: [
            { id: 'defesaTotal', name: "Defesa Total", type: "buff", cost: 5, targetStat: "defense", value: 8, duration: 2, icon: "🛡️", description: "Aumenta a Defesa em 8 por 2 turnos." },
            { id: 'curaMenor', name: "Cura Menor", type: "heal", cost: 15, value: 25, icon: "➕", description: "Recupera 25 PV." },
            { id: 'meditacao', name: "Meditação", type: "buff", cost: 0, targetStat: "mp_current", value: 10, duration: 1, icon: "🧘", description: "Recupera 10 MP no turno." }
        ]
    },
    'Caçador Elemental': {
        description: 'Atirador versátil, capaz de usar diferentes tipos de ataques à distância.',
        baseStats: { pv: 95, mp: 60, attack: 13, magic: 7, defense: 7, agility: 10 },
        image: 'assets/images/classes/cacador-elemental.png', 
        attacks: [
            { id: 'flechaFogo', name: "Flecha de Fogo", type: "physical", cost: 8, multiplier: 1.1, icon: "🔥", description: "Dano físico com bônus de fogo." },
            { id: 'tiroPrecisao', name: "Tiro de Precisão", type: "physical", cost: 15, multiplier: 1.5, icon: "🎯", description: "Ataque focado, alto dano crítico." },
            { id: 'recuo', name: "Recuo Rápido", type: "buff", cost: 5, targetStat: "agility", value: 3, duration: 3, icon: "↩️", description: "Aumenta a Agilidade em 3 por 3 turnos para se reposicionar." }
        ]
    }
};

const ENEMIES = {
    // Inimigos Comuns (Visuais Atualizados)
    'Slime de Fogo': { pv: 50, attack: 10, defense: 5, isBoss: false, rewardMoney: 10, dropTable: { 'Poção de Cura': 30, 'Amuleto da Sorte (AGI+)': 5 }, image: 'assets/images/enemies/verme.png' }, 
    'Salamandra': { pv: 80, attack: 15, defense: 8, isBoss: false, rewardMoney: 15, dropTable: { 'Poção de Mana': 20, 'Amuleto da Sorte (AGI+)': 10 }, image: 'assets/images/enemies/morcego.png' }, 
    'Kraken Jr.': { pv: 110, attack: 20, defense: 10, isBoss: false, rewardMoney: 20, dropTable: { 'Poção de Cura': 25, 'Poção de Mana': 25 }, image: 'assets/images/enemies/piranha.png' }, 
    'Ladino das Ondas Rebelde': { pv: 75, attack: 18, defense: 7, isBoss: false, rewardMoney: 25, dropTable: { 'Amuleto da Sorte (AGI+)': 15 }, image: 'assets/images/enemies/golem-cristal.png' }, 
    'Golem de Pedra': { pv: 150, attack: 12, defense: 15, isBoss: false, rewardMoney: 30, dropTable: { 'Escudo de Pedra (DEF+)': 10 }, image: 'assets/images/enemies/golem-cristal.png' }, 
    'Monge Desiludido': { pv: 100, attack: 14, defense: 12, isBoss: false, rewardMoney: 35, dropTable: { 'Capa de MP (MP+)': 10 }, image: 'assets/images/enemies/verme.png' }, 
    'Harpias': { pv: 90, attack: 16, defense: 6, isBoss: false, rewardMoney: 40, dropTable: { 'Botas Rápidas (AGI+)': 10 }, image: 'assets/images/enemies/harpia.png' }, 
    'Mago Dracônico Caído': { pv: 130, attack: 22, defense: 9, isBoss: false, rewardMoney: 45, dropTable: { 'Cajado de Fogo (MAG+)': 10 }, image: 'assets/images/enemies/morcego.png' }, 
    
    // Bosses de Fase
    'Guardião da Chama': { pv: 200, attack: 25, defense: 15, isBoss: true, rewardMoney: 100, dropTable: { 'Anel de Fogo': 100 }, image: 'assets/images/enemies/dragao-fantasma.png' }, 
    'Serpente Gélida': { pv: 250, attack: 30, defense: 18, isBoss: true, rewardMoney: 150, dropTable: { 'Anel de Água': 100 }, image: 'assets/images/enemies/sereia.jpg' }, 
    'Guardião da Rocha': { pv: 300, attack: 35, defense: 25, isBoss: true, rewardMoney: 200, dropTable: { 'Anel de Rocha': 100 }, image: 'assets/images/enemies/gargula.png' }, 
    'Vigia do Céu': { pv: 350, attack: 40, defense: 20, isBoss: true, rewardMoney: 250, dropTable: { 'Anel de Vento': 100 }, image: 'assets/images/enemies/elemental-ar.png' }, 

    // Boss Final - NOVO E DIFICÍLIMO
    'O Abominável Guardião Final': { pv: 1200, attack: 50, defense: 40, isBoss: true, rewardMoney: 2000, dropTable: { 'Anel Completo': 100 }, image: 'assets/images/enemies/guardiao-final.png' } 
};

const PHASES = {
    1: {
        name: "Reino da Chama (Fogo)",
        scenarioImage: "assets/images/scenarios/scenario_fire.gif", 
        introText: "Você emerge em uma terra de cinzas e magma. Encontre o primeiro artefato!",
        enemies: ['Slime de Fogo', 'Salamandra'],
        bossName: 'Guardião da Chama',
        killsToBoss: 5,
    },
    2: {
        name: "Reino da Tundra (Água)",
        scenarioImage: "assets/images/scenarios/scenario_water.jpg", 
        introText: "As ondas geladas da Tundra testarão sua agilidade. Cuidado com as criaturas marinhas!",
        enemies: ['Kraken Jr.', 'Ladino das Ondas Rebelde'],
        bossName: 'Serpente Gélida',
        killsToBoss: 7,
    },
    3: {
        name: "Reino da Rocha (Terra)",
        scenarioImage: "assets/images/scenarios/scenario_earth.jpg", 
        introText: "Profundezas escuras, cristalinas e cheias de armadilhas. A defesa será sua melhor amiga aqui.",
        enemies: ['Golem de Pedra', 'Monge Desiludido'],
        bossName: 'Guardião da Rocha',
        killsToBoss: 8,
    },
    4: {
        name: "Reino do Vento (Ar)",
        scenarioImage: "assets/images/scenarios/scenario_air.jpg", 
        introText: "O último reino flutua nas nuvens, guardado por bestas aladas e magias poderosas. O anel está próximo.",
        enemies: ['Harpias', 'Mago Dracônico Caído'],
        bossName: 'Vigia do Céu',
        killsToBoss: 10,
    },
    5: { 
        name: "O Desafio da Memória",
        scenarioImage: "assets/images/scenarios/scenario_final.jpg", 
        introText: "Para forjar o Anel Completo, você deve provar que conhece a história dos Quatro Reinos.",
        type: 'quiz_final',
        finalBossName: 'O Abominável Guardião Final'
    }
};

const RANDOM_ITEMS = [
    { name: 'Poção de Cura', type: 'good', effect: 'pv_current', value: 30, chance: 35, emoji: '❤️' },
    { name: 'Poção de Mana', type: 'good', effect: 'mp_current', value: 20, chance: 30, emoji: '✨' },
    { name: 'Amuleto da Sorte (AGI+)', type: 'good', effect: 'agility_temp', value: 5, chance: 10, emoji: '🍀' },
    { name: 'Erva Daninha Venenosa', type: 'bad', effect: 'pv_current', value: -15, chance: 15, emoji: '🤢' },
    { name: 'Espinhos Ferrugentos (DEF-)', type: 'bad', effect: 'defense_temp', value: -3, chance: 10, emoji: '⚙️' },
];

const QUIZ_QUESTIONS = [
    { id: 1, question: "Qual o nome do Reino inicial (Fase 1)?", options: ["Reino da Água", "Reino da Chama", "Reino da Rocha", "Reino do Vento"], answer: 1, reward: { type: 'mp_current', value: 30 }, hint: "O primeiro Anel que você busca é o Anel de Fogo." },
    { id: 2, question: "Qual estatística o Ladino das Ondas possui mais alta?", options: ["PV", "Defesa", "Agilidade", "Magia"], answer: 2, reward: { type: 'pv_current', value: 30 }, hint: "Ele é rápido e furtivo." },
    { id: 3, question: "Qual é o efeito do 'Grito de Guerra' do Guerreiro do Leão?", options: ["Aumenta Ataque", "Aumenta Defesa", "Cura PV", "Restaura MP"], answer: 1, reward: { type: 'mp_current', value: 15 }, hint: "É uma habilidade defensiva de buff." },
    { id: 4, question: "Qual o custo de MP da habilidade 'Fúria' do Guerreiro?", options: ["0 MP", "5 MP", "10 MP", "15 MP"], answer: 2, reward: { type: 'pv_current', value: 20 }, hint: "Olhe os ataques iniciais do Guerreiro." },
    { id: 5, question: "Quantos Reinos formam o Anel Completo?", options: ["Três", "Quatro", "Cinco", "Seis"], answer: 1, reward: { type: 'mp_current', value: 20 }, hint: "O nome do jogo tem a resposta." },
    { id: 6, question: "Qual elemento NÃO faz parte dos Quatro Reinos?", options: ["Água", "Fogo", "Gelo", "Terra"], answer: 2, reward: { type: 'pv_current', value: 20 }, hint: "Fogo, Água, Terra, Ar." },
    { id: 7, question: "Qual é o efeito mais comum do item 'Erva Daninha Venenosa'?", options: ["Aumenta MP", "Diminui Defesa", "Dano em PV", "Cura PV"], answer: 2, reward: { type: 'mp_current', value: 10 }, hint: "Olhe a tabela de itens." }
];

const SHOP_ITEMS = {
    // Consumíveis Padrão
    'Poção Forte de Cura': { type: 'consumable', effect: 'pv_current', value: 50, cost: 50, emoji: '❤️' },
    'Poção Forte de Mana': { type: 'consumable', effect: 'mp_current', value: 40, cost: 40, emoji: '✨' },
    
    // Equipamentos Básicos
    'Espada do Reino (+5 ATK)': { type: 'equipment', stat: 'attack', value: 5, cost: 150, emoji: '⚔️' },
    'Manto da Sabedoria (+5 MAG)': { type: 'equipment', stat: 'magic', value: 5, cost: 150, emoji: '🔮' },
    'Armadura Reforçada (+5 DEF)': { type: 'equipment', stat: 'defense', value: 5, cost: 150, emoji: '🛡️' },
    'Botas Leves (+5 AGI)': { type: 'equipment', stat: 'agility', value: 5, cost: 150, emoji: '💨' },

    // Equipamentos Exclusivos de Fase (mantidos)
    'Essência de Fogo (+10 ATK)': { type: 'equipment', stat: 'attack', value: 10, cost: 300, phaseUnlock: 1, emoji: '🔥' },
    'Amuleto Aquático (+10 AGI)': { type: 'equipment', stat: 'agility', value: 10, cost: 300, phaseUnlock: 2, emoji: '🌊' },
    
    // ITENS LENDÁRIOS PARA FORTALECIMENTO DE CLASSE
    'Foco do Leão (+20 ATK)': { type: 'equipment', stat: 'attack', value: 20, cost: 800, phaseUnlock: 3, emoji: '🦁' },
    'Grimório Dracônico (+20 MAG)': { type: 'equipment', stat: 'magic', value: 20, cost: 800, phaseUnlock: 3, emoji: '🐉' },
    'Sapatos Sombrios (+20 AGI)': { type: 'equipment', stat: 'agility', value: 20, cost: 800, phaseUnlock: 4, emoji: '🌑' },
    'Escudo de Cristal (+20 DEF)': { type: 'equipment', stat: 'defense', value: 20, cost: 800, phaseUnlock: 4, emoji: '💎' },
};


// =======================================================
// FUNÇÕES UTILITÁRIAS
// =======================================================

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// FUNÇÃO ATUALIZADA: Com chance de spawn do boss e correção do random de inimigos
function getRandomEnemy(phaseNum) {
    const phase = PHASES[phaseNum] || PHASES[1];
    
    if (gameState.isBossActive) return combatState.enemyName; 
    
    const bossName = phase.bossName;
    const killsNeeded = phase.killsToBoss || 999; 
    const bossDropItem = ENEMIES[bossName]?.dropTable[bossName];
    
    console.log(`[SPAWN MANAGER] Fase ${phaseNum}. Kills: ${gameState.enemyKills}/${killsNeeded}. Boss Dead: ${gameState.inventory.includes(bossDropItem)}`);

    // 1. Lógica para Boss de Fase (chance de 5% após Kills Mínimos)
    if (gameState.enemyKills > 0 && !gameState.inventory.includes(bossDropItem)) {
        
        if (gameState.enemyKills >= killsNeeded) {
            
            const spawnRoll = getRandomInt(1, 100);

            if (spawnRoll <= 5 || gameState.enemyKills >= killsNeeded + 5) {
                console.log(`[SPAWN MANAGER] Boss da Fase ${phaseNum} (${bossName}) ativado! Roll: ${spawnRoll}%`); 
                gameState.isBossActive = true; 
                return bossName;
            }
        }
    }

    // 2. Lógica para Boss FINAL (após Quiz)
    const finalBossName = PHASES[5]?.finalBossName;
    if (phaseNum === 5 && gameState.quizState.answeredQuestions.length === QUIZ_QUESTIONS.length && !gameState.isFinalBossDefeated) {
         console.log(`[SPAWN MANAGER] Boss FINAL (${finalBossName}) ativado!`);
         gameState.isBossActive = true; 
         return finalBossName;
    }


    // 3. Spawna Inimigo Comum (Seleção Aleatória Corrigida)
    const enemies = phase.enemies;
    const enemyIndex = getRandomInt(0, enemies.length - 1);
    const enemyName = enemies[enemyIndex];
    
    console.log(`[SPAWN MANAGER] Inimigo Comum Spawnado: ${enemyName} (Índice: ${enemyIndex})`); 
    return enemyName;
}

function findRandomItem() {
    const totalChance = RANDOM_ITEMS.reduce((sum, item) => sum + item.chance, 0);
    let randomRoll = getRandomInt(1, totalChance);

    for (const item of RANDOM_ITEMS) {
        randomRoll -= item.chance;
        if (randomRoll <= 0) {
            return item;
        }
    }
    return RANDOM_ITEMS[0]; 
}

// =======================================================
// LÓGICA DO JOGADOR
// =======================================================

function createPlayer(name, className, slotNum) {
    const classData = CLASSES[className];
    
    gameState.playerName = name;
    gameState.playerClass = className;
    gameState.playerStats = { 
        ...classData.baseStats,
        pv_current: classData.baseStats.pv, 
        mp_current: classData.baseStats.mp 
    };
    gameState.inventory = [];
    gameState.currentPhase = 1; // FORÇA INÍCIO NA FASE 1
    gameState.hasRing = false;
    gameState.saveSlot = slotNum;
    gameState.playerAttacks = classData.attacks;
    gameState.activeBuffs = [];
    gameState.playerCoords = { left: 10, bottom: 0 };
    gameState.money = 0; 
    gameState.enemyKills = 0; 
    gameState.isBossActive = false;
    gameState.isFinalBossDefeated = false;
    gameState.quizState = {
        currentQuestion: null, 
        answeredQuestions: [], 
        inQuizScreen: false,
        isFinalQuiz: false
    };
}

function getPlayerStatsWithBuffs() {
    let stats = { ...gameState.playerStats };
    
    gameState.activeBuffs.forEach(buff => {
        if (['attack', 'magic', 'defense', 'agility'].includes(buff.targetStat)) {
            stats[buff.targetStat] += buff.value;
        }
    });

    gameState.inventory.forEach(itemName => {
        const item = SHOP_ITEMS[itemName]; 
        
        if (item && item.type === 'equipment') {
            stats[item.stat] += item.value;
        }
    });

    return stats;
}

function updatePlayerPosition() {
    const playerFigure = document.getElementById('player-figure');
    if (playerFigure) {
        playerFigure.style.left = `${gameState.playerCoords.left}%`;
        playerFigure.style.bottom = `${gameState.playerCoords.bottom}px`;
    }
}

function updatePlayerStatus() {
    const statusDiv = document.getElementById('player-status');
    if (!statusDiv) return;

    const currentStats = getPlayerStatsWithBuffs(); 
    
    const statsList = Object.entries(currentStats).map(([key, value]) => {
        if (['pv', 'mp', 'pv_current', 'mp_current'].includes(key)) return ''; 

        const buffIcon = gameState.activeBuffs.some(b => b.targetStat === key) ? ' (⬆️)' : '';

        const displayKey = key.toUpperCase();
        return `<li><strong>${displayKey}</strong>: ${value} ${buffIcon}</li>`;
    }).join('');

    const pvBar = `<div class="bar-container pv"><div class="bar" style="width: ${(currentStats.pv_current / currentStats.pv) * 100}%;"></div><span>❤️ PV: ${currentStats.pv_current} / ${currentStats.pv}</span></div>`;
    const mpBar = `<div class="bar-container mp"><div class="bar" style="width: ${(currentStats.mp_current / currentStats.mp) * 100}%;"></div><span>✨ MP: ${currentStats.mp_current} / ${currentStats.mp}</span></div>`;

    statusDiv.innerHTML = `
        <h4>${gameState.playerName} - ${gameState.playerClass} (Slot ${gameState.saveSlot})</h4>
        <div class="resource-bars">
            ${pvBar}
            ${mpBar}
        </div>
        <ul class="stats-list">
            ${statsList}
        </ul>
        <p>Itens no Inventário: ${gameState.inventory.length} | 💰 Ouro: ${gameState.money}</p>
    `;
    
    const playerFigure = document.getElementById('player-figure');
    const classImage = CLASSES[gameState.playerClass]?.image || 'assets/images/classes/placeholder.png'; 
    playerFigure.style.backgroundImage = `url(${classImage})`;
}


// =======================================================
// LÓGICA DE MOVIMENTO NO MAPA (Exploração - FLUIDA)
// =======================================================

function renderExplorationActions() {
    const actionButtons = document.getElementById('action-buttons');
    const currentPhaseData = PHASES[gameState.currentPhase];
    
    const bossName = currentPhaseData?.bossName;
    const bossDropItem = bossName ? ENEMIES[bossName]?.dropTable[bossName] : null;
    const bossDefeated = bossDropItem ? gameState.inventory.includes(bossDropItem) : true; 

    actionButtons.innerHTML = `
        <button onclick="movePlayer('left')" class="rpg-button move-button">⬅️ Esquerda (A)</button>
        <button onclick="movePlayer('up')" class="rpg-button move-button">⬆️ Cima (W)</button>
        <button onclick="movePlayer('right')" class="rpg-button move-button">➡️ Direita (D)</button>
        <button onclick="movePlayer('down')" class="rpg-button move-button">⬇️ Baixo (S)</button>
        
        <button onclick="exploreArea()" class="rpg-button explore-button">🔍 Explorar Caminho</button>
        <button onclick="searchSecret()" class="rpg-button explore-button">🗝️ Procurar Secreta</button>
        
        <button onclick="meditateAction()" class="rpg-button utility-button">🧘 Meditar/Descansar</button>
        <button onclick="openShop()" class="rpg-button utility-button">🛍️ LOJA</button>
        <button onclick="showInventory()" class="rpg-button utility-button">🎒 Inventário</button>
        <button onclick="saveGame()" class="rpg-button utility-button">💾 Salvar Jogo</button>

        ${bossDefeated 
            ? `<button onclick="loadPhase(gameState.currentPhase + 1)" class="rpg-button advance-button">🗺️ Avançar Fase ${gameState.currentPhase + 1}</button>`
            : `<button class="rpg-button advance-button" disabled>⚠️ Mate o Boss (${bossName}) para Avançar</button>`
        }
    `; 

    if (gameState.currentPhase === 5 && gameState.isFinalBossDefeated) {
        actionButtons.innerHTML = `<button onclick="showFinalVictory()" class="rpg-button advance-button">🎉 Ver Mensagem Final</button>`;
    }
}

function meditateAction() {
    if (combatState.active) return;
    
    animateAction('player-figure', 'searching'); 
    
    const mpRecovered = 15;
    const pvRecovered = 10;
    
    gameState.playerStats.mp_current = Math.min(
        gameState.playerStats.mp_current + mpRecovered,
        gameState.playerStats.mp
    );
    gameState.playerStats.pv_current = Math.min(
        gameState.playerStats.pv_current + pvRecovered,
        gameState.playerStats.pv
    );
    
    updatePlayerStatus();
    
    const encounterRoll = getRandomInt(1, 10);
    
    if (encounterRoll <= 3) { 
        const enemyName = getRandomEnemy(gameState.currentPhase);
        updateGameText(`Você sente uma presença... A meditação foi interrompida! Um **${enemyName}** te ataca!`);
        startCombat(enemyName); 
        return; 
    } else {
        updateGameText(`Você meditou pacificamente. Recuperou **${mpRecovered} MP** e **${pvRecovered} PV**.`);
    }

    setTimeout(() => renderExplorationActions(), 1000);
}


function movePlayer(direction) {
    if (combatState.active && direction !== 'jump') {
        const actionButtons = document.getElementById('action-buttons');
        if (actionButtons.style.pointerEvents === 'none') {
            return; 
        }
    }


    let newLeft = gameState.playerCoords.left;
    let newBottom = gameState.playerCoords.bottom;
    const step = 5; 
    const stepVertical = 20; 
    let moved = false;

    if (direction === 'left') {
        newLeft = Math.max(10, newLeft - step);
        moved = newLeft !== gameState.playerCoords.left;
    } else if (direction === 'right') {
        newLeft = Math.min(60, newLeft + step); 
        moved = newLeft !== gameState.playerCoords.left;
    } else if (direction === 'up') {
        newBottom = Math.min(80, newBottom + stepVertical); 
        moved = newBottom !== gameState.playerCoords.bottom;
    } else if (direction === 'down') {
        newBottom = Math.max(0, newBottom - stepVertical); 
        moved = newBottom !== gameState.playerCoords.bottom;
    } else if (direction === 'jump') {
        animateAction('player-figure', 'jumping');
        updateGameText("Você pulou no lugar para se esticar. Agora escolha um novo movimento.");
        setTimeout(() => renderExplorationActions(), 700);
        return;
    }

    if (moved) {
        gameState.playerCoords.left = newLeft;
        gameState.playerCoords.bottom = newBottom;
        
        updatePlayerPosition();
        
        animateAction('player-figure', 'walking'); 
        
        updateGameText(`Você se moveu para a ${direction === 'left' || direction === 'right' ? direction : (direction === 'up' ? 'cima' : 'baixo')}.`);
        
        if (!combatState.active) {
            const roll = getRandomInt(1, 4); 
            if (roll === 4) {
                 const enemyName = getRandomEnemy(gameState.currentPhase);
                 updateGameText(`Você foi encurralado! Um **${enemyName}** te interceptou!`);
                 startCombat(enemyName); 
                 return; 
            }
        }
    } else {
        updateGameText("Você não pode ir mais para essa direção.");
    }
    
    setTimeout(() => renderExplorationActions(), 400); 
}


function exploreArea() {
    if (combatState.active) return; 

    if (triggerRandomQuiz()) {
        return; 
    }
    
    const roll = getRandomInt(1, 100);

    animateAction('player-figure', 'searching'); 
    updateGameText("Você está explorando o caminho com cautela...");

    if (roll <= 50) { 
        const enemyName = getRandomEnemy(gameState.currentPhase);
        updateGameText(`Um **${enemyName}** surge de repente! Prepare-se para o combate!`);
        startCombat(enemyName); 
    } else if (roll <= 80) { 
        const foundItem = findRandomItem();
        
        updateGameText(`Você encontrou um pequeno baú abandonado. Dentro havia uma **${foundItem.name}** ${foundItem.emoji}!`);
        applyItemEffect(foundItem);
    } else { 
        updateGameText("Você explorou cuidadosamente, mas o caminho estava vazio.");
    }
    
    if (!combatState.active && gameState.playerStats.pv_current > 0 && !gameState.quizState.inQuizScreen) {
        setTimeout(() => renderExplorationActions(), 700);
    } 
}

// FUNÇÃO RESTAURADA: Procurar Sala Secreta
function searchSecret() {
    if (combatState.active) return;
    
    if (triggerRandomQuiz()) {
        return; 
    }
    
    const roll = getRandomInt(1, 100);
    
    animateAction('player-figure', 'searching');
    updateGameText("Você está procurando por passagens secretas...");
    
    if (roll <= 30) { 
        const enemyName = getRandomEnemy(gameState.currentPhase);
        updateGameText(`Você tropeça em uma emboscada! Um **${enemyName}** te ataca!`);
        startCombat(enemyName);
    } else if (roll <= 80) { 
        const foundItem = findRandomItem();
        
        updateGameText(`Você encontrou um tesouro escondido! Dentro havia uma **${foundItem.name}** ${foundItem.emoji}!`);
        applyItemEffect(foundItem);
    } else { 
        updateGameText("Você procurou em cada canto e fenda, mas não encontrou nada de valor.");
    }
    
    if (!combatState.active && gameState.playerStats.pv_current > 0 && !gameState.quizState.inQuizScreen) {
        setTimeout(() => renderExplorationActions(), 700);
    }
}


// =======================================================
// LÓGICA DE COMBATE (Com Delay de Perseguição)
// =======================================================

function renderCombatStatus() {
    const gameTextDiv = document.getElementById('game-text');
    if (!combatState.active || !combatState.enemyStats) {
        gameTextDiv.innerHTML = `<p>O que você quer fazer?</p>`;
        return;
    }
    
    const enemyPvMax = combatState.enemyStats.pv;
    const enemyPvCurrent = combatState.enemyStats.pv_current;
    const pvPercent = (enemyPvCurrent / enemyPvMax) * 100;
    
    const enemyStatusHTML = `
        <h3>Enfrentando: ${combatState.enemyName}</h3>
        <div class="bar-container enemy-pv">
            <div class="bar" style="width: ${pvPercent}%;"></div>
            <span>🖤 PV do Inimigo: ${enemyPvCurrent} / ${enemyPvMax}</span>
        </div>
        <p>Ataque: ${combatState.enemyStats.attack} | Defesa: ${combatState.enemyStats.defense}</p>
    `;
    
    gameTextDiv.innerHTML = enemyStatusHTML + gameTextDiv.innerHTML; 
}

function renderCombatActions() {
    const actionButtons = document.getElementById('action-buttons');
    actionButtons.innerHTML = ''; 

    gameState.playerAttacks.forEach(attack => {
        const btn = document.createElement('button');
        btn.textContent = `${attack.icon} ${attack.name} (${attack.cost} MP)`;
        btn.classList.add('rpg-button', 'combat-button');
        btn.addEventListener('click', () => handlePlayerAttack(attack));
        actionButtons.appendChild(btn);
    });

    const jumpBtn = document.createElement('button');
    jumpBtn.textContent = '💨 Pular / Esquivar (Espaço)';
    jumpBtn.classList.add('rpg-button', 'combat-button');
    jumpBtn.addEventListener('click', attemptToJump);
    actionButtons.appendChild(jumpBtn);
    
    const escapeBtn = document.createElement('button');
    escapeBtn.textContent = '🏃‍♂️ Tentar Fugir';
    escapeBtn.classList.add('rpg-button', 'combat-button');
    escapeBtn.addEventListener('click', attemptToEscape);
    actionButtons.appendChild(escapeBtn);

    actionButtons.style.pointerEvents = 'auto'; 
}


function checkAndRemoveExpiredBuffs() {
    if (!gameState.activeBuffs) return;
    
    let buffsRemoved = [];
    
    gameState.activeBuffs = gameState.activeBuffs.filter(buff => {
        
        if (combatState.active) {
            buff.duration--;
        } else {
             return false; 
        }

        if (buff.duration <= 0) {
            buffsRemoved.push(buff.sourceAttack);
            return false;
        }
        return true;
    });

    if (buffsRemoved.length > 0) {
        if (combatState.active) {
            updateGameText("Efeitos de buffs removidos.");
        }
        updatePlayerStatus();
    }
}

// FUNÇÃO ATUALIZADA: Entrada Teatral ("Surgir do Chão")
function startCombat(enemyName) {
    const enemyData = ENEMIES[enemyName]; 
    
    if (!enemyData) {
        console.error(`[SPAWN MANAGER] Erro: Inimigo "${enemyName}" não encontrado na lista ENEMIES.`);
        updateGameText(`Erro ao spawnar inimigo: ${enemyName}. Voltando à exploração.`);
        setTimeout(() => loadPhase(gameState.currentPhase), 1000);
        return;
    }
    
    combatState.active = true;
    combatState.enemyName = enemyName;
    combatState.enemyStats = { 
        ...enemyData, 
        pv_current: enemyData.pv 
    };
    
    if (enemyData.isBoss) {
        gameState.isBossActive = true;
        const finalBossName = PHASES[5]?.finalBossName;
        if (enemyName === finalBossName) {
            updateGameText("🚨 **ALERTA!** VOCÊ ESTÁ ENFRENTANDO O ABOMINÁVEL GUARDIÃO FINAL! ESTA É SUA ÚLTIMA CHANCE!");
        }
    }

    const enemyFigure = document.getElementById('enemy-figure');
    enemyFigure.style.backgroundImage = `url(${enemyData.image})`;
    
    // ANIMAÇÃO TEATRAL: Inicia embaixo da tela e sobe
    enemyFigure.style.left = '80%';
    enemyFigure.style.bottom = '-100px'; // Esconde abaixo da base
    animateAction('enemy-figure', 'emerging'); // Classe emergindo (adicionar no CSS)
    
    setTimeout(() => {
        enemyFigure.style.bottom = '0px'; // Move para a posição padrão
        updateGameText(`Combate iniciado contra: ${enemyName}`);
        animateAction('enemy-figure', 'attacking'); 
        renderCombatStatus();
        renderCombatActions(); 
    }, 500); // Espera a animação inicial
}


function applyDamage(target, damage) {
    if (target === 'enemy' && combatState.active) {
        const currentHP = combatState.enemyStats.pv_current;
        combatState.enemyStats.pv_current = Math.max(0, currentHP - damage);
        
        if (combatState.enemyStats.pv_current <= 0) {
            endCombat('win');
            return true; 
        }
    } else if (target === 'player') {
        const currentHP = gameState.playerStats.pv_current;
        gameState.playerStats.pv_current = Math.max(0, currentHP - damage);
        
        if (gameState.playerStats.pv_current <= 0) {
            endCombat('lose');
            return true;
        }
    }
    return false;
}

// FUNÇÃO ATUALIZADA: Perseguição Visual e Dano
function enemyTurn() {
    if (!combatState.active) return;
    
    const actionButtons = document.getElementById('action-buttons');
    actionButtons.style.pointerEvents = 'none'; // Desabilita ações do jogador
    
    updateGameText(`O inimigo **${combatState.enemyName}** está se preparando para atacar...`);
    
    const enemyFigure = document.getElementById('enemy-figure');
    const playerLeft = gameState.playerCoords.left;

    // 1. Perseguição Visual: Move o inimigo para perto do player
    enemyFigure.style.left = `${playerLeft + 40}%`; 
    
    // Animação de ataque/perseguição
    animateAction('enemy-figure', 'attacking');
    
    setTimeout(() => {
        
        const enemyAttackValue = combatState.enemyStats.attack;
        const playerStats = getPlayerStatsWithBuffs();
        
        let damageToPlayer = Math.max(1, enemyAttackValue - playerStats.defense);
        
        const playerDefeated = applyDamage('player', damageToPlayer);

        // Feedback Visual no jogador (Piscar de Vermelho)
        animateAction('player-figure', 'hit-feedback'); 

        updateGameText(`O inimigo **${combatState.enemyName}** ataca, causando **${damageToPlayer}** de dano!`);
        
        updatePlayerStatus();
        
        if (playerDefeated) {
            return;
        }
        
        setTimeout(() => {
            // Recua o inimigo visualmente para a posição inicial (80%)
            enemyFigure.style.left = '80%';
            
            checkAndRemoveExpiredBuffs();
            renderCombatActions(); 
            actionButtons.style.pointerEvents = 'auto'; // Reabilita ações
        }, 1000); 

    }, combatState.attackDelayMs); // Delay de perseguição: 1200ms
}


function handlePlayerAttack(attack) {
    if (!combatState.active) return;
    const playerStats = getPlayerStatsWithBuffs();
    
    if (playerStats.mp_current < attack.cost) {
        updateGameText(`MP insuficiente para **${attack.name}**! Você perde o turno.`);
        setTimeout(() => enemyTurn(), combatState.attackDelayMs); 
        return;
    }

    gameState.playerStats.mp_current -= attack.cost;
    
    let damageMessage = "";

    if (attack.type === "physical" || attack.type === "magic") {
        
        animateAction('player-figure', 'attacking'); // Animação de ataque/movimento
        
        const attackStat = attack.type === "physical" ? playerStats.attack : playerStats.magic;
        
        let damage = Math.max(1, Math.floor(attackStat * attack.multiplier) - combatState.enemyStats.defense);
        const enemyDefeated = applyDamage('enemy', damage);
        
        // Feedback Visual (Físico/Mágico)
        const hitClass = attack.type === 'magic' ? 'magic-hit' : 'hit-feedback-enemy';
        animateAction('enemy-figure', hitClass); 

        damageMessage = `Você usa **${attack.name}**! Causa **${damage}** de dano no ${combatState.enemyName}.`;
        updateGameText(damageMessage);
        renderCombatStatus();

        if (enemyDefeated) {
            return;
        }

    } else if (attack.type === "buff") {
        animateAction('player-figure', 'magic-cast'); 
        
        const existingBuff = gameState.activeBuffs.find(b => b.targetStat === attack.targetStat && b.sourceAttack === attack.name);

        if (!existingBuff) {
             gameState.activeBuffs.push({
                sourceAttack: attack.name,
                targetStat: attack.targetStat,
                value: attack.value, 
                duration: attack.duration, 
                type: "stat_buff"
            });
            damageMessage = `Você usa **${attack.name}**. ${attack.description}`;
        } else {
             existingBuff.duration = attack.duration;
             damageMessage = `Você usa **${attack.name}** novamente, reforçando o efeito!`;
        }

        updateGameText(damageMessage);
        updatePlayerStatus(); 
        
    } else if (attack.type === "heal") {
        animateAction('player-figure', 'magic-cast'); 
        
        const healValue = attack.value;
        gameState.playerStats.pv_current = Math.min(
            gameState.playerStats.pv_current + healValue,
            gameState.playerStats.pv
        );
        damageMessage = `Você usa **${attack.name}**. Recupera **${healValue} PV**.`;
        updateGameText(damageMessage);
        updatePlayerStatus();
    }
    
    setTimeout(() => enemyTurn(), 1500); 
}

function attemptToJump() {
    if (!combatState.active) return;
    
    animateAction('player-figure', 'jumping');
    
    gameState.activeBuffs.push({
        sourceAttack: "Pulo Esquiva",
        targetStat: "agility",
        value: 10, 
        duration: 1, 
        type: "evasion"
    });
    updatePlayerStatus();
    
    updateGameText("Você salta para trás, aumentando temporariamente sua agilidade! Aguarde o contra-ataque...");
    
    setTimeout(() => enemyTurn(), 1500); 
}

function attemptToEscape() {
    if (!combatState.active) return;
    
    animateAction('player-figure', 'jumping');
    
    const currentAgility = getPlayerStatsWithBuffs().agility;
    const successRate = 40 + (currentAgility * 1.5); 
    const roll = getRandomInt(1, 100);
    
    updateGameText(`Tentativa de Fuga... (Chance: ${successRate.toFixed(0)}% | Rolo: ${roll})`);

    if (roll <= successRate) {
        endCombat('run');
        updateGameText(`Você é rápido! Fuga bem-sucedida!`);
        setTimeout(() => loadPhase(gameState.currentPhase), 1500); 
    } else {
        updateGameText("Falha ao fugir! O monstro te alcança e você é forçado a lutar! Turno do inimigo...");
        setTimeout(() => enemyTurn(), combatState.attackDelayMs); 
    }
}

function endCombat(result) {
    const defeatedEnemyName = combatState.enemyName; 
    const enemyData = ENEMIES[defeatedEnemyName];

    combatState.active = false;
    document.getElementById('enemy-figure').style.backgroundImage = 'none'; 
    combatState.enemyStats = null;
    combatState.enemyName = null;
    
    checkAndRemoveExpiredBuffs(); 
    
    if (result === 'win') {
        let rewardText = "";
        
        if (enemyData.rewardMoney) {
            gameState.money += enemyData.rewardMoney;
            rewardText += ` Recebeu **${enemyData.rewardMoney} Ouro**! `;
        }
        
        let droppedItem = null;
        if (enemyData.dropTable) {
            const dropRoll = getRandomInt(1, 100);
            let totalChance = 0;
            
            for (const [item, chance] of Object.entries(enemyData.dropTable)) {
                totalChance += chance;
                if (dropRoll <= totalChance) {
                    droppedItem = item;
                    break;
                }
            }

            if (droppedItem) {
                addItemToInventory(droppedItem);
                rewardText += ` Dropou: **${droppedItem}**!`;
                
                if (enemyData.isBoss) {
                    const finalBossName = PHASES[5]?.finalBossName;
                    if (defeatedEnemyName === finalBossName) {
                        gameState.isFinalBossDefeated = true; 
                    }
                    gameState.isBossActive = false;
                    gameState.enemyKills = 0; 
                    
                    updateGameText(`🎉 **VITÓRIA!** Você derrotou o Boss: **${defeatedEnemyName}**! ${rewardText} O caminho está livre.`);
                    updatePlayerStatus(); 
                    
                    if (gameState.isFinalBossDefeated) {
                        setTimeout(() => showFinalVictory(), 2000);
                        return;
                    }
                    
                    setTimeout(() => renderExplorationActions(), 1500); 
                    return; 
                }
            }
        }
        
        if (!enemyData.isBoss) {
            gameState.enemyKills++;
        }

        updateGameText(`🎉 **VITÓRIA!** Você derrotou o inimigo: **${defeatedEnemyName}**! ${rewardText} Você pode continuar explorando.`);
        updatePlayerStatus();
        setTimeout(() => loadPhase(gameState.currentPhase), 1500); 
        
    } else if (result === 'lose') {
        showGameOver(); // CHAMA A TELA DE DERROTA VISUAL
    }
}

// NOVO: Função para exibir a tela de Game Over
function showGameOver() {
    changeScreen('quiz-screen'); 

    document.getElementById('quiz-title').textContent = "💔 GAME OVER 💔";
    
    // Caminho assumido para sua imagem de derrota
    const imagePath = 'assets/images/victory/game_over.png'; 
    
    const finalContent = `
        <img src="${imagePath}" alt="Você Perdeu" style="max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 20px;">
        <p style="font-size: 1.2em; color: #e74c3c; margin-top: 10px;">
            Sua aventura chegou ao fim. Tente novamente!
        </p>
    `;
    
    document.getElementById('quiz-question').innerHTML = finalContent;
    document.getElementById('quiz-options').innerHTML = '';
    document.getElementById('quiz-feedback').textContent = '';
    
    const backButton = document.getElementById('quizBackButton');
    backButton.textContent = '↩️ Voltar ao Menu Principal';
    backButton.onclick = () => changeScreen('title-screen');
    backButton.style.display = 'block';
}


function showFinalVictory() {
    changeScreen('quiz-screen'); 
    
    document.getElementById('quiz-title').textContent = ""; 

    // Caminho para o GIF de vitória
    const imagePath = 'assets/images/victory/final_trophy.gif'; 
    
    const finalContent = `
        <img src="${imagePath}" alt="Parabéns! Você Zerou o Jogo!" style="max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 20px;">
    `;
    
    document.getElementById('quiz-question').innerHTML = finalContent;
    document.getElementById('quiz-options').innerHTML = '';
    document.getElementById('quiz-feedback').textContent = '';
    
    const backButton = document.getElementById('quizBackButton');
    backButton.textContent = '▶️ Voltar ao Menu Principal';
    backButton.onclick = () => changeScreen('title-screen');
    backButton.style.display = 'block';
}


// =======================================================
// LÓGICA DO QUIZ (7 Perguntas)
// =======================================================

function renderQuizScreen(question, isFinal = false) {
    gameState.quizState.inQuizScreen = true;
    gameState.quizState.currentQuestion = question.id;
    gameState.quizState.isFinalQuiz = isFinal;
    changeScreen('quiz-screen');
    
    document.getElementById('quiz-title').textContent = isFinal ? "🔮 O Grande Teste da Memória" : "❓ Pergunta Inesperada";
    document.getElementById('quiz-question').textContent = question.question;
    document.getElementById('quiz-feedback').textContent = '';
    
    const optionsDiv = document.getElementById('quiz-options');
    optionsDiv.innerHTML = '';
    
    question.options.forEach((optionText, index) => {
        const btn = document.createElement('button');
        btn.textContent = optionText;
        btn.classList.add('rpg-button', 'combat-button');
        btn.setAttribute('data-answer-index', index);
        btn.onclick = () => checkQuizAnswer(index);
        optionsDiv.appendChild(btn);
    });

    document.getElementById('quizBackButton').style.display = 'none';
}

function checkQuizAnswer(selectedIndex) {
    const questionId = gameState.quizState.currentQuestion;
    const question = QUIZ_QUESTIONS.find(q => q.id === questionId);
    
    if (!question) return;

    const optionsDiv = document.getElementById('quiz-options');
    const feedbackDiv = document.getElementById('quiz-feedback');
    const backButton = document.getElementById('quizBackButton');
    
    Array.from(optionsDiv.children).forEach(btn => {
        btn.disabled = true;
        btn.classList.remove('selected-correct', 'selected-wrong');

        if (parseInt(btn.getAttribute('data-answer-index')) === question.answer) {
             btn.classList.add('selected-correct'); 
        } else if (parseInt(btn.getAttribute('data-answer-index')) === selectedIndex) {
             btn.classList.add('selected-wrong'); 
        }
    });
    
    backButton.style.display = 'block';

    if (selectedIndex === question.answer) {
        feedbackDiv.textContent = `✅ Resposta Correta! Recompensa recebida: +${question.reward.value} ${question.reward.type === 'mp_current' ? 'MP' : 'PV'}!`;
        applyItemEffect(question.reward); 
        
        if (!gameState.quizState.answeredQuestions.includes(questionId)) {
            gameState.quizState.answeredQuestions.push(questionId);
        }
        
        if (gameState.quizState.isFinalQuiz) {
            backButton.textContent = '▶️ Próximo Desafio';
            backButton.onclick = () => startFinalQuiz(true); 
            return;
        }

    } else {
        feedbackDiv.textContent = `❌ Resposta Incorreta. A resposta correta era: ${question.options[question.answer]}.`;
        if (gameState.quizState.isFinalQuiz) {
             feedbackDiv.textContent += ` Tente o desafio novamente.`;
             backButton.textContent = '↩️ Tentar Novamente';
             backButton.onclick = () => startFinalQuiz(true);
        }
    }
    
    updatePlayerStatus();
}

function continueAfterQuiz() {
    gameState.quizState.inQuizScreen = false;
    gameState.quizState.currentQuestion = null;
    gameState.quizState.isFinalQuiz = false;
    loadPhase(gameState.currentPhase);
}


function triggerRandomQuiz() {
    if (gameState.currentPhase >= 5 || combatState.active) return false;
    
    if (getRandomInt(1, 100) > 20) return false; 
    
    const unansweredQuestions = QUIZ_QUESTIONS.filter(q => !gameState.quizState.answeredQuestions.includes(q.id));

    if (unansweredQuestions.length > 0) {
        const randomQuestion = unansweredQuestions[getRandomInt(0, unansweredQuestions.length - 1)];
        updateGameText(`Você sente uma conexão com a história antiga... Um desafio de memória surge!`);
        setTimeout(() => renderQuizScreen(randomQuestion, false), 1500); 
        return true;
    }
    
    return false;
}

function startFinalQuiz(isContinuing = false) {
    
    if (isContinuing && !gameState.quizState.isFinalQuiz) {
        continueAfterQuiz();
        return;
    }

    const remainingQuestions = QUIZ_QUESTIONS.filter(q => !gameState.quizState.answeredQuestions.includes(q.id));
    
    document.getElementById('quizBackButton').style.display = 'none';

    if (remainingQuestions.length === 0) {
        // Quiz 100% completo! Leva para o Boss Final
        gameState.quizState.inQuizScreen = false;
        
        updateGameText(`As perguntas foram respondidas! O Abominável Guardião Final aguarda. Você deve enfrentá-lo!`);
        
        setTimeout(() => {
            startCombat(PHASES[5].finalBossName); 
        }, 2000);
        
        return;
    }
    
    const nextQuestion = remainingQuestions[getRandomInt(0, remainingQuestions.length - 1)];
    renderQuizScreen(nextQuestion, true);
}


// =======================================================
// LÓGICA DA LOJA 
// =======================================================

function openShop() {
    changeScreen('shop-screen');
    renderShopItems();
}

function renderShopItems() {
    document.getElementById('shop-player-money').textContent = `Seu Ouro: ${gameState.money} 💰`;
    document.getElementById('shop-feedback').textContent = '';
    const shopList = document.getElementById('shop-items-list');
    shopList.innerHTML = '';
    
    let html = `
        <table class="shop-table">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Efeito</th>
                    <th>Preço</th>
                    <th>Ação</th>
                </tr>
            </thead>
            <tbody>
    `;

    Object.entries(SHOP_ITEMS).forEach(([itemName, item]) => {
        if (item.phaseUnlock && item.phaseUnlock > gameState.currentPhase) {
            return; 
        }

        let isEquipment = item.type === 'equipment';
        let isConsumable = item.type === 'consumable';
        let isDisabled = gameState.money < item.cost;
        let effectText = isConsumable 
            ? `Recupera ${item.value} ${item.effect.includes('pv') ? 'PV' : 'MP'}` 
            : `+${item.value} ${item.stat.toUpperCase()}`;
        
        let inventoryCheck = '';
        if (isEquipment && gameState.inventory.includes(itemName)) {
             isDisabled = true;
             inventoryCheck = " (JÁ POSSUI)";
        }

        html += `
            <tr>
                <td>${item.emoji} **${itemName}** (${isEquipment ? 'EQP' : 'CONS'})</td>
                <td>${effectText}${inventoryCheck}</td>
                <td>${item.cost} 💰</td>
                <td>
                    <button class="rpg-button shop-buy-btn" onclick="buyItem('${itemName}')" ${isDisabled ? 'disabled' : ''}>
                        COMPRAR
                    </button>
                </td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;
    shopList.innerHTML = html;
}

function buyItem(itemName) {
    const item = SHOP_ITEMS[itemName];

    if (item.cost > gameState.money) {
        document.getElementById('shop-feedback').textContent = '⚠️ Ouro insuficiente!';
        return;
    }
    
    if (item.type === 'equipment' && gameState.inventory.includes(itemName)) {
        document.getElementById('shop-feedback').textContent = '⚠️ Você já possui este equipamento!';
        return;
    }

    gameState.money -= item.cost;
    
    if (item.type === 'equipment') {
        addItemToInventory(itemName); 
        document.getElementById('shop-feedback').textContent = `✅ ${itemName} comprado e equipado! Status melhorados!`;
        updatePlayerStatus();
    } else if (item.type === 'consumable') {
        applyItemEffect(item, true); 
        document.getElementById('shop-feedback').textContent = `✅ ${itemName} comprado e consumido! PV/MP recuperados!`;
    }
    
    console.log(`[SHOP] Compra de ${itemName}. Novo Saldo: ${gameState.money} Ouro.`);

    renderShopItems(); 
    saveGame();
}

// =======================================================
// LÓGICA DE ITENS E INVENTÁRIO (Com Interatividade)
// =======================================================

function applyItemEffect(item, isConsumption = false) {
    
    if (item.effect === 'pv_current' || item.effect === 'mp_current') {
        gameState.playerStats[item.effect] = Math.min(
            gameState.playerStats[item.effect] + item.value, 
            gameState.playerStats[item.effect.replace('_current', '')] 
        );
        gameState.playerStats[item.effect] = Math.max(0, gameState.playerStats[item.effect]); 
    } 
    
    if (item.effect.includes('_temp') && !isConsumption) {
        const stat = item.effect.replace('_temp', '');
        gameState.activeBuffs.push({
            sourceAttack: item.name,
            targetStat: stat,
            value: item.value, 
            duration: 3, 
            type: "item_buff"
        });
    }
    
    if (!isConsumption && item.type !== 'bad' && !SHOP_ITEMS[item.name]) { 
        gameState.inventory.push(item.name); 
    }
    
    updatePlayerStatus(); 
    saveGame();
}


function addItemToInventory(itemName) {
    const shopItem = SHOP_ITEMS[itemName];
    
    if (shopItem && shopItem.type === 'consumível') {
        console.log(`Item de loja consumível comprado: ${itemName}. Não estocado.`);
    } else {
        gameState.inventory.push(itemName);
    }
    updatePlayerStatus(); 
    saveGame();
}


function useItem(itemName) {
    const itemToUse = RANDOM_ITEMS.find(i => i.name === itemName);
    
    if (!itemToUse || itemToUse.type === 'bad') {
        updateGameText(`Item **${itemName}** não pode ser usado.`);
        setTimeout(() => showInventory(), 500);
        return;
    }
    
    applyItemEffect(itemToUse, true); 
    
    const index = gameState.inventory.indexOf(itemName);
    if (index > -1) {
        gameState.inventory.splice(index, 1);
    }

    updateGameText(`Você usou **${itemName}**! Efeitos aplicados.`);
    
    setTimeout(() => {
        showInventory();
    }, 1000);
}


function showInventory() {
    changeScreen('game-play'); 
    
    let inventoryListHTML = '<li>Inventário Vazio.</li>';
    
    if (gameState.inventory.length > 0) {
        inventoryListHTML = gameState.inventory.map(item => {
            const isConsumable = RANDOM_ITEMS.some(i => i.name === item && i.type === 'good');
            const isEquipment = SHOP_ITEMS[item]?.type === 'equipment'; 
            
            let actionButton = '';
            let itemType = '';

            if (isConsumable) {
                actionButton = `<button class="rpg-button use-item-btn" onclick="useItem('${item}')">USAR</button>`;
                itemType = '(Consumível de Drop)';
            } else if (isEquipment) {
                 itemType = '(Equipamento de Loja)';
            } else if (item.includes('Anel')) {
                 itemType = '(Artefato de Fase)';
            }

            return `<li>${item} ${itemType} ${actionButton}</li>`;
        }).join('');
    }

    const inventoryText = `
        <h3>🎒 Inventário de ${gameState.playerName}</h3>
        <ul>${inventoryListHTML}</ul>
        <p>Você tem **${gameState.money} Ouro**.</p>
    `;
    updateGameText(inventoryText);
    
    const actionButtons = document.getElementById('action-buttons');
    actionButtons.innerHTML = `
        <button onclick="loadPhase(gameState.currentPhase)" class="rpg-button menu-button">↩️ Voltar à Exploração</button>
        <button onclick="saveGame()" class="rpg-button">💾 Salvar Jogo</button>
    `;
}


// =======================================================
// CONTROLE DE TELAS, FLUXO PRINCIPAL E ANIMAÇÕES
// =======================================================

function animateAction(elementId, className) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.classList.add(className);
    
    setTimeout(() => {
        element.classList.remove(className);
    }, 700); 
}

function changeScreen(targetId) {
    document.querySelectorAll('.game-screen').forEach(screen => {
        screen.classList.add('hidden-screen');
        screen.classList.remove('active-screen');
    });
    
    const targetScreen = document.getElementById(targetId);
    if (targetScreen) {
        targetScreen.classList.remove('hidden-screen');
        targetScreen.classList.add('active-screen');
    }
}

function updateGameText(text) {
    const gameTextDiv = document.getElementById('game-text');
    gameTextDiv.innerHTML = `<p>${text}</p>`;
}

function saveGame() {
    if (!gameState.saveSlot) {
        console.error("Erro: saveSlot não está definido. Impossível salvar.");
        return;
    }
    
    const dataToSave = JSON.stringify({
        playerName: gameState.playerName,
        playerClass: gameState.playerClass,
        playerStats: gameState.playerStats,
        inventory: gameState.inventory,
        currentPhase: gameState.currentPhase,
        hasRing: gameState.hasRing,
        saveSlot: gameState.saveSlot,
        playerAttacks: gameState.playerAttacks,
        activeBuffs: gameState.activeBuffs,
        playerCoords: gameState.playerCoords,
        money: gameState.money, 
        enemyKills: gameState.enemyKills, 
        isBossActive: gameState.isBossActive, 
        isFinalBossDefeated: gameState.isFinalBossDefeated,
        quizState: gameState.quizState
    });
    
    localStorage.setItem(SAVE_SLOT_KEY + gameState.saveSlot, dataToSave);
    showSaveFeedback();
}

function loadSlot(slotNum) {
    const data = localStorage.getItem(SAVE_SLOT_KEY + slotNum);
    if (data) {
        try {
            return JSON.parse(data);
        } catch (e) {
            console.error("Erro ao parsear dados salvos:", e);
            localStorage.removeItem(SAVE_SLOT_KEY + slotNum); 
            return null;
        }
    }
    return null;
}

function renderLoadScreen() {
    changeScreen('load-screen');
    const slotsList = document.getElementById('save-slots-list');
    slotsList.innerHTML = ''; 

    for (let i = 1; i <= MAX_SAVE_SLOTS; i++) {
        const slotData = loadSlot(i);
        const slotDiv = document.createElement('div');
        slotDiv.classList.add('save-slot');
        
        const slotAction = slotData 
            ? `<div>
                <button class="rpg-button" onclick="continueGame(${i})">CONTINUAR</button>
                <button class="delete-button rpg-button" onclick="deleteSlot(${i})">EXCLUIR</button>
               </div>`
            : `<button class="rpg-button" onclick="startNewGameSlot(${i})">NOVO JOGO AQUI</button>`;

        slotDiv.innerHTML = `
            <h4>Slot ${i}: ${slotData ? slotData.playerName + ' (' + slotData.playerClass + ')' : 'Slot Vazio'}</h4>
            <p>${slotData ? 'Progresso: Fase ' + slotData.currentPhase + ' / 5' : ''}</p>
            ${slotAction}
        `;
        slotsList.appendChild(slotDiv);
    }
}

function continueGame(slotNum) {
    const data = loadSlot(slotNum);
    if (data) {
        Object.assign(gameState, data);
        
        if (!gameState.quizState) {
            gameState.quizState = { currentQuestion: null, answeredQuestions: [], inQuizScreen: false, isFinalQuiz: false };
        }
        gameState.money = gameState.money || 0;
        gameState.enemyKills = gameState.enemyKills || 0;
        gameState.isBossActive = gameState.isBossActive || false;
        gameState.isFinalBossDefeated = gameState.isFinalBossDefeated || false;
        gameState.playerCoords = gameState.playerCoords || { left: 10, bottom: 0 };


        if (gameState.currentPhase === 5) {
             loadPhase(5);
        } else {
             loadPhase(gameState.currentPhase); 
        }
    }
}

function startGame() {
    const playerNameInput = document.getElementById('playerName');
    const name = playerNameInput.value.trim();
    
    if (!name || !selectedClass) {
        alert("Por favor, escolha uma classe e insira um nome para começar!");
        return;
    }

    createPlayer(name, selectedClass, gameState.saveSlot); 
    saveGame(); 
    loadPhase(gameState.currentPhase); 
}

function loadPhase(phaseNum) {
    gameState.currentPhase = phaseNum;
    changeScreen('game-play');
    
    const phase = PHASES[phaseNum];
    if (!phase) {
        document.getElementById('game-text').innerHTML = "<h1>PARABÉNS! Você Venceu o Jogo!</h1>";
        document.getElementById('action-buttons').innerHTML = `<button class="rpg-button menu-button" onclick="changeScreen('title-screen')">Voltar ao Menu Principal</button>`;
        return;
    }

    updatePlayerStatus();
    updatePlayerPosition(); 
    
    const scenarioDiv = document.getElementById('scenario-image');
    scenarioDiv.style.backgroundImage = `url(${phase.scenarioImage})`; 
    
    checkAndRemoveExpiredBuffs();

    if (phase.type === 'quiz_final') {
        updateGameText(phase.introText);
        setTimeout(() => startFinalQuiz(), 2000);
        return;
    }

    if (!combatState.active && !gameState.quizState.inQuizScreen) {
        const gameTextDiv = document.getElementById('game-text');
        
        gameTextDiv.innerHTML = `
            <h3>Fase ${phaseNum}: ${phase.name}</h3>
            <p>${phase.introText}</p>
            <p>O que você quer fazer?</p>
        `;
        
        renderExplorationActions(); 
    } else {
        renderCombatStatus();
        renderCombatActions();
    }
    
    saveGame();
}

function showSaveFeedback() {
    const feedbackDiv = document.getElementById('save-feedback');
    if (!feedbackDiv) return; 
    
    feedbackDiv.classList.remove('hidden-feedback');
    feedbackDiv.classList.add('show-feedback');
    
    setTimeout(() => {
        feedbackDiv.classList.remove('show-feedback');
        feedbackDiv.classList.add('hidden-feedback');
    }, 2000); 
}

function deleteSlot(slotNum) {
    if (confirm(`Tem certeza que deseja excluir o jogo salvo no Slot ${slotNum}?`)) {
        localStorage.removeItem(SAVE_SLOT_KEY + slotNum);
        renderLoadScreen(); 
    }
}

function renderClassSelection() {
    const classSelectionDiv = document.getElementById('class-selection');
    classSelectionDiv.innerHTML = ''; 
    
    Object.keys(CLASSES).forEach(className => {
        const button = document.createElement('button');
        button.textContent = className;
        button.setAttribute('data-class', className);
        button.classList.add('class-button'); 
        
        button.addEventListener('click', () => selectClass(className));
        
        classSelectionDiv.appendChild(button);
    });
}

function selectClass(className) {
    selectedClass = className;
    const details = CLASSES[className];
    const detailsDiv = document.getElementById('class-details');
    const startGameButton = document.getElementById('startGameButton');
    
    const statsList = Object.entries(details.baseStats).map(([key, value]) => 
        `<li><strong>${key.toUpperCase()}</strong>: ${value}</li>`
    ).join('');
    
    const attackList = details.attacks && details.attacks.length > 0 ? details.attacks.map(attack => 
        `<li>${attack.icon} <strong>${attack.name}</strong>: ${attack.description}</li>`
    ).join('') : '<li>Sem ataques iniciais definidos.</li>';


    detailsDiv.innerHTML = `
        <img src="${details.image}" alt="${className}" class="class-visual">
        <div>
            <h3>${className}</h3>
            <p><strong>Descrição:</strong> ${details.description}</p>
            <h4>Atributos Iniciais:</h4>
            <ul>${statsList}</ul>
            <h4>Ataques Iniciais:</h4>
            <ul>${attackList}</ul>
        </div>
    `;

    document.querySelectorAll('.class-button').forEach(btn => btn.classList.remove('selected'));
    document.querySelector(`[data-class="${className}"]`).classList.add('selected');

    if (document.getElementById('playerName').value.trim() !== '' && selectedClass) {
        startGameButton.disabled = false;
    } else {
        startGameButton.disabled = true;
    }
}

function startNewGameSlot(slotNum) {
    gameState = {
        playerName: "", playerClass: "", playerStats: { pv_current: 0, mp_current: 0, pv: 0, mp: 0, attack: 0, magic: 0, defense: 0, agility: 0 }, 
        inventory: [], currentPhase: 1, 
        hasRing: false, saveSlot: slotNum, isMusicPlaying: gameState.isMusicPlaying,
        playerAttacks: [], activeBuffs: [], playerCoords: { left: 10, bottom: 0 },
        money: 0, enemyKills: 0, isBossActive: false, isFinalBossDefeated: false,
        quizState: { currentQuestion: null, answeredQuestions: [], inQuizScreen: false, isFinalQuiz: false }
    };
    selectedClass = null; 
    
    changeScreen('character-creation');
    renderClassSelection(); 
    document.getElementById('startGameButton').disabled = true; 
    document.getElementById('playerName').value = ''; 
    document.getElementById('class-details').innerHTML = '<p>Selecione uma classe acima para ver os atributos iniciais e o visual do personagem.</p>';
}


function toggleMusic() {
    const bgmPlayer = document.querySelector('audio');
    const toggleButton = document.getElementById('toggle-music');
    
    if (gameState.isMusicPlaying) {
        bgmPlayer.pause();
        toggleButton.textContent = '🔇 Música OFF';
    } else {
        bgmPlayer.play().catch(error => {
             console.log("Autoplay bloqueado. O usuário precisa interagir com a página.");
        });
        toggleButton.textContent = '🔊 Música ON';
    }
    gameState.isMusicPlaying = !gameState.isMusicPlaying;
}

document.addEventListener('DOMContentLoaded', () => {
    const bgmPlayer = document.querySelector('audio');
    if (bgmPlayer) bgmPlayer.volume = 0.5; 
    
    document.getElementById('toggle-music').addEventListener('click', toggleMusic);
    document.getElementById('newGameButton').addEventListener('click', renderLoadScreen);
    document.getElementById('loadGameButton').addEventListener('click', renderLoadScreen);
    
    document.getElementById('controlsButton').addEventListener('click', () => changeScreen('controls-screen'));
    document.getElementById('backFromControlsButton').addEventListener('click', () => changeScreen('title-screen'));
    document.getElementById('backToTitleButton').addEventListener('click', () => changeScreen('title-screen'));
    
    const startGameButton = document.getElementById('startGameButton');
    const playerNameInput = document.getElementById('playerName');

    if (startGameButton) {
        startGameButton.addEventListener('click', startGame);
    } 

    if (playerNameInput && startGameButton) {
        playerNameInput.addEventListener('input', () => {
            if (playerNameInput.value.trim() !== '' && selectedClass) {
                startGameButton.disabled = false;
            } else {
                startGameButton.disabled = true;
            }
        });
    }

    document.getElementById('quizBackButton').addEventListener('click', continueAfterQuiz);

    // INPUT DE TECLADO PARA MOVIMENTO FLUIDO (W, A, S, D, Setas, Espaço)
    document.addEventListener('keydown', (event) => {
        if (document.getElementById('game-play').classList.contains('active-screen')) {
            
            console.log(`[INPUT] Tecla pressionada: ${event.key}`); 
            const key = event.key.toLowerCase();
            
            // Lógica de Movimento: Permite mover o personagem no mapa
            if (!combatState.active || (combatState.active && document.getElementById('action-buttons').style.pointerEvents !== 'none')) {
                switch (key) {
                    case 'arrowleft': case 'a': movePlayer('left'); break;
                    case 'arrowright': case 'd': movePlayer('right'); break;
                    case 'arrowup': case 'w': movePlayer('up'); break;
                    case 'arrowdown': case 's': movePlayer('down'); break;
                    case ' ': 
                        event.preventDefault(); 
                        movePlayer('jump'); 
                        break;
                }
            } 
            
            // Lógica de Ação em Combate (Pulo/Esquiva)
            if (key === ' ' && combatState.active && document.getElementById('action-buttons').style.pointerEvents === 'auto') {
                event.preventDefault(); 
                attemptToJump();
            }
        }
    });

    changeScreen('title-screen');
});