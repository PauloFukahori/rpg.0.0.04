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
    playerCoords: { left: 10, bottom: 0 }, // NOVO: Adicionar 'bottom' para controle vertical
    playerDirection: 'right',
    money: 0,
    enemyKills: 0,
    isBossActive: false,
    isFinalBossDefeated: false,
    // NOVO: Estado do Quiz
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


// =======================================================
// DADOS DE CLASSE, FASES, INIMIGOS, ITENS, LOJA E QUIZ
// =======================================================
// NOTA: Todos esses dados agora são carregados dos módulos externos:
// - CLASSES vem de classes.js
// - ENEMIES vem de mobs.js
// - PHASES vem de maps.js
// - RANDOM_ITEMS, QUIZ_QUESTIONS, SHOP_ITEMS vem de items.js

// [REMOVER AS DEFINIÇÕES DUPLICADAS ABAIXO - mantidas temporariamente]

const ENEMIES_OLD = {
    // Inimigos Comuns - Fase 1 (Mais Fracos)
    'Morcego Flamejante': { pv: 30, attack: 8, defense: 3, isBoss: false, rewardMoney: 10, dropTable: { 'Poção de Cura': 30, 'Amuleto da Sorte (AGI+)': 5 }, image: 'assets/images/enemies/morcego.png' },
    'Verme de Lava': { pv: 40, attack: 10, defense: 4, isBoss: false, rewardMoney: 15, dropTable: { 'Poção de Mana': 20, 'Amuleto da Sorte (AGI+)': 10 }, image: 'assets/images/enemies/verme.png' },
    // Inimigos Fase 2
    'Sereia Gélida': { pv: 80, attack: 15, defense: 8, isBoss: false, rewardMoney: 20, dropTable: { 'Poção de Cura': 25, 'Poção de Mana': 25 }, image: 'assets/images/enemies/sereia.png' },
    'Piranha Voraz': { pv: 65, attack: 14, defense: 6, isBoss: false, rewardMoney: 25, dropTable: { 'Amuleto da Sorte (AGI+)': 15 }, image: 'assets/images/enemies/piranha.png' },
    // Inimigos Fase 3
    'Golem de Cristal': { pv: 120, attack: 18, defense: 14, isBoss: false, rewardMoney: 30, dropTable: { 'Escudo de Pedra (DEF+)': 10 }, image: 'assets/images/enemies/golem-cristal.png' },
    'Gárgula de Pedra': { pv: 90, attack: 16, defense: 10, isBoss: false, rewardMoney: 35, dropTable: { 'Capa de MP (MP+)': 10 }, image: 'assets/images/enemies/gargula.png' },
    // Inimigos Fase 4
    'Harpia Selvagem': { pv: 110, attack: 20, defense: 8, isBoss: false, rewardMoney: 40, dropTable: { 'Botas Rápidas (AGI+)': 10 }, image: 'assets/images/enemies/harpia.png' },
    'Elemental do Ar': { pv: 140, attack: 24, defense: 10, isBoss: false, rewardMoney: 45, dropTable: { 'Cajado de Fogo (MAG+)': 10 }, image: 'assets/images/enemies/elemental-ar.png' },
    
    // Bosses Únicos
    'Dragão Flamejante': { pv: 200, attack: 25, defense: 15, isBoss: true, rewardMoney: 100, dropTable: { 'Anel de Fogo': 100 }, image: 'assets/images/enemies/dragao-fantasma.png' },
    'Serpente Gélida': { pv: 250, attack: 30, defense: 18, isBoss: true, rewardMoney: 150, dropTable: { 'Anel de Água': 100 }, image: 'assets/images/enemies/sereia.png' },
    'Guardião de Cristal': { pv: 300, attack: 35, defense: 25, isBoss: true, rewardMoney: 200, dropTable: { 'Anel de Rocha': 100 }, image: 'assets/images/enemies/golem-cristal.png' },
    'Senhor dos Ventos': { pv: 350, attack: 40, defense: 20, isBoss: true, rewardMoney: 250, dropTable: { 'Anel de Vento': 100 }, image: 'assets/images/enemies/elemental-ar.png' },

    // Boss Final - Extremamente Poderoso
    'O Abominável Guardião Final': { pv: 500, attack: 45, defense: 30, isBoss: true, rewardMoney: 1000, dropTable: { 'Anel Completo dos Quatro Reinos': 100 }, image: 'assets/images/enemies/dragao-fantasma.png' }
};

const PHASES_OLD = {
    1: {
        name: "Reino da Chama (Fogo)",
        scenarioImage: "assets/images/scenarios/scenario_fire.gif",
        introText: "Você emerge em uma terra de cinzas e magma. Morcegos flamejantes e vermes de lava te aguardam!",
        enemies: ['Morcego Flamejante', 'Verme de Lava'],
        bossName: 'Dragão Flamejante',
        killsToBoss: 5,
    },
    2: {
        name: "Reino da Tundra (Água)",
        scenarioImage: "assets/images/scenarios/scenario_water.jpg",
        introText: "As ondas geladas da Tundra testarão sua agilidade. Cuidado com as criaturas marinhas!",
        enemies: ['Sereia Gélida', 'Piranha Voraz'],
        bossName: 'Serpente Gélida',
        killsToBoss: 7,
    },
    3: {
        name: "Reino da Rocha (Terra)",
        scenarioImage: "assets/images/scenarios/scenario_earth.jpg",
        introText: "Profundezas escuras, cristalinas e cheias de armadilhas. Golems e gárgulas guardam os segredos!",
        enemies: ['Golem de Cristal', 'Gárgula de Pedra'],
        bossName: 'Guardião de Cristal',
        killsToBoss: 8,
    },
    4: {
        name: "Reino do Vento (Ar)",
        scenarioImage: "assets/images/scenarios/scenario_air.jpg",
        introText: "O último reino flutua nas nuvens, guardado por harpias selvagens e elementais do ar!",
        enemies: ['Harpia Selvagem', 'Elemental do Ar'],
        bossName: 'Senhor dos Ventos',
        killsToBoss: 10,
    },
    5: { 
        name: "O Desafio da Memória e a Batalha Final",
        scenarioImage: "assets/images/scenarios/scenario_final.jpg",
        introText: "Para forjar o Anel Completo, você deve provar que conhece a história dos Quatro Reinos.",
        type: 'quiz_final',
        finalBossName: 'O Abominável Guardião Final'
    }
};

const RANDOM_ITEMS_OLD = [
    { name: 'Poção de Cura', type: 'good', effect: 'pv_current', value: 30, chance: 35, emoji: '❤️' },
    { name: 'Poção de Mana', type: 'good', effect: 'mp_current', value: 20, chance: 30, emoji: '✨' },
    { name: 'Amuleto da Sorte (AGI+)', type: 'good', effect: 'agility_temp', value: 5, chance: 10, emoji: '🍀' },
    { name: 'Erva Daninha Venenosa', type: 'bad', effect: 'pv_current', value: -15, chance: 15, emoji: '🤢' },
    { name: 'Espinhos Ferrugentos (DEF-)', type: 'bad', effect: 'defense_temp', value: -3, chance: 10, emoji: '⚙️' },
];

const QUIZ_QUESTIONS_OLD = [
    {
        id: 1,
        question: "Qual o nome do Reino inicial (Fase 1)?",
        options: ["Reino da Água", "Reino da Chama", "Reino da Rocha", "Reino do Vento"],
        answer: 1, 
        reward: { type: 'mp_current', value: 30 },
        hint: "O primeiro Anel que você busca é o Anel de Fogo."
    },
    {
        id: 2,
        question: "Qual estatística o Ladino das Ondas possui mais alta?",
        options: ["PV", "Defesa", "Agilidade", "Magia"],
        answer: 2, 
        reward: { type: 'pv_current', value: 30 },
        hint: "Ele é rápido e furtivo."
    },
    {
        id: 3,
        question: "Qual é o efeito do 'Grito de Guerra' do Guerreiro do Leão?",
        options: ["Aumenta Ataque", "Aumenta Defesa", "Cura PV", "Restaura MP"],
        answer: 1, 
        reward: { type: 'mp_current', value: 15 },
        hint: "É uma habilidade defensiva de buff."
    },
    {
        id: 4,
        question: "Qual é o nome do chefe da Fase 5 (originalmente)?",
        options: ["Golem de Pedra", "Harpias", "O Criador de Anéis", "Slime de Fogo"],
        answer: 2, 
        reward: { type: 'pv_current', value: 50 },
        hint: "É quem forja o Anel."
    }
];

// NOVO: Itens de Loja e Drops (Equipamentos/Upgrades)
const SHOP_ITEMS_OLD = {
    'Poção Forte de Cura': { type: 'consumable', effect: 'pv_current', value: 50, cost: 50, emoji: '❤️' },
    'Poção Forte de Mana': { type: 'consumable', effect: 'mp_current', value: 40, cost: 40, emoji: '✨' },
    'Espada do Reino (+5 ATK)': { type: 'equipment', stat: 'attack', value: 5, cost: 150, emoji: '⚔️' },
    'Manto da Sabedoria (+5 MAG)': { type: 'equipment', stat: 'magic', value: 5, cost: 150, emoji: '🔮' },
    'Armadura Reforçada (+5 DEF)': { type: 'equipment', stat: 'defense', value: 5, cost: 150, emoji: '🛡️' },
    'Botas Leves (+5 AGI)': { type: 'equipment', stat: 'agility', value: 5, cost: 150, emoji: '💨' },
    'Essência de Fogo (+10 ATK)': { type: 'equipment', stat: 'attack', value: 10, cost: 300, phaseUnlock: 1, emoji: '🔥' },
    'Amuleto Aquático (+10 AGI)': { type: 'equipment', stat: 'agility', value: 10, cost: 300, phaseUnlock: 2, emoji: '🌊' },
    
    // ITENS LENDÁRIOS - Fortalecimento Máximo
    'Foco do Leão (+20 ATK)': { type: 'equipment', stat: 'attack', value: 20, cost: 800, phaseUnlock: 3, emoji: '🦁' },
    'Grimório Dracônico (+20 MAG)': { type: 'equipment', stat: 'magic', value: 20, cost: 800, phaseUnlock: 3, emoji: '🐉' },
    'Couraça dos Quatro Reinos (+15 DEF)': { type: 'equipment', stat: 'defense', value: 15, cost: 700, phaseUnlock: 4, emoji: '⛨️' },
    'Botas do Vento Divino (+15 AGI)': { type: 'equipment', stat: 'agility', value: 15, cost: 700, phaseUnlock: 4, emoji: '🌪️' },
};


// =======================================================
// FUNÇÕES UTILITÁRIAS
// =======================================================

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// LÓGICA DE SPAWN - Checa kills para invocar Boss
function getRandomEnemy(phaseNum) {
    const phase = PHASES[phaseNum] || PHASES[1];
    
    if (gameState.isBossActive) return combatState.enemyName; 
    
    const bossName = phase.bossName;
    const killsNeeded = phase.killsToBoss || 999; 
    const bossDropItem = ENEMIES[bossName]?.dropTable[bossName];
    
    console.log(`[SPAWN MANAGER] Fase ${phaseNum}. Kills: ${gameState.enemyKills}/${killsNeeded}. Boss Dead: ${gameState.inventory.includes(bossDropItem)}`);

    if (gameState.enemyKills >= killsNeeded && !gameState.inventory.includes(bossDropItem)) {
        console.log(`[SPAWN MANAGER] Boss da Fase ${phaseNum} (${bossName}) ativado!`); 
        gameState.isBossActive = true; 
        return bossName;
    }

    const enemies = phase.enemies;
    const enemyName = enemies[getRandomInt(0, enemies.length - 1)];
    
    console.log(`[SPAWN MANAGER] Inimigo Comum Spawnado: ${enemyName}`); 
    return enemyName;
}

// FUNÇÃO ORIGINAL REINCORPORADA
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
    gameState.currentPhase = 1;
    gameState.hasRing = false;
    gameState.saveSlot = slotNum;
    gameState.playerAttacks = classData.attacks;
    gameState.activeBuffs = [];
    gameState.playerCoords = { left: 10, bottom: 0 }; // NOVO
    gameState.playerDirection = 'right';
    gameState.money = 0;
    gameState.enemyKills = 0;
    gameState.isBossActive = false;
    gameState.isFinalBossDefeated = false;
    gameState.quizState = { // Reinicializa o estado do quiz
        currentQuestion: null, 
        answeredQuestions: [], 
        inQuizScreen: false,
        isFinalQuiz: false
    };
}

function getPlayerStatsWithBuffs() {
    let stats = { ...gameState.playerStats };
    
    // Adiciona buffs temporários (combate/drops)
    gameState.activeBuffs.forEach(buff => {
        if (['attack', 'magic', 'defense', 'agility'].includes(buff.targetStat)) {
            stats[buff.targetStat] += buff.value;
        }
    });

    // Adiciona buffs permanentes (equipamentos da loja/drops)
    gameState.inventory.forEach(itemName => {
        const item = SHOP_ITEMS[itemName];
        if (item && item.type === 'equipment') {
            stats[item.stat] += item.value;
        }
        // Nota: Itens de drop como 'Anel de Fogo' não dão stats diretos, apenas marcam o progresso
    });


    return stats;
}

function updatePlayerPosition() {
    const playerFigure = document.getElementById('player-figure');
    if (playerFigure) {
        playerFigure.style.left = `${gameState.playerCoords.left}%`;
        playerFigure.style.bottom = `${gameState.playerCoords.bottom}px`;
        
        // Atualizar direção do sprite
        if (gameState.playerDirection === 'left') {
            playerFigure.style.transform = 'scaleX(-1)';
            playerFigure.style.setProperty('--player-direction', 'scaleX(-1)');
        } else {
            playerFigure.style.transform = 'scaleX(1)';
            playerFigure.style.setProperty('--player-direction', 'scaleX(1)');
        }
    }
    
    // Atualizar mini-mapa
    const miniPlayer = document.getElementById('mini-player');
    if (miniPlayer) {
        const miniX = (gameState.playerCoords.left / 75) * 72; // Escala para 80px do mini-mapa
        const miniY = (gameState.playerCoords.bottom / 100) * 72;
        miniPlayer.style.left = `${miniX}px`;
        miniPlayer.style.bottom = `${miniY}px`;
    }
}

function updatePlayerStatus() {
    const statusDiv = document.getElementById('player-status');
    if (!statusDiv) return;

    // Garante que o cálculo de stats inclua equipamentos ANTES de mostrar na tela
    const currentStats = getPlayerStatsWithBuffs(); 
    
    const statsList = Object.entries(currentStats).map(([key, value]) => {
        if (['pv', 'mp', 'pv_current', 'mp_current'].includes(key)) return ''; 

        // Checa se há algum buff (temporário) ativo para o stat
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
    const classImage = CLASSES[gameState.playerClass]?.image || 'assets/images/placeholder.png';
    playerFigure.style.backgroundImage = `url('${classImage}')`;
}

// =======================================================
// LÓGICA DE MOVIMENTO NO MAPA (Exploração)
// =======================================================

function renderExplorationActions() {
    const actionButtons = document.getElementById('action-buttons');
    const currentPhaseData = PHASES[gameState.currentPhase];
    
    const bossName = currentPhaseData?.bossName;
    const bossDropItem = bossName ? ENEMIES[bossName]?.dropTable[bossName] : null;
    // Se não há boss definido para a fase (ex: Fase 5 Quiz), bossDefeated é true
    const bossDefeated = bossDropItem ? gameState.inventory.includes(bossDropItem) : true; 

    actionButtons.innerHTML = `
        <button onclick="movePlayer('left')" class="rpg-button move-button">⬅️ Mover Esquerda (A)</button>
        <button onclick="movePlayer('up')" class="rpg-button move-button">⬆️ Mover Cima (W)</button>
        <button onclick="movePlayer('right')" class="rpg-button move-button">➡️ Mover Direita (D)</button>
        <button onclick="movePlayer('down')" class="rpg-button move-button">⬇️ Mover Baixo (S)</button>
        
        <button onclick="exploreArea()" class="rpg-button explore-button">🔍 Explorar Caminho</button>
        <button onclick="openShop()" class="rpg-button explore-button">🛍️ LOJA</button>
        
        <button onclick="meditateAction()" class="rpg-button utility-button">🧘 Meditar/Descansar</button>
        <button onclick="showInventory()" class="rpg-button utility-button">🎒 Inventário</button>
        <button onclick="saveGame()" class="rpg-button utility-button">💾 Salvar Jogo</button>

        ${bossDefeated 
            ? `<button onclick="loadPhase(gameState.currentPhase + 1)" class="rpg-button advance-button">🗺️ Avançar Fase ${gameState.currentPhase + 1}</button>`
            : `<button class="rpg-button advance-button" disabled>⚠️ Mate o Boss (${bossName}) para Avançar</button>`
        }
    `;
}

function meditateAction() {
    if (combatState.active) return;
    
    animateAction('player-figure', 'jumping'); 
    
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
    if (combatState.active) return;

    let newLeft = gameState.playerCoords.left;
    let newBottom = gameState.playerCoords.bottom;
    const step = 2; 
    const stepVertical = 10; 

    const playerFigure = document.getElementById('player-figure');
    
    if (direction === 'left') {
        newLeft = Math.max(5, newLeft - step);
        gameState.playerDirection = 'left';
    } else if (direction === 'right') {
        newLeft = Math.min(70, newLeft + step);
        gameState.playerDirection = 'right';
    } else if (direction === 'up') {
        newBottom = Math.min(100, newBottom + stepVertical); 
    } else if (direction === 'down') {
        newBottom = Math.max(0, newBottom - stepVertical); 
    } else if (direction === 'jump') {
        animateAction('player-figure', 'jumping');
        updateGameText("Você pulou no lugar! 💨");
        setTimeout(() => renderExplorationActions(), 500);
        return;
    }

    if (newLeft !== gameState.playerCoords.left || newBottom !== gameState.playerCoords.bottom) {
        gameState.playerCoords.left = newLeft;
        gameState.playerCoords.bottom = newBottom;
        updatePlayerPosition();
        
        // Check for mob encounter near player position
        if (checkMobEncounter()) {
            return;
        }
        
        // Random encounter chance (muito reduzido)
        const roll = getRandomInt(1, 15); 
        if (roll === 15) {
             const enemyName = getRandomEnemy(gameState.currentPhase);
             updateGameText(`⚠️ Emboscada! Um **${enemyName}** te surpreendeu!`);
             startCombat(enemyName); 
             return; 
        }
    }
    
    renderExplorationActions();
}

function checkMobEncounter() {
    const mapMobs = document.querySelectorAll('.mob-sprite');
    const playerX = gameState.playerCoords.left;
    const playerY = gameState.playerCoords.bottom;
    
    for (let mob of mapMobs) {
        const mobX = parseFloat(mob.style.left);
        const mobY = parseFloat(mob.style.top);
        
        // Check if player is close to mob (within 15% distance)
        const distance = Math.sqrt(Math.pow(playerX - mobX, 2) + Math.pow(playerY/2 - mobY, 2));
        
        if (distance < 15) {
            const enemyName = mob.title;
            updateGameText(`Você encontrou um **${enemyName}**! Prepare-se para a batalha! ⚔️`);
            startCombat(enemyName);
            return true;
        }
    }
    return false;
}


// =======================================================
// LÓGICA DE COMBATE
// =======================================================

function renderCombatStatus() {
    const gameTextDiv = document.getElementById('game-text');
    if (!combatState.active || !combatState.enemyStats) {
        gameTextDiv.innerHTML = `<p>O que você quer fazer?</p>`;
        return;
    }
    
    // Enemy HP Bar
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
    jumpBtn.textContent = '💨 Pular / Esquivar (Espaço)'; // Atualizado com atalho
    jumpBtn.classList.add('rpg-button', 'combat-button');
    jumpBtn.addEventListener('click', attemptToJump);
    actionButtons.appendChild(jumpBtn);
    
    const escapeBtn = document.createElement('button');
    escapeBtn.textContent = '🏃‍♂️ Tentar Fugir';
    escapeBtn.classList.add('rpg-button', 'combat-button');
    escapeBtn.addEventListener('click', attemptToEscape);
    actionButtons.appendChild(escapeBtn);
}


function checkAndRemoveExpiredBuffs() {
    if (!gameState.activeBuffs) return;
    
    let buffsRemoved = [];
    
    gameState.activeBuffs = gameState.activeBuffs.filter(buff => {
        
        if (combatState.active) {
            buff.duration--;
        } else {
             // Força a remoção de buffs temporários ao sair do combate
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
    }

    // NOVO: Mudar background de batalha baseado no mapa atual
    const scenarioDiv = document.getElementById('scenario-image');
    const currentPhase = gameState.currentPhase;
    
    // Verificar se é o Boss Final (último mapa/fase)
    const isFinalBoss = enemyName === 'O Abominável Guardião Final' || currentPhase === 8;
    
    if (isFinalBoss) {
        // Background especial APENAS para o Boss Final
        scenarioDiv.style.backgroundImage = `url('assets/images/battles/battle-boss.png')`;
        console.log(`[BATTLE BG] Boss Final detectado - usando battle-boss.png`);
    } else {
        // Background normal baseado no mapa (battle01.png a battle07.png)
        // Bosses de cada mapa (1-7) também usam o background do próprio mapa
        const battleBg = `assets/images/battles/battle${currentPhase.toString().padStart(2, '0')}.png`;
        scenarioDiv.style.backgroundImage = `url('${battleBg}')`;
        console.log(`[BATTLE BG] Mapa ${currentPhase} - usando ${battleBg}`);
    }

    const enemyFigure = document.getElementById('enemy-figure');
    enemyFigure.style.backgroundImage = `url('${enemyData.image}')`;
    
    enemyFigure.style.left = '80%';

    updateGameText(`Combate iniciado contra: ${enemyName}`);
    
    animateAction('enemy-figure', 'attacking');

    renderCombatStatus();
    renderCombatActions(); 
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

function enemyTurn() {
    if (!combatState.active) return;
    
    const enemyAttackValue = combatState.enemyStats.attack;
    const playerStats = getPlayerStatsWithBuffs();
    
    let damageToPlayer = Math.max(1, enemyAttackValue - playerStats.defense);
    
    const playerDefeated = applyDamage('player', damageToPlayer);
    
    // NOVO: Mostrar dano flutuante
    showFloatingDamage(-damageToPlayer, 'player-figure');

    updateGameText(`O inimigo **${combatState.enemyName}** contra-ataca e avança, causando **${damageToPlayer}** de dano!`);
    
    animateAction('enemy-figure', 'attacking');
    updatePlayerStatus();
    
    if (playerDefeated) {
        return;
    }
    
    setTimeout(() => {
        checkAndRemoveExpiredBuffs();
        renderCombatActions(); 
    }, 1000); 
}


function handlePlayerAttack(attack) {
    if (!combatState.active) return;
    const playerStats = getPlayerStatsWithBuffs();
    
    if (playerStats.mp_current < attack.cost) {
        updateGameText(`MP insuficiente para **${attack.name}**! Você perde o turno.`);
        setTimeout(() => enemyTurn(), 1000);
        return;
    }

    gameState.playerStats.mp_current -= attack.cost;
    animateAction('player-figure', 'attacking');
    updatePlayerStatus();

    let damageMessage = "";

    if (attack.type === "physical" || attack.type === "magic") {
        const attackStat = attack.type === "physical" ? playerStats.attack : playerStats.magic;
        
        let damage = Math.max(1, Math.floor(attackStat * attack.multiplier) - combatState.enemyStats.defense);
        
        const enemyDefeated = applyDamage('enemy', damage);
        
        // NOVO: Mostrar dano flutuante no inimigo
        showFloatingDamage(-damage, 'enemy-figure');
        
        damageMessage = `Você usa **${attack.name}**! Causa **${damage}** de dano no ${combatState.enemyName}.`;
        updateGameText(damageMessage);
        renderCombatStatus();

        if (enemyDefeated) {
            return;
        }

    } else if (attack.type === "buff") {
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
    
    // Ação defensiva de esquiva
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
        setTimeout(() => enemyTurn(), 1500); 
    }
}

// Lógica de recompensa e drops
function endCombat(result) {
    const defeatedEnemyName = combatState.enemyName; 
    const enemyData = ENEMIES[defeatedEnemyName];

    combatState.active = false;
    document.getElementById('enemy-figure').style.backgroundImage = 'none'; 
    combatState.enemyStats = null;
    combatState.enemyName = null;
    
    // NOVO: Restaurar background do mapa ao final da batalha
    const currentPhase = PHASES[gameState.currentPhase];
    if (currentPhase) {
        const scenarioDiv = document.getElementById('scenario-image');
        scenarioDiv.style.backgroundImage = `url(${currentPhase.scenarioImage})`;
        console.log(`[BATTLE BG] Combate finalizado - restaurando mapa: ${currentPhase.scenarioImage}`);
    }
    
    checkAndRemoveExpiredBuffs(); 
    
    if (result === 'win') {
        let rewardText = "";
        
        // 1. Recompensa em Dinheiro
        if (enemyData.rewardMoney) {
            gameState.money += enemyData.rewardMoney;
            rewardText += ` Recebeu **${enemyData.rewardMoney} Ouro**! 💰`;
            
            // NOVO: Mostrar gold flutuante
            showFloatingReward(enemyData.rewardMoney, 'gold', 'enemy-figure');
            
            console.log(`[OnDeath] ${defeatedEnemyName} derrotado. Recompensa: ${enemyData.rewardMoney} Ouro.`); 
        }
        
        // 2. Lógica de Drop (Tabela de Drops)
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
                console.log(`[OnDeath] Dropou item: ${droppedItem}.`);
                
                // 3. Checagem de Vitória da Fase (Boss Dead - Anel no inventário)
                if (enemyData.isBoss) {
                    gameState.isBossActive = false;
                    gameState.enemyKills = 0;
                    
                    // Verificar se é o boss final
                    if (defeatedEnemyName === 'O Abominável Guardião Final') {
                        gameState.isFinalBossDefeated = true;
                        
                        setTimeout(() => {
                            showNotification(`🏆 VITÓRIA FINAL! 🏆<br>Você salvou os Quatro Reinos!`, 4000);
                        }, 500);
                        
                        updateGameText(`🎉 **VITÓRIA ÉPICA FINAL!** Você derrotou **${defeatedEnemyName}**! ${rewardText}<br><br>👑 **O Anel dos Quatro Reinos brilha em suas mãos!**<br><br>Os reinos estão salvos. Você é um verdadeiro herói!`);
                        updatePlayerStatus();
                        
                        // Mostrar botão para voltar ao menu principal
                        setTimeout(() => {
                            const actionsDiv = document.getElementById('exploration-actions');
                            actionsDiv.innerHTML = '<button class="action-button" onclick="changeScreen(\'title-screen\')">🏰 Retornar ao Menu Principal</button>';
                        }, 2000);
                        return;
                    }
                    
                    // NOVO: Notificação épica para boss derrotado
                    setTimeout(() => {
                        showNotification(`👑 BOSS DERROTADO! 👑<br>${defeatedEnemyName}`, 3500);
                    }, 500);
                    
                    updateGameText(`🎉 **VITÓRIA ÉPICA!** Você derrotou o Boss: **${defeatedEnemyName}**! ${rewardText}<br><br>🗺️ Você pode agora **AVANÇAR** para o próximo reino!`);
                    updatePlayerStatus(); 
                    setTimeout(() => renderExplorationActions(), 1500); 
                    return; 
                }
            }
        }
        
        // 4. Inimigo Comum morto: aumenta o contador de kills
        if (!enemyData.isBoss) {
            gameState.enemyKills++;
            console.log(`[OnDeath] Inimigo Comum morto. Kills: ${gameState.enemyKills}.`);
        }

        updateGameText(`🎉 **VITÓRIA!** Você derrotou o inimigo: **${defeatedEnemyName}**! ${rewardText} Você pode continuar explorando.`);
        updatePlayerStatus();
        
        // Refresh mobs after combat victory
        setTimeout(() => {
            loadPhase(gameState.currentPhase);
            updateMapMobs();
        }, 1500); 
        
    } else if (result === 'lose') {
        showGameOver();
    } else if (result === 'run') {
        // Fuga bem-sucedida, volta para exploração (loadPhase já foi chamado)
    }
}


// =======================================================
// LÓGICA DO QUIZ
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
        // Quiz completo: verificar se é fase 5 e boss final ainda não foi derrotado
        if (gameState.currentPhase === 5 && !gameState.isFinalBossDefeated) {
            alert("Parabéns! Você provou seu conhecimento e forjou o Anel dos Quatro Reinos!");
            gameState.hasRing = true;
            
            // Retornar ao mapa e invocar o boss final
            continueAfterQuiz();
            setTimeout(() => {
                showNotification("⚔️ O ABOMINÁVEL GUARDIÃO FINAL SURGIU! ⚔️", "O guardião das trevas bloqueou seu caminho!");
                spawnFinalBoss();
            }, 1000);
            return;
        }
        
        // Vitória final após derrotar o boss
        alert("Parabéns! Você salvou os Quatro Reinos!");
        gameState.hasRing = true;
        document.getElementById('quiz-title').textContent = "👑 VITÓRIA!";
        document.getElementById('quiz-question').textContent = "O Anel dos Quatro Reinos foi forjado. Sua aventura está completa!";
        document.getElementById('quiz-feedback').textContent = "Fim de Jogo. Parabéns, Herói!";
        
        const backButton = document.getElementById('quizBackButton');
        backButton.textContent = '▶️ Voltar ao Menu Principal';
        backButton.onclick = () => changeScreen('title-screen');
        backButton.style.display = 'block';
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
    
    console.log('[SHOP] Itens da Loja Renderizados.'); 

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
    addItemToInventory(itemName);
    
    if (item.type === 'equipment') {
        // Stats serão aplicados via getPlayerStatsWithBuffs no próximo update
        document.getElementById('shop-feedback').textContent = `✅ ${itemName} comprado e equipado! Status melhorados!`;
    } else {
        document.getElementById('shop-feedback').textContent = `✅ ${itemName} comprado e adicionado ao inventário!`;
    }
    
    // CORREÇÃO: Sempre atualizar o display após comprar
    updatePlayerStatus();
    
    console.log(`[SHOP] Compra de ${itemName}. Novo Saldo: ${gameState.money} Ouro.`);

    renderShopItems(); 
    saveGame();
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
        
        // NOVO: Restaura a direção do player após animações
        if (elementId === 'player-figure') {
            updatePlayerPosition();
        }
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
        playerDirection: gameState.playerDirection,
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
        // Garante que as novas propriedades existam em saves antigos
        gameState.money = gameState.money || 0;
        gameState.enemyKills = gameState.enemyKills || 0;
        gameState.isBossActive = gameState.isBossActive || false;
        gameState.playerCoords = gameState.playerCoords || { left: 10, bottom: 0 };
        gameState.playerDirection = gameState.playerDirection || 'right';
        gameState.isFinalBossDefeated = gameState.isFinalBossDefeated || false;


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
        document.getElementById('game-text').innerHTML = "<h1>🎉 PARABÉNS! Você Venceu o Jogo! 🎉</h1>";
        document.getElementById('action-buttons').innerHTML = `<button class="rpg-button menu-button" onclick="changeScreen('title-screen')">🏠 Voltar ao Menu Principal</button>`;
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
        const requiredKills = phase.requiredKills || 3;
        
        gameTextDiv.innerHTML = `
            <h3>📍 Fase ${phaseNum}: ${phase.name}</h3>
            <p>${phase.introText}</p>
            <p><strong>⚔️ Objetivo:</strong> Derrote ${requiredKills} inimigos para enfrentar o Boss!</p>
            <p><strong>📊 Progresso:</strong> ${gameState.enemyKills}/${requiredKills} inimigos derrotados</p>
            <p><strong>💡 Dica:</strong> Use WASD para mover. Clique nos mobs ou pressione E para explorar.</p>
        `;
        
        renderExplorationActions();
        
        // NOVO: Spawn mobs on map when phase loads
        setTimeout(() => spawnMobsOnMap(), 500);
    } else {
        renderCombatStatus();
        renderCombatActions();
    }
    
    saveGame();
}

function exploreArea() {
    if (combatState.active) return;

    if (triggerRandomQuiz()) {
        return; 
    }
    
    const roll = getRandomInt(1, 100);

    animateAction('player-figure', 'jumping'); 
    updateGameText("🔍 Você está explorando o caminho com cautela...");

    if (roll <= 40) { 
        const enemyName = getRandomEnemy(gameState.currentPhase);
        updateGameText(`⚔️ Um **${enemyName}** surge de repente! Prepare-se para o combate!`);
        startCombat(enemyName); 
    } else if (roll <= 75) { 
        const foundItem = findRandomItem();
        
        updateGameText(`📦 Você encontrou um pequeno baú abandonado. Dentro havia uma **${foundItem.name}** ${foundItem.emoji}!`);
        applyItemEffect(foundItem);
    } else if (roll <= 90) {
        const goldFound = getRandomInt(10, 30);
        gameState.money += goldFound;
        updateGameText(`💰 Você encontrou **${goldFound} moedas de ouro** escondidas!`);
        updatePlayerStatus();
    } else { 
        updateGameText("🌫️ Você explorou cuidadosamente, mas o caminho estava vazio.");
    }
    
    // Refresh mobs on map after exploration
    updateMapMobs();
    
    if (!combatState.active && gameState.playerStats.pv_current > 0 && !gameState.quizState.inQuizScreen) {
        setTimeout(() => renderExplorationActions(), 700);
    } 
}

function searchSecret() {
    if (combatState.active) return;
    
    if (triggerRandomQuiz()) {
        return; 
    }
    
    const roll = getRandomInt(1, 100);
    
    animateAction('player-figure', 'jumping');
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

function showNotification(message, duration = 2500) {
    const notificationPopup = document.getElementById('notification-popup');
    if (!notificationPopup) return;
    
    notificationPopup.innerHTML = message;
    notificationPopup.classList.remove('hidden');
    notificationPopup.classList.add('show');
    
    setTimeout(() => {
        notificationPopup.classList.remove('show');
        setTimeout(() => {
            notificationPopup.classList.add('hidden');
        }, 300);
    }, duration);
}

function showGameOver() {
    const gameTextDiv = document.getElementById('game-text');
    const actionsDiv = document.getElementById('exploration-actions');
    const scenarioDiv = document.getElementById('scenario-image');
    
    // PARAR O COMBATE COMPLETAMENTE
    combatState.active = false;
    if (combatState.chaseLoop) {
        clearInterval(combatState.chaseLoop);
        combatState.chaseLoop = null;
    }
    
    // Mostrar imagem de Game Over
    scenarioDiv.style.backgroundImage = "url('assets/images/victory/game_over.png')";
    scenarioDiv.style.backgroundSize = "contain";
    scenarioDiv.style.backgroundPosition = "center";
    
    // Limpar mobs do mapa
    const mapMobsContainer = document.getElementById('map-mobs');
    if (mapMobsContainer) mapMobsContainer.innerHTML = '';
    
    // Esconder personagem e inimigo
    document.getElementById('player-figure').style.display = 'none';
    document.getElementById('enemy-figure').style.display = 'none';
    
    // Verificar se tem Revive no inventário
    const hasRevive = gameState.inventory.includes('Revive');
    
    gameTextDiv.innerHTML = `
        <h1 style="color: #ff3333; text-shadow: 2px 2px 4px #000;">☠️ GAME OVER ☠️</h1>
        <p style="font-size: 1.2em;">Você foi derrotado na batalha...</p>
        <p>Mas heróis nunca desistem!</p>
        ${hasRevive ? '<p style="color: #4CAF50; font-weight: bold;">💫 Você possui um Revive!</p>' : ''}
    `;
    
    let buttonsHTML = '';
    
    if (hasRevive) {
        buttonsHTML += `
            <button class="action-button" onclick="useRevive()" style="background: linear-gradient(135deg, #4CAF50, #2E7D32); font-size: 1.2em; padding: 15px 30px; margin: 10px;">
                💫 Usar Revive (Reviver com 50% PV/MP)
            </button>
        `;
    }
    
    buttonsHTML += `
        <button class="action-button" onclick="location.reload();" style="background: linear-gradient(135deg, #ff4444, #cc0000); font-size: 1.2em; padding: 15px 30px; margin: 10px;">
            🔄 Voltar ao Início
        </button>
    `;
    
    actionsDiv.innerHTML = buttonsHTML;
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
        const classData = CLASSES[className];
        
        // Criar card da classe
        const card = document.createElement('div');
        card.classList.add('class-card');
        card.setAttribute('data-class', className);
        
        // Imagem da classe
        const img = document.createElement('img');
        img.src = classData.image;
        img.alt = className;
        img.classList.add('class-card-img');
        
        // Nome da classe
        const name = document.createElement('div');
        name.classList.add('class-card-name');
        name.textContent = className;
        
        // Stats resumidos
        const stats = document.createElement('div');
        stats.classList.add('class-card-stats');
        stats.innerHTML = `
            <span>❤️ ${classData.baseStats.pv}</span>
            <span>✨ ${classData.baseStats.mp}</span>
            <span>⚔️ ${classData.baseStats.attack}</span>
        `;
        
        card.appendChild(img);
        card.appendChild(name);
        card.appendChild(stats);
        
        card.addEventListener('click', () => selectClass(className));
        
        classSelectionDiv.appendChild(card);
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

    document.querySelectorAll('.class-card').forEach(card => card.classList.remove('selected'));
    document.querySelector(`[data-class="${className}"]`).classList.add('selected');

    if (document.getElementById('playerName').value.trim() !== '') {
        startGameButton.disabled = false;
    }
}

function startNewGameSlot(slotNum) {
    gameState = {
        playerName: "", playerClass: "", playerStats: { pv_current: 0, mp_current: 0, pv: 0, mp: 0, attack: 0, magic: 0, defense: 0, agility: 0 }, 
        inventory: [], currentPhase: 1, 
        hasRing: false, saveSlot: slotNum, isMusicPlaying: gameState.isMusicPlaying,
        playerAttacks: [], activeBuffs: [], playerCoords: { left: 10, bottom: 0 },
        money: 0, enemyKills: 0, isBossActive: false,
        quizState: { currentQuestion: null, answeredQuestions: [], inQuizScreen: false, isFinalQuiz: false }
    };
    selectedClass = null; 
    
    changeScreen('character-creation');
    renderClassSelection(); 
    document.getElementById('startGameButton').disabled = true; 
    document.getElementById('playerName').value = ''; 
    document.getElementById('class-details').innerHTML = '<p>Selecione uma classe acima para ver os atributos iniciais e o visual do personagem.</p>';
}

function applyItemEffect(item) {
    // Para PV/MP
    if (item.type === 'good' && (item.effect === 'pv_current' || item.effect === 'mp_current')) {
        gameState.playerStats[item.effect] = Math.min(
            gameState.playerStats[item.effect] + item.value, 
            gameState.playerStats[item.effect.replace('_current', '')] 
        );
        gameState.playerStats[item.effect] = Math.max(0, gameState.playerStats[item.effect]); 
        
        updatePlayerStatus();
    } 
    // Para PV/MP (usado para recompensas do quiz)
    else if (item.effect === 'pv_current' || item.effect === 'mp_current') {
         gameState.playerStats[item.effect] = Math.min(
            gameState.playerStats[item.effect] + item.value, 
            gameState.playerStats[item.effect.replace('_current', '')] 
        );
        gameState.playerStats[item.effect] = Math.max(0, gameState.playerStats[item.effect]); 
        updatePlayerStatus();
    }
    
    // Para Buffs (Amuleto da Sorte ou similar)
    if (item.effect.includes('_temp')) {
        const stat = item.effect.replace('_temp', '');
        gameState.activeBuffs.push({
            sourceAttack: item.name,
            targetStat: stat,
            value: item.value, 
            duration: 3, 
            type: "item_buff"
        });
        updatePlayerStatus();
    }

    if (item.type !== 'bad') addItemToInventory(item.name); 
}

function addItemToInventory(itemName) {
    // Consumíveis da Loja não são adicionados ao inventário, são usados diretamente, mas itens de drop e equipamentos são.
    const shopItem = SHOP_ITEMS[itemName];
    
    if (shopItem && shopItem.type === 'consumable') {
        // Se for um item de loja consumível, aplica o efeito
        applyItemEffect(shopItem);
    } else {
        // Se for drop, equipamento, ou consumível encontrado na exploração
        gameState.inventory.push(itemName);
        
        // NOVO: Notificação visual especial para itens importantes
        if (itemName.includes('Anel de') || itemName.includes('Anel dos')) {
            showNotification(`✨ ${itemName} obtido! ✨`, 3000);
        } else if (shopItem && shopItem.type === 'equipment') {
            showNotification(`⚡ ${itemName} equipado! ⚡`, 2000);
        }
    }
    updatePlayerStatus(); 
    saveGame();
}

function showInventory() {
    changeScreen('game-play'); 
    
    let inventoryList = '';
    
    if (gameState.inventory.length > 0) {
        inventoryList = gameState.inventory.map(item => {
            const shopItem = SHOP_ITEMS[item];
            let icon = '';
            let equipped = '';
            
            if (shopItem) {
                icon = shopItem.emoji || '';
                if (shopItem.type === 'equipment') {
                    equipped = ' ⚡ <span style="color: #4CAF50;">(Equipado)</span>';
                }
            }
            
            // Check if it's a ring
            if (item.includes('Anel de')) {
                icon = '💍';
                equipped = ' ✨ <span style="color: #9d4edd;">(Artefato Importante)</span>';
            }
            
            return `<li>${icon} ${item}${equipped}</li>`;
        }).join('');
    } else {
        inventoryList = '<li style="color: #888;">Inventário Vazio.</li>';
    }

    const inventoryText = `
        <h3>🎒 Inventário de ${gameState.playerName}</h3>
        <ul style="list-style: none; padding: 10px; text-align: left;">${inventoryList}</ul>
        <p style="font-size: 1.2em; color: #f7b731;">💰 Você tem <strong>${gameState.money} Ouro</strong></p>
        <p style="font-size: 0.9em; color: #888;">Total de itens: ${gameState.inventory.length}</p>
    `;
    updateGameText(inventoryText);
    
    const actionButtons = document.getElementById('action-buttons');
    actionButtons.innerHTML = `
        <button onclick="loadPhase(gameState.currentPhase)" class="rpg-button menu-button">↩️ Voltar à Exploração</button>
        <button onclick="saveGame()" class="rpg-button">💾 Salvar Jogo</button>
    `;
}

function toggleMusic() {
    const bgmPlayer = document.getElementById('bgm-player');
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

// NOVO: Sistema de notificações popup
function showNotification(message, duration = 2000) {
    const notification = document.getElementById('notification-popup');
    if (!notification) return;
    
    notification.innerHTML = message;
    notification.classList.remove('hidden');
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 300);
    }, duration);
}

document.addEventListener('DOMContentLoaded', () => {
    const bgmPlayer = document.getElementById('bgm-player');
    bgmPlayer.volume = 0.5; 
    
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

    // ENHANCED: Keyboard Controls with Numbers for Combat
    document.addEventListener('keydown', (event) => {
        if (document.getElementById('game-play').classList.contains('active-screen') && !combatState.active) {
            
            console.log(`[INPUT] Tecla pressionada: ${event.key}`); 

            switch (event.key.toLowerCase()) {
                case 'arrowleft':
                case 'a':
                    movePlayer('left');
                    break;
                case 'arrowright':
                case 'd':
                    movePlayer('right');
                    break;
                case 'arrowup': 
                case 'w':
                    movePlayer('up');
                    break;
                case 'arrowdown': 
                case 's':
                    movePlayer('down');
                    break;
                case ' ': // Pular/Esquivar (Spacebar)
                    event.preventDefault(); 
                    movePlayer('jump');
                    break;
                case 'e': // Explorar
                    exploreArea();
                    break;
                case 'm': // Meditar
                    meditateAction();
                    break;
                case 'i': // Inventário
                    showInventory();
                    break;
            }
        }
        // Combat controls with numbers and space
        else if (document.getElementById('game-play').classList.contains('active-screen') && combatState.active) {
            if (event.key === ' ') {
                event.preventDefault(); 
                attemptToJump();
            } else if (event.key >= '1' && event.key <= '9') {
                const attackIndex = parseInt(event.key) - 1;
                if (gameState.playerAttacks[attackIndex]) {
                    handlePlayerAttack(gameState.playerAttacks[attackIndex]);
                }
            } else if (event.key.toLowerCase() === 'f') {
                attemptToEscape();
            }
        }
    });

    // NOVO: Mobile Virtual Joystick System
    initMobileJoystick();
    
    // NOVO: Detect mobile and show/hide joystick
    detectMobileAndAdjustUI();
    
    changeScreen('title-screen');
});

// =======================================================
// MOBILE JOYSTICK SYSTEM
// =======================================================

function initMobileJoystick() {
    const joystickBase = document.querySelector('.joystick-base');
    const joystickStick = document.querySelector('.joystick-stick');
    
    if (!joystickBase || !joystickStick) return;
    
    let isDragging = false;
    let startX = 0, startY = 0;
    let joystickCenterX = 0, joystickCenterY = 0;
    let moveInterval = null;
    
    const maxDistance = 35; // Max distance stick can move from center
    
    function handleStart(e) {
        e.preventDefault(); // NOVO: Previne scroll da página
        isDragging = true;
        const rect = joystickBase.getBoundingClientRect();
        joystickCenterX = rect.left + rect.width / 2;
        joystickCenterY = rect.top + rect.height / 2;
        
        const touch = e.touches ? e.touches[0] : e;
        startX = touch.clientX;
        startY = touch.clientY;
        
        // Start continuous movement - Mais responsivo
        if (moveInterval) clearInterval(moveInterval);
        moveInterval = setInterval(updateMovement, 100);
    }
    
    function handleMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        const touch = e.touches ? e.touches[0] : e;
        const deltaX = touch.clientX - joystickCenterX;
        const deltaY = touch.clientY - joystickCenterY;
        
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const angle = Math.atan2(deltaY, deltaX);
        
        const constrainedDistance = Math.min(distance, maxDistance);
        const stickX = constrainedDistance * Math.cos(angle);
        const stickY = constrainedDistance * Math.sin(angle);
        
        joystickStick.style.transform = `translate(${stickX}px, ${stickY}px)`;
    }
    
    function updateMovement() {
        if (!isDragging) return;
        
        const stickTransform = joystickStick.style.transform;
        const match = stickTransform.match(/translate\((.+)px,\s*(.+)px\)/);
        
        if (!match) return;
        
        const x = parseFloat(match[1]);
        const y = parseFloat(match[2]);
        
        // Determine direction based on stick position
        if (Math.abs(x) > Math.abs(y)) {
            if (x > 10) movePlayer('right');
            else if (x < -10) movePlayer('left');
        } else {
            if (y < -10) movePlayer('up');
            else if (y > 10) movePlayer('down');
        }
    }
    
    function handleEnd() {
        isDragging = false;
        joystickStick.style.transform = 'translate(0px, 0px)';
        if (moveInterval) {
            clearInterval(moveInterval);
            moveInterval = null;
        }
    }
    
    // Touch events
    joystickBase.addEventListener('touchstart', handleStart, { passive: false });
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
    
    // Mouse events for testing
    joystickBase.addEventListener('mousedown', handleStart);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    
    // Mobile action buttons
    document.querySelector('.jump-btn')?.addEventListener('click', () => {
        if (!combatState.active) movePlayer('jump');
        else attemptToJump();
    });
    
    document.querySelector('.explore-btn')?.addEventListener('click', () => {
        if (!combatState.active) exploreArea();
    });
    
    document.querySelector('.meditate-btn')?.addEventListener('click', () => {
        if (!combatState.active) meditateAction();
    });
}

function detectMobileAndAdjustUI() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
                     || window.innerWidth <= 768;
    
    const joystick = document.getElementById('mobile-joystick');
    
    if (isMobile && joystick) {
        joystick.classList.remove('hidden');
    }
}

// =======================================================
// MAP AND MOB SPAWNING SYSTEM
// =======================================================

function spawnMobsOnMap() {
    const mapMobsContainer = document.getElementById('map-mobs');
    if (!mapMobsContainer) return;
    
    mapMobsContainer.innerHTML = '';
    
    const phase = PHASES[gameState.currentPhase];
    if (!phase || phase.type === 'quiz_final') return;
    
    const bossName = phase.bossName;
    const requiredKills = phase.requiredKills || 3;
    const bossDropItem = bossName ? ENEMIES[bossName]?.dropTable[bossName] : null;
    const bossDefeated = bossDropItem ? gameState.inventory.includes(bossDropItem) : false;
    
    // NOVO SISTEMA PROGRESSIVO: Spawnar mobs um por vez
    if (gameState.enemyKills >= requiredKills && !bossDefeated) {
        // Após matar 3 mobs, spawna o BOSS
        console.log(`[SPAWN] Boss ${bossName} aparecendo!`);
        spawnMobSprite(bossName, 55, 35, true);
    } else if (!bossDefeated) {
        // Spawnar apenas 1 mob por vez, conforme o número de kills
        const currentMobIndex = gameState.enemyKills % 3; // 0, 1, ou 2
        
        const spawnPositions = [
            { x: 30, y: 25 },  // Mob 1 - Esquerda
            { x: 50, y: 30 },  // Mob 2 - Centro
            { x: 70, y: 25 }   // Mob 3 - Direita
        ];
        
        // Usar nome de mob baseado no mapa: M1_01.png, M1_02.png, M1_03.png
        const phaseNumber = gameState.currentPhase;
        const mobNumber = (currentMobIndex + 1).toString().padStart(2, '0');
        const mobName = `M${phaseNumber}_${mobNumber}`;
        
        // Verificar se o mob existe no ENEMIES, caso contrário usar enemies do phase
        const enemyName = ENEMIES[mobName] ? mobName : phase.enemies[currentMobIndex % phase.enemies.length];
        
        const pos = spawnPositions[currentMobIndex];
        console.log(`[SPAWN] Mob ${currentMobIndex + 1}/3: ${enemyName} na posição (${pos.x}%, ${pos.y}%)`);
        
        spawnMobSprite(enemyName, pos.x, pos.y, false);
    }
}

function spawnMobSprite(enemyName, xPercent, yPercent, isBoss) {
    const mapMobsContainer = document.getElementById('map-mobs');
    if (!mapMobsContainer) return;
    
    const mobSprite = document.createElement('div');
    mobSprite.className = isBoss ? 'mob-sprite boss' : 'mob-sprite';
    
    const enemyData = ENEMIES[enemyName];
    if (enemyData && enemyData.image) {
        mobSprite.style.backgroundImage = `url('${enemyData.image}')`;
    }
    
    mobSprite.style.left = `${xPercent}%`;
    mobSprite.style.top = `${yPercent}%`;
    mobSprite.title = enemyName;
    
    // Click to engage
    mobSprite.addEventListener('click', () => {
        startCombat(enemyName);
    });
    
    mapMobsContainer.appendChild(mobSprite);
}

function updateMapMobs() {
    if (document.getElementById('game-play').classList.contains('active-screen') && !combatState.active) {
        spawnMobsOnMap();
    }
}

// ========================================
// NOVAS FUNÇÕES: ANIMAÇÕES FLUTUANTES
// ========================================

/**
 * Mostra número de dano flutuante sobre a figura (jogador ou inimigo)
 * @param {number} value - Valor do dano (negativo para dano, positivo para cura)
 * @param {string} targetId - ID do elemento ('player-figure' ou 'enemy-figure')
 */
function showFloatingDamage(value, targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;
    
    const floatingDiv = document.createElement('div');
    floatingDiv.className = 'floating-number';
    
    const rect = target.getBoundingClientRect();
    const x = rect.left + (rect.width / 2);
    const y = rect.top;
    
    floatingDiv.style.left = `${x}px`;
    floatingDiv.style.top = `${y}px`;
    
    if (value < 0) {
        // Dano
        floatingDiv.textContent = `${value}`;
        floatingDiv.style.color = '#ff3333';
    } else {
        // Cura
        floatingDiv.textContent = `+${value}`;
        floatingDiv.style.color = '#33ff33';
    }
    
    document.body.appendChild(floatingDiv);
    
    setTimeout(() => {
        floatingDiv.remove();
    }, 1500);
}

/**
 * Mostra recompensa flutuante (Gold ou XP)
 * @param {number} value - Valor da recompensa
 * @param {string} type - Tipo: 'gold' ou 'xp'
 * @param {string} targetId - ID do elemento de origem
 */
function showFloatingReward(value, type, targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;
    
    const floatingDiv = document.createElement('div');
    floatingDiv.className = 'floating-number';
    
    const rect = target.getBoundingClientRect();
    const x = rect.left + (rect.width / 2);
    const y = rect.top;
    
    floatingDiv.style.left = `${x}px`;
    floatingDiv.style.top = `${y}px`;
    
    if (type === 'gold') {
        floatingDiv.textContent = `+${value} 💰`;
        floatingDiv.style.color = '#FFD700';
    } else if (type === 'xp') {
        floatingDiv.textContent = `+${value} XP`;
        floatingDiv.style.color = '#00FF00';
    }
    
    document.body.appendChild(floatingDiv);
    
    setTimeout(() => {
        floatingDiv.remove();
    }, 1500);
}

// ========================================
// FUNÇÃO REVIVE
// ========================================

/**
 * Usa o item Revive do inventário para reviver o jogador
 */
function useRevive() {
    console.log('[REVIVE] Usando Revive...');
    
    // Verificar se tem Revive no inventário
    const reviveIndex = gameState.inventory.indexOf('Revive');
    if (reviveIndex === -1) {
        console.error('[REVIVE] Erro: Revive não encontrado no inventário!');
        return;
    }
    
    // Remover Revive do inventário
    gameState.inventory.splice(reviveIndex, 1);
    console.log(`[REVIVE] Revive removido do inventário. Inventário atual:`, gameState.inventory);
    
    // Restaurar 50% de PV e MP
    gameState.playerStats.pv_current = Math.floor(gameState.playerStats.pv * 0.5);
    gameState.playerStats.mp_current = Math.floor(gameState.playerStats.mp * 0.5);
    
    console.log(`[REVIVE] PV restaurado: ${gameState.playerStats.pv_current}/${gameState.playerStats.pv}`);
    console.log(`[REVIVE] MP restaurado: ${gameState.playerStats.mp_current}/${gameState.playerStats.mp}`);
    
    // Salvar o jogo
    saveGame();
    
    // Recarregar a fase atual
    const currentPhase = gameState.currentPhase || 1;
    loadPhase(currentPhase);
    
    // Mostrar mensagem de revive
    updateGameText(`✨ **Você usou um Revive!** ✨\n\nVocê reviveu com 50% de PV e MP. Continue lutando, herói!`);
    
    console.log('[REVIVE] Jogador revivido com sucesso!');
}

function spawnFinalBoss() {
    const mapMobsContainer = document.getElementById('map-mobs');
    if (!mapMobsContainer) return;
    
    // Limpa todos os mobs do mapa
    mapMobsContainer.innerHTML = '';
    
    const finalBossName = 'O Abominável Guardião Final';
    
    // Spawna o boss final no centro do mapa (50%, 40%)
    const mobSprite = document.createElement('div');
    mobSprite.className = 'mob-sprite boss';
    mobSprite.id = 'final-boss-sprite';
    
    const enemyData = ENEMIES[finalBossName];
    if (enemyData && enemyData.image) {
        mobSprite.style.backgroundImage = `url('${enemyData.image}')`;
    }
    
    mobSprite.style.left = '50%';
    mobSprite.style.top = '40%';
    mobSprite.style.transform = 'translate(-50%, -50%) scale(1.3)'; // Boss maior
    mobSprite.title = finalBossName;
    
    // Adiciona animação especial de pulsação
    mobSprite.style.animation = 'float 2s ease-in-out infinite, pulse 1.5s ease-in-out infinite';
    
    // Click to engage
    mobSprite.addEventListener('click', () => {
        startCombat(finalBossName);
    });
    
    mapMobsContainer.appendChild(mobSprite);
}