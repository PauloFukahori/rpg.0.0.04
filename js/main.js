// =======================================================
// VARIÁVEIS GLOBAIS E CONFIGURAÇÕES
// NOTA: As variáveis principais (gameState, combatState, SAVE_SLOT_KEY, MAX_SAVE_SLOTS)
// SÃO AGORA CARREGADAS EXCLUSIVAMENTE DO config.js para evitar erros de declaração duplicada.
// =======================================================

// Apenas declarações temporárias e externas (se necessário)

// [REMOVER AS DEFINIÇÕES DUPLICADAS ABAIXO - APENAS LIXO DE CÓDIGO ANTIGO REMOVIDO]
/*
const ENEMIES_OLD = { ... };
const PHASES_OLD = { ... };
const RANDOM_ITEMS_OLD = [ ... ];
const QUIZ_QUESTIONS_OLD = [ ... ];
const SHOP_ITEMS_OLD = { ... };
*/
// [FIM DA REMOÇÃO]


// =======================================================
// FUNÇÕES UTILITÁRIAS
// =======================================================

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// LÓGICA DE SPAWN - Checa kills para invocar Boss
// LÓGICA DE SPAWN - Determinístico: 3 Mobs -> Boss
function getRandomEnemy(phaseNum) {
    const phase = PHASES[phaseNum] || PHASES[1];

    // Se o Boss já foi ativado, retorna ele
    if (gameState.isBossActive) return phase.bossName;

    // Verificar mobs disponíveis
    const allEnemies = phase.enemies;
    const available = allEnemies.filter(name => !gameState.defeatedMobNames.includes(name));

    // Se não há mais mobs disponíveis e já matamos 3 (ou todos), é boss
    if (available.length === 0) {
        console.log(`[SPAWN] Todos mobs derrotados. Boss ${phase.bossName} ativado.`);
        gameState.isBossActive = true;
        return phase.bossName;
    }

    // Retorna um mob aleatório dos disponíveis para encontros aleatórios
    return available[getRandomInt(0, available.length - 1)];
}

function getAvailableMobs() {
    const phase = PHASES[gameState.currentPhase];
    if (!phase) return [];

    // Se boss está ativo, apenas boss
    if (gameState.isBossActive) return [phase.bossName];

    // Retorna os mobs ainda não vencidos (assumindo ordem sequencial para simplificar estado ou usar array de booleanos)
    // Vamos usar mobsDefeatedInPhase como contador. 0 = mostre todos 3. 1 = mostre os ultimos 2.
    // Isso assume que matamos em ordem? O user disse "ao selecionar um deles...".
    // Melhor seria rastrear QUAIS morreram. Mas para simplificar: vamos mostrar 3 sprites fixa, e remover a que foi clicada/morta.
    // Vamos assumir que 'mobsDefeatedInPhase' conta quantos. E vamos esconder 1 sprite por kill.
    return phase.enemies;
}

// FUNÇÃO ORIGINAL REINCORPORADA
function findRandomItem() {
    // RANDOM_ITEMS é carregado de items.js
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
    // CLASSES é carregado de classes.js
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
    gameState.phaseIntrosShown = []; // Rastreia quais fases já mostraram intro
    gameState.quizState = { // Reinicializa o estado do quiz
        currentQuestion: null,
        answeredQuestions: [],
        inQuizScreen: false,
        isFinalQuiz: false
    };
    gameState.extraLives = 3; // Sistema de 3 vidas implementado
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
    // SHOP_ITEMS é carregado de items.js
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

    const stats = getPlayerStatsWithBuffs();
    // Render Modern HUD properly
    document.getElementById('player-name-display').innerText = `${gameState.playerName} - ${gameState.playerClass} (Lvl ${gameState.playerLevel})`;

    // HP Bar
    const hpPercent = Math.max(0, Math.min(100, (stats.pv_current / stats.pv) * 100));
    const hpFill = document.getElementById('hp-bar-fill');
    if (hpFill) hpFill.style.width = `${hpPercent}%`;
    const hpText = document.getElementById('hp-text');
    if (hpText) hpText.innerText = `${stats.pv_current} / ${stats.pv}`;

    // MP Bar
    const mpPercent = Math.max(0, Math.min(100, (stats.mp_current / stats.mp) * 100));
    const mpFill = document.getElementById('mp-bar-fill');
    if (mpFill) mpFill.style.width = `${mpPercent}%`;
    const mpText = document.getElementById('mp-text');
    if (mpText) mpText.innerText = `${stats.mp_current} / ${stats.mp}`;

    // Stats Grid with Icons
    const grid = document.querySelector('.hud-stats-grid');
    if (grid) {
        grid.innerHTML = `
            <div class="stat-item"><i class="fa-solid fa-hand-fist stat-icon"></i> Ataque: ${stats.attack}</div>
            <div class="stat-item"><i class="fa-solid fa-wand-magic-sparkles stat-icon" style="color:#bf55ec"></i> Magia: ${stats.magic}</div>
            <div class="stat-item"><i class="fa-solid fa-shield-halved stat-icon" style="color:#95a5a6"></i> Defesa: ${stats.defense}</div>
            <div class="stat-item"><i class="fa-solid fa-wind stat-icon" style="color:#2ecc71"></i> Agilidade: ${stats.agility}</div>
            <div class="stat-item"><i class="fa-solid fa-coins stat-icon"></i> Ouro: ${gameState.money}</div>
            <div class="stat-item"><i class="fa-solid fa-suitcase stat-icon" style="color:#e67e22"></i> Inventário: ${gameState.inventory.length}</div>
            <div class="stat-item"><i class="fa-solid fa-spa stat-icon" style="color:#ff7675"></i> Meditação: ${gameState.meditationCharges !== undefined ? gameState.meditationCharges : 3}/3</div>
        `;
    }

    // Default Level if undefined
    if (gameState.playerLevel === undefined) gameState.playerLevel = 1;

    // Default Meditation if undefined
    if (gameState.meditationCharges === undefined) gameState.meditationCharges = 3;

    // Check again
    document.getElementById('player-name-display').innerText = `${gameState.playerName} - ${gameState.playerClass} (Lvl ${gameState.playerLevel})`;

    // Update Character Figure
    const playerFigure = document.getElementById('player-figure');
    const classImage = CLASSES[gameState.playerClass]?.image || 'assets/images/placeholder.png';
    playerFigure.style.backgroundImage = `url('${classImage}')`;
    playerFigure.style.display = 'block';
}

// =======================================================
// LÓGICA DE MOVIMENTO NO MAPA (Exploração)
// =======================================================

function renderExplorationActions() {
    // PHASES é carregado de maps.js, ENEMIES é carregado de mobs.js
    const actionButtons = document.getElementById('action-buttons');
    const currentPhaseData = PHASES[gameState.currentPhase];

    const bossName = currentPhaseData?.bossName;
    // Pegar o nome do anel que o boss dropa (primeira chave do dropTable)
    const bossDropItem = bossName && ENEMIES[bossName]?.dropTable
        ? Object.keys(ENEMIES[bossName].dropTable)[0]
        : null;
    // Se não há boss definido para a fase (ex: Fase 5 Quiz), bossDefeated é true
    const bossDefeated = bossDropItem ? gameState.inventory.includes(bossDropItem) : true;

    console.log(`[RENDER EXPLORATION] Fase ${gameState.currentPhase} - Boss: ${bossName}, Anel: ${bossDropItem}, Derrotado: ${bossDefeated}`);

    actionButtons.innerHTML = `
        <button onclick="movePlayer('left')" class="rpg-button move-button"><i class="fa-solid fa-arrow-left"></i> Esqu. <kbd style="opacity:0.7; font-size:0.85em;">[A]</kbd></button>
        <button onclick="movePlayer('up')" class="rpg-button move-button"><i class="fa-solid fa-arrow-up"></i> Cima <kbd style="opacity:0.7; font-size:0.85em;">[W]</kbd></button>
        <button onclick="movePlayer('right')" class="rpg-button move-button">Dir. <i class="fa-solid fa-arrow-right"></i> <kbd style="opacity:0.7; font-size:0.85em;">[D]</kbd></button>
        <button onclick="movePlayer('down')" class="rpg-button move-button"><i class="fa-solid fa-arrow-down"></i> Baixo <kbd style="opacity:0.7; font-size:0.85em;">[S]</kbd></button>
        
        <button onclick="exploreArea()" class="rpg-button explore-button">
            <span style="font-size: 1.5em;"><i class="fa-solid fa-magnifying-glass"></i></span>
            <span>Explorar</span>
            <kbd style="opacity:0.7; font-size:0.85em;">[E]</kbd>
        </button>
        <button onclick="openShop()" class="rpg-button explore-button">
            <span style="font-size: 1.5em;"><i class="fa-solid fa-shop"></i></span>
            <span>Loja</span>
            <kbd style="opacity:0.7; font-size:0.85em;">[L]</kbd>
        </button>
        
        <button onclick="meditateAction()" class="rpg-button utility-button">
            <span style="font-size: 1.5em;"><i class="fa-solid fa-spa"></i></span>
            <span>Meditar</span>
            <kbd style="opacity:0.7; font-size:0.85em;">[M]</kbd>
        </button>
        <button onclick="showInventory()" class="rpg-button utility-button">
            <span style="font-size: 1.5em;"><i class="fa-solid fa-suitcase"></i></span>
            <span>Inventário</span>
            <kbd style="opacity:0.7; font-size:0.85em;">[I]</kbd>
        </button>
        <button onclick="saveGame()" class="rpg-button utility-button">
            <span style="font-size: 1.5em;"><i class="fa-solid fa-floppy-disk"></i></span>
            <span>Salvar</span>
            <kbd style="opacity:0.7; font-size:0.85em;">[P]</kbd>
        </button>
        <button onclick="if(confirm('Deseja voltar ao menu? Progresso não salvo será perdido!')) { saveGame(); changeScreen('title-screen'); }" class="rpg-button utility-button" style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); border-color: #a93226;">
            <span style="font-size: 1.5em;"><i class="fa-solid fa-house"></i></span>
            <span>Menu</span>
        </button>

        ${bossDefeated
            ? `<button onclick="loadPhase(gameState.currentPhase + 1)" class="rpg-button advance-button" style="flex-basis: 100%; background: linear-gradient(135deg, #4CAF50, #2E7D32); font-size: 1.2em; padding: 18px; margin: 15px 0; box-shadow: 0 6px 20px rgba(76, 175, 80, 0.6); border: 3px solid #1B5E20; animation: pulse 2s infinite;"><i class="fa-solid fa-map"></i> <i class="fa-solid fa-wand-magic-sparkles"></i> AVANÇAR PARA FASE ${gameState.currentPhase + 1} <i class="fa-solid fa-wand-magic-sparkles"></i></button>`
            : `<button class="rpg-button advance-button" disabled style="flex-basis: 100%; opacity: 0.5;"><i class="fa-solid fa-triangle-exclamation"></i> Mate o Boss (${bossName}) - 70% chance</button>`
        }
    `;
}

function meditateAction() {
    if (combatState.active) return;

    if (gameState.meditationCharges <= 0) {
        showNotification("🚫 Você não pode meditar mais nesta fase!");
        return;
    }

    animateAction('player-figure', 'jumping'); // Reutilizando anim de pulo como 'ação'

    const mpRecovered = 30; // Aumentado
    const pvRecovered = 30;

    gameState.playerStats.mp_current = Math.min(gameState.playerStats.mp_current + mpRecovered, gameState.playerStats.mp);
    gameState.playerStats.pv_current = Math.min(gameState.playerStats.pv_current + pvRecovered, gameState.playerStats.pv);

    gameState.meditationCharges--; // Consome carga
    updatePlayerStatus();

    updateGameText(`<i class="fa-solid fa-spa" style="color:#ff7675"></i> Você meditou profundamente. Recuperou **${pvRecovered} PV** e **${mpRecovered} MP**. (Cargas: ${gameState.meditationCharges}/3)`);

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
        updateGameText("Você pulou no lugar! <i class='fa-solid fa-wind'></i>");
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
            updateGameText(`<i class="fa-solid fa-triangle-exclamation" style="color:orange"></i> Emboscada! Um **${enemyName}** te surpreendeu!`);
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
        const mobY = parseFloat(mob.style.bottom);

        // Check if player is close to mob (within 15% distance)
        const distance = Math.sqrt(Math.pow(playerX - mobX, 2) + Math.pow(playerY - mobY, 2));

        if (distance < 15) {
            const enemyName = mob.title;
            updateGameText(`Você encontrou um **${enemyName}**! Prepare-se para a batalha! <i class="fa-solid fa-swords" style="color:red"></i>`);
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
            <span><i class="fa-solid fa-heart" style="color:red"></i> PV do Inimigo: ${enemyPvCurrent} / ${enemyPvMax}</span>
        </div>
        <p>Ataque: ${combatState.enemyStats.attack} | Defesa: ${combatState.enemyStats.defense}</p>
    `;

    gameTextDiv.innerHTML = enemyStatusHTML + gameTextDiv.innerHTML;
}

function renderCombatActions() {
    const actionButtons = document.getElementById('action-buttons');
    actionButtons.innerHTML = '';

    const keyHints = ['1/Q', '2/W', '3/E', '4/R'];

    gameState.playerAttacks.forEach((attack, index) => {
        const btn = document.createElement('button');
        const keyHint = keyHints[index] || (index + 1);
        btn.innerHTML = `
            <i class="${attack.icon}" style="font-size: 1.3em;"></i>
            <span style="font-weight: bold;">${attack.name}</span>
            <span style="font-size: 0.85em; opacity: 0.9;">${attack.cost} MP</span>
            <kbd style="opacity:0.7; font-size:0.75em;">[${keyHint}]</kbd>
        `;
        btn.classList.add('rpg-button', 'combat-button');
        btn.addEventListener('click', () => handlePlayerAttack(attack));
        actionButtons.appendChild(btn);
    });

    const jumpBtn = document.createElement('button');
    jumpBtn.innerHTML = `
        <span style="font-size: 1.3em;"><i class="fa-solid fa-wind"></i></span>
        <span style="font-weight: bold;">Esquivar</span>
        <kbd style="opacity:0.7; font-size:0.75em;">[Espaço]</kbd>
    `;
    jumpBtn.classList.add('rpg-button', 'combat-button');
    jumpBtn.addEventListener('click', attemptToJump);
    actionButtons.appendChild(jumpBtn);

    const escapeBtn = document.createElement('button');
    escapeBtn.innerHTML = `
        <span style="font-size: 1.3em;"><i class="fa-solid fa-person-running"></i></span>
        <span style="font-weight: bold;">Fugir</span>
        <kbd style="opacity:0.7; font-size:0.75em;">[F/ESC]</kbd>
    `;
    escapeBtn.classList.add('rpg-button', 'combat-button');
    escapeBtn.addEventListener('click', attemptToEscape);
    actionButtons.appendChild(escapeBtn);

    const inventoryBtn = document.createElement('button');
    inventoryBtn.innerHTML = `
        <span style="font-size: 1.3em;"><i class="fa-solid fa-suitcase"></i></span>
        <span style="font-weight: bold;">Inventário</span>
        <kbd style="opacity:0.7; font-size:0.75em;">[I]</kbd>
    `;
    inventoryBtn.classList.add('rpg-button', 'combat-button');
    inventoryBtn.style.backgroundColor = '#8e44ad';
    inventoryBtn.addEventListener('click', showInventory);
    actionButtons.appendChild(inventoryBtn);
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
    // ENEMIES é carregado de mobs.js
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

    // Boss Effect
    if (enemyData.isBoss) {
        enemyFigure.classList.add('boss-effect');
        enemyFigure.style.transform = "scale(1.2)"; // Make boss slightly larger
    } else {
        enemyFigure.classList.remove('boss-effect');
        enemyFigure.style.transform = "scale(1)";
    }

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

    // Verificar Bênção Divina
    if (gameState.blessingActive && gameState.blessingActive > 0) {
        gameState.blessingActive = 0;
        updateGameText(`<i class="fa-solid fa-star" style="color:yellow"></i> **Bênção Divina ativa!** O ataque do **${combatState.enemyName}** foi bloqueado pela proteção divina!`);

        setTimeout(() => {
            checkAndRemoveExpiredBuffs();
            renderCombatStatus();
            renderCombatActions();
        }, 1500);
        return;
    }

    const enemyData = ENEMIES[combatState.enemyName] || {};
    const attacks = (enemyData.attacks && enemyData.attacks.length) ? enemyData.attacks : [{ name: 'Ataque', type: 'physical', multiplier: 1.0 }];
    const chosen = attacks[getRandomInt(0, attacks.length - 1)];

    const playerStats = getPlayerStatsWithBuffs();
    const enemyAttackValue = combatState.enemyStats.attack;

    // Calcular dano base
    let damageToPlayer = Math.max(1, Math.floor(enemyAttackValue * (chosen.multiplier || 1)) - playerStats.defense);

    // Aplicar o ataque
    const playerDefeated = applyDamage('player', damageToPlayer);

    // Mostrar dano e texto com o nome do ataque
    showFloatingDamage(-damageToPlayer, 'player-figure');
    updateGameText(`O inimigo **${combatState.enemyName}** usa **${chosen.name}** e causa **${damageToPlayer}** de dano!`);

    // Animação e atualização visual
    animateAction('enemy-figure', 'attacking');
    updatePlayerStatus();
    renderCombatStatus();

    // Efeitos especiais simples: drenar PV ou aplicar debuff de defesa em nomes óbvios
    const nameLower = (chosen.name || '').toLowerCase();
    if (nameLower.includes('drenar') || nameLower.includes('abraço') || nameLower.includes('canção')) {
        // Exemplo: drenar parte do dano para o inimigo (20%)
        const heal = Math.min(Math.floor(damageToPlayer * 0.5), combatState.enemyStats.pv - combatState.enemyStats.pv_current);
        if (heal > 0) {
            combatState.enemyStats.pv_current = Math.min(combatState.enemyStats.pv, combatState.enemyStats.pv_current + heal);
            showFloatingReward(heal, 'xp', 'enemy-figure');
            updateGameText((document.getElementById('game-text').innerHTML || '') + `<br><i class="fa-solid fa-star"></i> ${combatState.enemyName} absorve ${heal} PV com ${chosen.name}!`);
        }
    }

    if (nameLower.includes('venen') || nameLower.includes('putref') || nameLower.includes('pestil') || nameLower.includes('cuspe') || nameLower.includes('esporo')) {
        // aplicar um debuff simples de defesa por 2 turnos
        const debVal = Math.max(1, Math.floor(enemyAttackValue * 0.15));
        gameState.activeBuffs.push({ sourceAttack: chosen.name, targetStat: 'defense', value: -debVal, duration: 2, type: 'debuff' });
        updateGameText((document.getElementById('game-text').innerHTML || '') + `<br><i class="fa-solid fa-skull-crossbones"></i> ${combatState.enemyName} aplica ${chosen.name} e reduz sua defesa em ${debVal} por 2 turnos!`);
    }

    if (playerDefeated) {
        return;
    }

    setTimeout(() => {
        checkAndRemoveExpiredBuffs();
        renderCombatStatus();
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

        // Verificar chance de crítico
        let criticalChance = 5; // 5% base
        const criticalBuff = gameState.activeBuffs?.find(b => b.type === 'critical');
        if (criticalBuff) {
            criticalChance += criticalBuff.value;
        }

        const isCritical = Math.random() * 100 < criticalChance;
        if (isCritical) {
            damage = Math.floor(damage * 1.5);
            damageMessage = `<i class="fa-solid fa-burst" style="color:orange"></i> **CRÍTICO!** Você usa **${attack.name}**! Causa **${damage}** de dano crítico no ${combatState.enemyName}!`;
        } else {
            damageMessage = `Você usa **${attack.name}**! Causa **${damage}** de dano no ${combatState.enemyName}.`;
        }

        const enemyDefeated = applyDamage('enemy', damage);

        // NOVO: Mostrar dano flutuante no inimigo
        showFloatingDamage(-damage, 'enemy-figure');

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
    // PHASES é carregado de maps.js, ENEMIES é carregado de mobs.js
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
        scenarioDiv.style.backgroundImage = `url('${currentPhase.scenarioImage}')`;
        console.log(`[BATTLE BG] Combate finalizado - restaurando mapa: ${currentPhase.scenarioImage}`);
    }

    checkAndRemoveExpiredBuffs();

    if (result === 'win') {
        let rewardText = "";

        // 1. Aumento de Stats (Progressão)
        const isBoss = enemyData.isBoss;
        increaseStats(isBoss ? 5 : 1); // 1 pt mob comum, 5 pts boss

        // 2. Recompensa em Dinheiro
        if (enemyData.rewardMoney) {
            gameState.money += enemyData.rewardMoney;
            rewardText += ` +${enemyData.rewardMoney} Ouro!`;
            showFloatingReward(enemyData.rewardMoney, 'gold', 'enemy-figure');
        }

        // 3. Drop de Itens
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
                rewardText += ` Drop: ${droppedItem}!`;
                // Auto-equipar anéis especiais do boss
                if (isBoss && (droppedItem.includes('Anel') || droppedItem.includes('Ring'))) {
                    // Equipar lógica simplificada se necessário
                }
            }
        }

        // 4. Lógica de Boss vs Mob Comum
        if (isBoss) {
            gameState.isBossActive = false;

            // Full Heal on Boss Kill
            gameState.playerStats.pv_current = gameState.playerStats.pv;
            gameState.playerStats.mp_current = gameState.playerStats.mp;

            // Checar Vitória Final
            if (gameState.currentPhase >= 7) {
                // Assumindo fase 7 ou nome específico
                if (gameState.currentPhase === 7 || defeatedEnemyName === 'O Abominável Guardião Final') {
                    showFinalVictory();
                    return;
                }
            }

            showNotification(`👑 BOSS DERROTADO! 👑<br>${defeatedEnemyName}`, 4000);
            updateGameText(`🎉 **VITÓRIA ÉPICA!** Boss derrotado! ${rewardText}<br>Stats aumentados! PV/MP Restaurados!<br>➡️ Avance para o próximo mapa.`);

            // Permitir avançar
            // A renderização actions vai verificar drop ou apenas flag de boss morto
            // Vamos garantir que inventory tenha item do boss ou criar flag
            if (droppedItem) { /* já está no inv */ }
            else {
                // Se boss não dropou item (azar?), forçamos um "Token" invisible ou apenas confiamos que o jogo permite avançar
                // O renderActions verifica 'bossDropItem' no inventario. 
                // Se o boss falhou em dropar, o jogador fica preso? 
                // Vamos forçar o drop do Boss sempre que vencer, ou 100% chance no JSON?
                // O JSON tem chance. Vamos forçar adição do item chave se não caiu.
                const keyItem = Object.keys(enemyData.dropTable)[0];
                if (keyItem && !gameState.inventory.includes(keyItem)) {
                    addItemToInventory(keyItem);
                    rewardText += ` (Item Chave obtido)`;
                }
            }
        } else {
            // Mob Comum
            gameState.mobsDefeatedInPhase = (gameState.mobsDefeatedInPhase || 0) + 1;
            gameState.enemyKills++;

            // Adicionar nome à lista de derrotados
            if (!gameState.defeatedMobNames) gameState.defeatedMobNames = [];
            gameState.defeatedMobNames.push(defeatedEnemyName);

            updateGameText(`Vitória! **${defeatedEnemyName}** derrotado. ${rewardText}`);

            // Remover sprite visualmente (fallback pois spawnMobsOnMap será chamado)
            const mapMobsContainer = document.getElementById('map-mobs');
            if (mapMobsContainer) {
                const sprites = mapMobsContainer.querySelectorAll('.mob-sprite-map');
                for (let s of sprites) {
                    if (s.title === defeatedEnemyName) {
                        s.remove();
                        break;
                    }
                }
            }
        }

        updatePlayerStatus();
        setTimeout(() => spawnMobsOnMap(), 1000); // Re-render logic handles Boss spawn if 3 dead

    } else if (result === 'lose') {
        showGameOver();
    } else if (result === 'run') {
        // Fuga
    }
}

// NOVO: Função para aumentar stats
function increaseStats(amount) {
    const stats = ['attack', 'defense', 'magic', 'agility'];
    // Aumenta todos os stats um pouco? Ou aleatório?
    // Pedido: "Gradual increase on mobs, significant on boss"
    // Vamos aumentar Todos em 'amount'.

    // Atualiza baseStats do save (não apenas o atual com buffs)
    // Na verdade, gameState.playerStats é a base + buffs? Não, createPlayer faz copy.
    // Vamos modificar gameState.playerStats diretamente.

    stats.forEach(stat => {
        gameState.playerStats[stat] += amount;
    });

    // Aumentar HP/MP Max também?
    gameState.playerStats.pv += (amount * 5);
    gameState.playerStats.mp += (amount * 2);

    // Curar proporcional ao aumento
    gameState.playerStats.pv_current += (amount * 5);
    gameState.playerStats.mp_current += (amount * 2);

    showNotification(`💪 Stats Aumentados! +${amount} (HP +${amount * 5})`);
}


// =======================================================
// LÓGICA DO QUIZ
// =======================================================

function renderQuizScreen(question, isFinal = false) {
    // QUIZ_QUESTIONS é carregado de items.js
    gameState.quizState.inQuizScreen = true;
    gameState.quizState.currentQuestion = question.id;
    gameState.quizState.isFinalQuiz = isFinal;
    changeScreen('quiz-screen');

    document.getElementById('quiz-title').innerHTML = isFinal ? '<i class="fa-solid fa-wand-magic-sparkles"></i> O Grande Teste da Memória' : '<i class="fa-solid fa-question"></i> Pergunta Inesperada';
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
    // QUIZ_QUESTIONS é carregado de items.js
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
        feedbackDiv.innerHTML = `<i class="fa-solid fa-check" style="color:green"></i> Resposta Correta! Recompensa recebida: +${question.reward.value} ${question.reward.type === 'mp_current' ? 'MP' : 'PV'}!`;
        applyItemEffect(question.reward);

        if (!gameState.quizState.answeredQuestions.includes(questionId)) {
            gameState.quizState.answeredQuestions.push(questionId);
        }

        if (gameState.quizState.isFinalQuiz) {
            backButton.innerHTML = '<i class="fa-solid fa-play"></i> Próximo Desafio';
            backButton.onclick = () => startFinalQuiz(true);
            return;
        }

    } else {
        feedbackDiv.innerHTML = `<i class="fa-solid fa-xmark" style="color:red"></i> Resposta Incorreta. A resposta correta era: ${question.options[question.answer]}.`;
        if (gameState.quizState.isFinalQuiz) {
            feedbackDiv.innerHTML += ` Tente o desafio novamente.`;
            backButton.innerHTML = '<i class="fa-solid fa-rotate-left"></i> Tentar Novamente';
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
    // QUIZ_QUESTIONS é carregado de items.js
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
    // QUIZ_QUESTIONS é carregado de items.js

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
        document.getElementById('quiz-title').innerHTML = '<i class="fa-solid fa-crown" style="color:gold"></i> VITÓRIA!';
        document.getElementById('quiz-question').textContent = "O Anel dos Quatro Reinos foi forjado. Sua aventura está completa!";
        document.getElementById('quiz-feedback').textContent = "Fim de Jogo. Parabéns, Herói!";

        const backButton = document.getElementById('quizBackButton');
        backButton.innerHTML = '<i class="fa-solid fa-house"></i> Voltar ao Menu Principal';
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
    // SHOP_ITEMS é carregado de items.js
    document.getElementById('shop-player-money').textContent = `Seu Ouro: ${gameState.money} 💰`;
    document.getElementById('shop-feedback').textContent = '';
    const shopList = document.getElementById('shop-items-list');
    shopList.innerHTML = '';

    console.log('[SHOP] Itens da Loja Renderizados.');

    // Organizar itens por categoria
    const categories = {
        consumable: { title: '💊 Consumíveis', items: [] },
        special: { title: '⭐ Itens Especiais', items: [] },
        warrior: { title: '⚔️ Equipamentos - Guerreiro', items: [] },
        mage: { title: '🔮 Equipamentos - Mago', items: [] },
        rogue: { title: '🗡️ Equipamentos - Ladino', items: [] },
        universal: { title: '🎖️ Equipamentos Universais', items: [] }
    };

    // Agrupar itens por categoria
    Object.entries(SHOP_ITEMS).forEach(([itemName, item]) => {
        if (item.phaseUnlock && item.phaseUnlock > gameState.currentPhase) {
            return;
        }
        const category = item.category || 'universal';
        if (categories[category]) {
            categories[category].items.push({ name: itemName, data: item });
        }
    });

    let html = '';

    // Renderizar cada categoria
    Object.values(categories).forEach(category => {
        if (category.items.length === 0) return;

        html += `
            <div class="shop-category">
                <h3 class="shop-category-title">${category.title}</h3>
                <div class="shop-items-grid">
        `;

        category.items.forEach(({ name, data }) => {
            const isEquipment = data.type === 'equipment';
            const isConsumable = data.type === 'consumable';
            const isDisabled = gameState.money < data.cost;

            let effectText = '';
            if (isConsumable) {
                if (data.effect === 'full_heal') {
                    effectText = 'Cura Total';
                } else {
                    effectText = `+${data.value} ${data.effect.includes('pv') ? 'PV' : 'MP'}`;
                }
            } else if (data.type === 'revive') {
                effectText = data.description;
            } else {
                effectText = `+${data.value} ${data.stat.toUpperCase()}`;
            }

            let inventoryCheck = '';
            let disabled = isDisabled;
            if (isEquipment && gameState.inventory.includes(name)) {
                disabled = true;
                inventoryCheck = `<div class="item-owned">✓ JÁ POSSUI</div>`;
            }

            const classTag = data.classRecommended ? `<div class="item-class-tag">📌 ${data.classRecommended}</div>` : '';

            html += `
                <div class="shop-item ${disabled ? 'shop-item-disabled' : ''}">
                    <div class="shop-item-emoji"><i class="${data.icon}"></i></div>
                    <div class="shop-item-name">${name}</div>
                    ${classTag}
                    <div class="shop-item-effect">${effectText}</div>
                    <div class="shop-item-price">${data.cost} 💰</div>
                    ${inventoryCheck}
                    <button class="rpg-button shop-buy-btn" onclick="buyItem('${name}')" ${disabled ? 'disabled' : ''}>
                        COMPRAR
                    </button>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    });

    shopList.innerHTML = html;
}

function buyItem(itemName) {
    // SHOP_ITEMS é carregado de items.js
    const item = SHOP_ITEMS[itemName];

    if (gameState.money < item.cost) {
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

const iconMap = {
    '⚔️': '<i class="fas fa-sword game-icon icon-sword"></i>',
    '🛡️': '<i class="fas fa-shield-alt game-icon icon-shield"></i>',
    '❤️': '<i class="fas fa-heart game-icon icon-heart"></i>',
    '✨': '<i class="fas fa-magic game-icon icon-magic"></i>',
    '💰': '<i class="fas fa-coins game-icon icon-gold"></i>',
    '☠️': '<i class="fas fa-skull-crossbones game-icon" style="color:#555"></i>',
    '🔍': '<i class="fas fa-search game-icon"></i>',
    '📦': '<i class="fas fa-box-open game-icon"></i>',
    '🔥': '<i class="fas fa-fire game-icon" style="color:orange"></i>',
    '🌊': '<i class="fas fa-water game-icon" style="color:blue"></i>',
    '🌪️': '<i class="fas fa-wind game-icon" style="color:skyblue"></i>',
    '⛰️': '<i class="fas fa-mountain game-icon" style="color:brown"></i>'
};

function formatGameText(text) {
    if (!text) return '';
    let formatted = text;

    // Bold text (**text**) -> <span class="highlight">text</span>
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<span class="highlight">$1</span>');

    // Replace emojis with icons
    Object.keys(iconMap).forEach(emoji => {
        formatted = formatted.split(emoji).join(iconMap[emoji]);
    });

    return formatted;
}

function updateGameText(text) {
    const gameTextDiv = document.getElementById('game-text');
    // Apply formatting
    const formattedHtml = formatGameText(text);

    gameTextDiv.innerHTML = `<p class="animated-text">${formattedHtml}</p>`;

    // Auto scroll to latest if needed (though usually we replace content)
}

function saveGame() {
    // SAVE_SLOT_KEY é carregado de config.js
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
        quizState: gameState.quizState,
        extraLives: gameState.extraLives,
        equippedRings: gameState.equippedRings
    });

    localStorage.setItem(SAVE_SLOT_KEY + gameState.saveSlot, dataToSave);
    showSaveFeedback();
}

function loadSlot(slotNum) {
    // SAVE_SLOT_KEY é carregado de config.js
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
    // MAX_SAVE_SLOTS é carregado de config.js
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
        gameState.phaseIntrosShown = gameState.phaseIntrosShown || [];
        gameState.extraLives = gameState.extraLives !== undefined ? gameState.extraLives : 3;
        gameState.equippedRings = gameState.equippedRings || { slot1: null, slot2: null, slot3: null, slot4: null };


        if (gameState.currentPhase === 5) {
            loadPhase(5);
        } else {
            loadPhase(gameState.currentPhase);
        }
    }
}

// =======================================================
// SELEÇÃO DE CLASSE
// =======================================================

function renderClassSelection() {
    // CLASSES é carregado de classes.js
    const classContainer = document.getElementById('class-selection');
    const classSideContent = document.getElementById('class-side-content');
    const classSideCard = document.getElementById('class-side-card');

    if (!classContainer) {
        console.error("Elemento 'class-selection' não encontrado no HTML!");
        return;
    }

    classContainer.innerHTML = '';

    // Configurar botão de fechar do card lateral
    const closeBtn = document.getElementById('close-class-card');
    if (closeBtn) {
        closeBtn.onclick = () => {
            classSideCard.classList.add('hidden');
            document.querySelectorAll('.class-card').forEach(c => c.classList.remove('selected'));
            selectedClass = null;
            document.getElementById('startGameButton').disabled = true;
        };
    }

    Object.keys(CLASSES).forEach(className => {
        const charClass = CLASSES[className];
        const card = document.createElement('div');
        card.className = 'class-card';
        card.onclick = () => selectClass(className, card);

        card.innerHTML = `
            <img src="${charClass.image}" alt="${className}">
            <h3>${className}</h3>
            <p style="font-size: 0.8em; color: #ccc;">${charClass.role}</p>
        `;

        classContainer.appendChild(card);
    });
}

function selectClass(className, cardElement) {
    // CLASSES é carregado de classes.js
    selectedClass = className;
    gameState.playerClass = className;

    // Highlight visual
    document.querySelectorAll('.class-card').forEach(c => c.classList.remove('selected'));
    cardElement.classList.add('selected');

    // Habilitar botão se nome estiver preenchido
    const nameInput = document.getElementById('playerName');
    if (nameInput && nameInput.value.trim() !== '') {
        document.getElementById('startGameButton').disabled = false;
    }

    // Mostrar detalhes no card lateral
    const classSideCard = document.getElementById('class-side-card');
    const classSideContent = document.getElementById('class-side-content');
    const charClass = CLASSES[className];
    const stats = charClass.baseStats;

    if (classSideCard && classSideContent) {
        classSideContent.innerHTML = `
            <img src="${charClass.image}" alt="${className}" class="side-card-image">
            <h2>${className}</h2>
            <p class="side-card-subtitle">${charClass.kingdom}</p>
            <p class="side-card-desc">${charClass.description}</p>
            
            <div class="side-card-stats">
                <div class="stat-row"><i class="fa-solid fa-heart" style="color:#ff7675;"></i> <span>PV: ${stats.pv}</span></div>
                <div class="stat-row"><i class="fa-solid fa-bolt" style="color:#74b9ff;"></i> <span>MP: ${stats.mp}</span></div>
                <div class="stat-row"><i class="fa-solid fa-hand-fist" style="color:#ffeaa7;"></i> <span>Atq: ${stats.attack}</span></div>
                <div class="stat-row"><i class="fa-solid fa-wand-magic-sparkles" style="color:#a29bfe;"></i> <span>Mag: ${stats.magic}</span></div>
                <div class="stat-row"><i class="fa-solid fa-shield-halved" style="color:#dfe6e9;"></i> <span>Def: ${stats.defense}</span></div>
                <div class="stat-row"><i class="fa-solid fa-wind" style="color:#55efc4;"></i> <span>Agi: ${stats.agility}</span></div>
            </div>

            <div class="side-card-attacks">
                <h3>Habilidades</h3>
                ${charClass.attacks.map(atk => `
                    <div class="attack-preview">
                        <i class="${atk.icon}"></i>
                        <div>
                            <strong>${atk.name}</strong>
                            <span style="font-size:0.8em; opacity:0.8;">(${atk.cost > 0 ? atk.cost + ' MP' : 'Grátis'})</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        classSideCard.classList.remove('hidden');
    }
}

// =======================================================
// LORE SEQUENCE E PHASE INTRO
// =======================================================

/**
 * Exibe sequencialmente as 5 imagens de lore após criar personagem
 */
function showLoreSequence() {
    const loreImages = [
        'assets/images/lore do rpg/parte 1.jpeg',
        'assets/images/lore do rpg/parte 2.jpeg',
        'assets/images/lore do rpg/parte 3.jpeg',
        'assets/images/lore do rpg/parte 4.png',
        'assets/images/lore do rpg/parte 5.png'
    ];

    let currentIndex = 0;

    // Cria overlay de lore
    const overlay = document.createElement('div');
    overlay.id = 'lore-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: fadeIn 0.5s;
    `;

    const img = document.createElement('img');
    img.style.cssText = `
        max-width: 90%;
        max-height: 80%;
        border: 3px solid #9d4edd;
        box-shadow: 0 0 30px rgba(157, 77, 237, 0.6);
        animation: slideIn 0.5s;
        border-radius: 8px;
    `;

    const instructions = document.createElement('div');
    instructions.style.cssText = `
        margin-top: 20px;
        color: #9d4edd;
        font-size: 18px;
        text-align: center;
    `;
    instructions.innerHTML = 'Clique ou pressione ESPAÇO para continuar (1/5)';

    overlay.appendChild(img);
    overlay.appendChild(instructions);
    document.body.appendChild(overlay);

    function showNextImage() {
        if (currentIndex >= loreImages.length) {
            overlay.remove();
            // Após lore, mostrar intro da fase 1 e iniciar o jogo
            gameState.phaseIntrosShown = gameState.phaseIntrosShown || [];
            gameState.phaseIntrosShown.push(1); // Marcar fase 1 como vista

            showPhaseIntro(1, () => {
                // Agora iniciar a fase 1 diretamente
                loadPhase(1);
            });
            return;
        }

        img.src = loreImages[currentIndex];
        instructions.innerHTML = `Clique ou pressione ESPAÇO para continuar (${currentIndex + 1}/${loreImages.length})`;
        currentIndex++;
    }

    showNextImage();

    const nextImage = () => {
        showNextImage();
    };

    overlay.addEventListener('click', nextImage);
    document.addEventListener('keydown', function handleKeyPress(e) {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            if (currentIndex >= loreImages.length) {
                document.removeEventListener('keydown', handleKeyPress);
            } else {
                nextImage();
            }
        }
    });
}

/**
 * Exibe imagem de introdução da fase
 */
function showPhaseIntro(phaseNum, callback) {
    const phaseIntroImages = {
        1: 'assets/images/inicios de fases/inicios de fases/imagem de inicio fase1.png',
        2: 'assets/images/inicios de fases/inicios de fases/imagem de inicio fase 2.png',
        3: 'assets/images/inicios de fases/inicios de fases/imagem de inicio fase 3.png',
        4: 'assets/images/inicios de fases/inicios de fases/imagem de inicio fase 4.png',
        5: 'assets/images/inicios de fases/inicios de fases/imagem de inicio fase 5.png',
        6: 'assets/images/inicios de fases/inicios de fases/imagem de inicio fase 6.png',
        7: 'assets/images/inicios de fases/inicios de fases/imagem de inicio fase 7.png',
        8: 'assets/images/inicios de fases/inicios de fases/inicio quis imagem.png'
    };

    const imageUrl = phaseIntroImages[phaseNum];
    if (!imageUrl) {
        if (callback) callback();
        return;
    }

    const overlay = document.createElement('div');
    overlay.id = 'phase-intro-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        animation: fadeIn 0.5s;
    `;

    const img = document.createElement('img');
    img.src = imageUrl;
    img.style.cssText = `
        max-width: 90%;
        max-height: 85%;
        border: 3px solid #9d4edd;
        box-shadow: 0 0 30px rgba(157, 77, 237, 0.6);
        animation: scaleIn 0.7s;
        border-radius: 8px;
    `;

    const instructions = document.createElement('div');
    instructions.style.cssText = `
        margin-top: 20px;
        color: #9d4edd;
        font-size: 20px;
        text-align: center;
        font-weight: bold;
    `;
    instructions.innerHTML = 'Clique ou pressione ESPAÇO para iniciar a fase';

    overlay.appendChild(img);
    overlay.appendChild(instructions);
    document.body.appendChild(overlay);

    const closeIntro = () => {
        overlay.remove();
        if (callback) callback();
    };

    overlay.addEventListener('click', closeIntro);
    document.addEventListener('keydown', function handleKeyPress(e) {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            document.removeEventListener('keydown', handleKeyPress);
            closeIntro();
        }
    });
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

    // Exibir sequência de lore antes de começar o jogo
    showLoreSequence();
}

function loadPhase(phaseNum) {
    // PHASES é carregado de maps.js
    gameState.currentPhase = phaseNum;

    // IMPORTANTE: Zerar o contador de kills ao mudar de fase
    gameState.enemyKills = 0;
    gameState.mobsDefeatedInPhase = 0;
    gameState.defeatedMobNames = []; // Resetar rastreamento de nomes
    console.log(`[LOAD PHASE] Entrando na Fase ${phaseNum}. Kills/Nomes resetados.`);

    const phase = PHASES[phaseNum];
    if (!phase) {
        changeScreen('game-play');
        document.getElementById('game-text').innerHTML = "<h1>🎉 PARABÉNS! Você Venceu o Jogo! 🎉</h1>";
        document.getElementById('action-buttons').innerHTML = `<button class="rpg-button menu-button" onclick="changeScreen('title-screen')">🏠 Voltar ao Menu Principal</button>`;
        return;
    }

    // Garantir que phaseIntrosShown existe
    if (!gameState.phaseIntrosShown) {
        gameState.phaseIntrosShown = [];
    }

    // Exibir imagem de introdução da fase apenas na primeira vez
    const showIntro = !gameState.phaseIntrosShown.includes(phaseNum);

    if (showIntro) {
        gameState.phaseIntrosShown.push(phaseNum);
        showPhaseIntro(phaseNum, () => {
            loadPhaseContent(phaseNum, phase);
        });
    } else {
        loadPhaseContent(phaseNum, phase);
    }
}

function loadPhaseContent(phaseNum, phase) {
    changeScreen('game-play');

    updatePlayerStatus();
    updatePlayerPosition();

    const scenarioDiv = document.getElementById('scenario-image');
    scenarioDiv.style.backgroundImage = `url('${phase.scenarioImage}')`;

    checkAndRemoveExpiredBuffs();

    if (phase.type === 'quiz_final') {
        updateGameText(phase.introText);
        setTimeout(() => startFinalQuiz(), 2000);
        return;
    }

    if (!combatState.active && !gameState.quizState.inQuizScreen) {
        const gameTextDiv = document.getElementById('game-text');
        const requiredKills = phase.requiredKills || 3;
        const bossName = phase.bossName;
        // Pegar o nome do anel que o boss dropa (primeira chave do dropTable)
        const bossDropItem = bossName && ENEMIES[bossName]?.dropTable
            ? Object.keys(ENEMIES[bossName].dropTable)[0]
            : null;

        gameTextDiv.innerHTML = `
            <h3>📍 Fase ${phaseNum}: ${phase.name}</h3>
            <p>${formatGameText(phase.introText)}</p>
            <p><strong>⚔️ Objetivo:</strong> Derrote ${requiredKills} inimigos para enfrentar o Boss!</p>
            <p><strong>📊 Progresso:</strong> ${gameState.enemyKills}/${requiredKills} inimigos derrotados</p>
            <div style="text-align: center; margin: 10px 0; padding: 10px; background: rgba(157, 77, 237, 0.1); border-radius: 8px;">
                <p style="font-size: 0.9em; margin: 0;">📊 <strong>Progresso Fase ${gameState.currentPhase}:</strong> Kills: ${gameState.enemyKills}/3 • Boss: ${gameState.isBossActive || (bossDropItem && gameState.inventory.includes(bossDropItem)) ? '✅' : '❌'}</p>
            </div>
            ${gameState.enemyKills >= requiredKills ? '<p style="color: #4CAF50; font-weight: bold;">✅ Boss liberado! 70% chance aparecer!</p>' : '<p><strong>💡 Dica:</strong> Mate 3 inimigos para liberar boss</p>'}
        `;

        renderExplorationActions();

        // Render Mobs on Map
        setTimeout(() => spawnMobsOnMap(), 500);
    } else {
        renderCombatStatus();
        renderCombatActions();
    }
}

// NOVO: Função para mostrar os 3 mobs (ou Boss) na tela
function spawnMobsOnMap() {
    const mapContainer = document.getElementById('map-mobs');
    if (!mapContainer) return;
    mapContainer.innerHTML = '';

    // Se Boss está ativo
    if (gameState.isBossActive) {
        const bossName = PHASES[gameState.currentPhase].bossName;
        const bossData = ENEMIES[bossName];
        if (!bossData) return;

        const bossEl = document.createElement('div');
        bossEl.classList.add('mob-sprite-map', 'boss-active'); // Usa classe CSS
        bossEl.style.backgroundImage = `url('${bossData.image}')`;
        bossEl.style.left = '50%';
        bossEl.style.bottom = '10%'; // Garante posição base
        bossEl.style.transform = 'translate(-50%, 0)'; // Centraliza horizontalmente
        bossEl.title = `BOSS: ${bossName}`;

        bossEl.onclick = () => {
            if (!combatState.active) {
                updateGameText(`⚔️ **${bossName}** ruge! Prepare-se para a batalha final da fase!`);
                startCombat(bossName);
            }
        };

        // Remove estilos inline conflitantes para usar CSS
        bossEl.style.position = 'absolute';
        bossEl.style.backgroundSize = 'contain';
        bossEl.style.backgroundRepeat = 'no-repeat';

        mapContainer.appendChild(bossEl);
        return;
    }

    const phase = PHASES[gameState.currentPhase];
    if (!phase) return;

    // Filtra mobs que já estão na lista de derrotados
    let defeatedCount = 0;
    if (gameState.defeatedMobNames) {
        defeatedCount = gameState.defeatedMobNames.length;
    }

    phase.enemies.forEach((mobName, index) => {
        if (gameState.defeatedMobNames && gameState.defeatedMobNames.includes(mobName)) return;

        const mobData = ENEMIES[mobName];
        if (!mobData) return;

        const mobEl = document.createElement('div');
        mobEl.classList.add('mob-sprite-map');
        mobEl.style.backgroundImage = `url('${mobData.image}')`;

        // Espaçamento dinâmico
        const leftPos = 20 + ((index) * 25);
        mobEl.style.left = `${leftPos}%`;
        mobEl.style.bottom = '5%';
        mobEl.title = mobName;

        mobEl.onclick = () => {
            if (!combatState.active) {
                updateGameText(`⚔️ Você desafiou **${mobName}**!`);
                startCombat(mobName);
            }
        };

        // Remove estilos inline que travavam tamanho
        mobEl.style.position = 'absolute';
        mobEl.style.backgroundSize = 'contain';
        mobEl.style.backgroundRepeat = 'no-repeat';

        mapContainer.appendChild(mobEl);
    });

    saveGame();
}

function exploreArea() {
    if (combatState.active) return;

    if (triggerRandomQuiz()) {
        return;
    }

    // VERIFICAR SE BOSS DEVE APARECER (70% chance após 3 kills)
    const phase = PHASES[gameState.currentPhase];
    const bossName = phase?.bossName;
    const killsNeeded = phase?.killsToBoss || 999;
    const bossDropItem = ENEMIES[bossName]?.dropTable
        ? Object.keys(ENEMIES[bossName].dropTable)[0]
        : null;

    // Se matou 3+ inimigos E ainda não tem o anel do boss
    if (gameState.enemyKills >= killsNeeded && !gameState.inventory.includes(bossDropItem)) {
        const bossChance = Math.random();
        if (bossChance <= 0.7) { // 70% de chance
            updateGameText(`⚔️ ⚡ O BOSS **${bossName}** apareceu! Este é o momento decisivo!`);
            gameState.isBossActive = true;
            startCombat(bossName);
            return;
        } else {
            updateGameText(`🌫️ Você sente uma presença poderosa próxima... mas ela desaparece. Continue explorando!`);
            setTimeout(() => renderExplorationActions(), 1500);
            return;
        }
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

        updateGameText(`📦 Você encontrou um pequeno baú abandonado. Dentro havia uma **${foundItem.name}** <i class="${foundItem.icon}"></i>!`);
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

        updateGameText(`Você encontrou um tesouro escondido! Dentro havia uma **${foundItem.name}** <i class="${foundItem.icon}"></i>!`);
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
    const actionsDiv = document.getElementById('action-buttons');
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

    // Primeiro mostrar apenas texto por 2 segundos
    gameTextDiv.innerHTML = `
        <h1 style="color: #ff3333; text-shadow: 2px 2px 4px #000;">☠️ GAME OVER ☠️</h1>
        <p style="font-size: 1.2em; animation: fadeIn 2s;">Analisando situação...</p>
    `;
    actionsDiv.innerHTML = `<p style="color: #888; text-align: center;">⏳ Preparando opções... (ESC para explorar)</p>`;

    setTimeout(() => {
        const livesLeft = gameState.extraLives || 0;

        if (livesLeft === 3) {
            // 1ª morte - mesma fase
            gameState.extraLives--;
            gameTextDiv.innerHTML = `
                <h1 style="color: #ff3333;">☠️ GAME OVER ☠️</h1>
                <p>Você foi derrotado...</p>
                <p style="color: #4CAF50; font-weight: bold;">❤️ Vidas: ${livesLeft - 1}</p>
                <p style="color: #888; font-size: 0.8em;">💡 ESC para continuar explorando</p>
            `;
            actionsDiv.innerHTML = `
                <button onclick="loadPhase(gameState.currentPhase)" class="rpg-button game-over-btn revive-btn"><i class="fa-solid fa-heart-pulse"></i> REVIVER MESMA FASE</button>
                <button onclick="changeScreen('title-screen')" class="rpg-button game-over-btn home-btn"><i class="fa-solid fa-house"></i> Menu</button>
                <button onclick="closeGameOverAndExplore()" class="rpg-button game-over-btn explore-btn-go"><i class="fa-solid fa-person-hiking"></i> Continuar Explorando</button>
            `;
        } else if (livesLeft === 2) {
            // 2ª morte - fase anterior  
            gameState.extraLives--;
            gameTextDiv.innerHTML = `
                <h1 style="color: #ff3333;">☠️ GAME OVER ☠️</h1>
                <p>⚠️ Penalidade: Voltará uma fase!</p>
                <p style="color: #FF9800; font-weight: bold;">❤️ Vidas: ${livesLeft - 1}</p>
            `;
            actionsDiv.innerHTML = `
                <button onclick="loadPhase(Math.max(1, gameState.currentPhase - 1))" class="rpg-button game-over-btn warning-btn"><i class="fa-solid fa-backward"></i> VOLTAR UMA FASE</button>
                <button onclick="changeScreen('title-screen')" class="rpg-button game-over-btn home-btn"><i class="fa-solid fa-house"></i> Menu</button>
                <button onclick="closeGameOverAndExplore()" class="rpg-button game-over-btn explore-btn-go"><i class="fa-solid fa-person-hiking"></i> Continuar Explorando</button>
            `;
        } else if (livesLeft === 1) {
            // 3ª morte - fase 1
            gameState.extraLives--;
            gameTextDiv.innerHTML = `
                <h1 style="color: #ff3333;">☠️ GAME OVER ☠️</h1>
                <p>☠️ Penalidade Máxima: Fase 1!</p>
                <p style="color: #ff3333; font-weight: bold;">⚠️ Última Vida!</p>
            `;
            actionsDiv.innerHTML = `
                <button onclick="loadPhase(1)" class="rpg-button game-over-btn danger-btn"><i class="fa-solid fa-rotate-left"></i> VOLTAR À FASE 1</button>
                <button onclick="changeScreen('title-screen')" class="rpg-button game-over-btn home-btn"><i class="fa-solid fa-house"></i> Menu</button>
                <button onclick="closeGameOverAndExplore()" class="rpg-button game-over-btn explore-btn-go"><i class="fa-solid fa-person-hiking"></i> Continuar Explorando</button>
            `;
        } else {
            gameTextDiv.innerHTML = `<h1 style="color: #ff3333;">☠️ GAME OVER FINAL ☠️</h1><p>Sem mais vidas!</p>`;
            actionsDiv.innerHTML = `<button onclick="changeScreen('title-screen')" class="rpg-button game-over-btn home-btn"><i class="fa-solid fa-house"></i> Menu</button>`;
        }
    }, 2000);
}

function showFinalVictory() {
    const gameTextDiv = document.getElementById('game-text');
    const actionsDiv = document.getElementById('action-buttons');
    const scenarioDiv = document.getElementById('scenario-image');

    // PARAR O COMBATE COMPLETAMENTE
    combatState.active = false;
    if (combatState.chaseLoop) {
        clearInterval(combatState.chaseLoop);
        combatState.chaseLoop = null;
    }

    // Mostrar imagem do troféu final
    scenarioDiv.style.backgroundImage = "url('assets/images/victory/final_torphy.png')";
    scenarioDiv.style.backgroundSize = "contain";
    scenarioDiv.style.backgroundPosition = "center";

    // Limpar mobs do mapa
    const mapMobsContainer = document.getElementById('map-mobs');
    if (mapMobsContainer) mapMobsContainer.innerHTML = '';

    // Esconder personagem e inimigo
    document.getElementById('player-figure').style.display = 'none';
    document.getElementById('enemy-figure').style.display = 'none';

    // Notificação épica
    setTimeout(() => {
        showNotification(`🏆 VITÓRIA FINAL! 🏆<br>Você salvou os Quatro Reinos!`, 5000);
    }, 500);

    gameTextDiv.innerHTML = `
        <h1 style="color: #FFD700; text-shadow: 3px 3px 6px #000, 0 0 20px #FFD700;">🏆 VITÓRIA ÉPICA! 🏆</h1>
        <h2 style="color: #4CAF50;">O Guardião Final foi Derrotado!</h2>
        <p style="font-size: 1.3em; color: #fff;">👑 <strong>O Anel dos Quatro Reinos brilha em suas mãos!</strong> 👑</p>
        <p style="font-size: 1.1em; margin-top: 20px;">Os reinos estão salvos graças à sua coragem e determinação.</p>
        <p style="font-size: 1.1em;">Você é um verdadeiro HERÓI!</p>
        <br>
        <p style="color: #FFD700; font-size: 1.2em;">✨ <strong>Obrigado por jogar!</strong> ✨</p>
        <p style="font-size: 0.9em; opacity: 0.8;">Desenvolvido com ❤️ por Paulo Roberto do Nascimento</p>
    `;

    actionsDiv.innerHTML = `
        <button class="rpg-button" onclick="changeScreen('title-screen')" style="background: linear-gradient(135deg, #FFD700, #FFA500); color: #000; font-weight: bold; font-size: 1.2em; padding: 15px 30px; margin: 10px; box-shadow: 0 4px 15px rgba(255, 215, 0, 0.5); flex-basis: 100%;">
            🏰 Voltar ao Menu Principal
        </button>
    `;

    updatePlayerStatus();
}

function deleteSlot(slotNum) {
    // SAVE_SLOT_KEY é carregado de config.js
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
            <span><i class="fa-solid fa-heart" ></i> ${classData.baseStats.pv}</span>
            <span><i class="fa-solid fa-bolt" ></i> ${classData.baseStats.mp}</span>
            <span><i class="fa-solid fa-hand-fist" ></i> ${classData.baseStats.attack}</span>
        `;

        card.appendChild(img);
        card.appendChild(name);
        card.appendChild(stats);

        card.addEventListener('click', (ev) => selectClass(className, ev.currentTarget));

        classSelectionDiv.appendChild(card);
    });
}

function selectClass(className, clickedElem) {
    // CLASSES é carregado de classes.js
    selectedClass = className;
    const details = CLASSES[className];
    const detailsDiv = document.getElementById('class-details');
    const sideCard = document.getElementById('class-side-card');
    const sideContent = document.getElementById('class-side-content');
    const startGameButton = document.getElementById('startGameButton');

    const statsList = Object.entries(details.baseStats).map(([key, value]) =>
        `<li><i class="fa-solid fa-caret-right"></i> <strong>${key.toUpperCase()}</strong>: ${value}</li>`
    ).join('');

    const attackList = details.attacks && details.attacks.length > 0 ? details.attacks.map(attack =>
        `<li><i class="${attack.icon} attack-icon-small"></i> <strong>${attack.name}</strong>: ${attack.description}</li>`
    ).join('') : '<li>Sem ataques iniciais definidos.</li>';


    const sideHtml = `
        <div style="display:flex; gap:12px; align-items:flex-start;">
            <img src="${details.image}" alt="${className}" class="class-visual">
            <div style="text-align:left;">
                <h3 style="margin-top:0;">${className}</h3>
                <p><strong>🎭 Nome:</strong> ${details.characterName}</p>
                <p><strong>🏰 Reino de Origem:</strong> ${details.kingdom}</p>
                <p><strong>⚔️ Função:</strong> ${details.role}</p>
                <p style="margin-top:8px;"><strong>Descrição:</strong> ${details.description}</p>
            </div>
        </div>
        <hr style="border:0;border-top:1px solid rgba(157,77,237,0.12);margin:10px 0;">
        <h4>Atributos Iniciais:</h4>
        <ul>${statsList}</ul>
        <h4>Ataques Iniciais:</h4>
        <ul>${attackList}</ul>
    `;

    // Preencher e mostrar o card lateral
    if (sideContent) sideContent.innerHTML = sideHtml;
    if (sideCard) {
        sideCard.classList.remove('hidden');

        // posicionar o card ao lado do elemento clicado quando houver espaço (desktop)
        const container = document.querySelector('.class-creation-row');
        const target = clickedElem || document.querySelector(`[data-class="${className}"]`);

        // esconder temporariamente enquanto medimos
        sideCard.style.visibility = 'hidden';
        sideCard.style.display = 'block';

        if (container && target && window.innerWidth > 840) {
            const containerRect = container.getBoundingClientRect();
            const targetRect = target.getBoundingClientRect();
            const cardWidth = sideCard.offsetWidth;
            const cardHeight = sideCard.offsetHeight;

            let top = targetRect.top - containerRect.top;
            // ajustar caso transborde verticalmente
            if (top + cardHeight > containerRect.height) {
                top = Math.max(0, containerRect.height - cardHeight);
            }

            let left = targetRect.right - containerRect.left + 12;
            // se não couber à direita, tentar à esquerda
            if (left + cardWidth > containerRect.width) {
                left = targetRect.left - containerRect.left - cardWidth - 12;
                if (left < 0) {
                    left = Math.max(0, containerRect.width - cardWidth);
                }
            }

            sideCard.style.position = 'absolute';
            sideCard.style.left = left + 'px';
            sideCard.style.top = top + 'px';
            sideCard.style.width = sideCard.style.width || '';
        } else {
            // em telas pequenas, usar comportamento empilhado/responsivo
            sideCard.style.position = 'relative';
            sideCard.style.left = 'auto';
            sideCard.style.top = 'auto';
            sideCard.style.width = '100%';
        }

        sideCard.style.visibility = 'visible';
    }

    // Manter o legacy details div escondido (aparece apenas em mobile)
    detailsDiv.style.display = 'none';

    document.querySelectorAll('.class-card').forEach(card => card.classList.remove('selected'));
    document.querySelector(`[data-class="${className}"]`).classList.add('selected');

    if (document.getElementById('playerName').value.trim() !== '') {
        startGameButton.disabled = false;
    }
}

// Fechar o card lateral quando solicitado
document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'close-class-card') {
        const sideCard = document.getElementById('class-side-card');
        if (sideCard) sideCard.classList.add('hidden');
    }
});

// Reposicionar o card ao redimensionar a janela (se estiver aberto)
window.addEventListener('resize', () => {
    const sideCard = document.getElementById('class-side-card');
    if (sideCard && !sideCard.classList.contains('hidden') && selectedClass) {
        const target = document.querySelector(`[data-class="${selectedClass}"]`);
        if (target) selectClass(selectedClass, target);
    }
});

function startNewGameSlot(slotNum) {
    // Reinicia o objeto global gameState
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
    if (item.effect && typeof item.effect === 'string' && item.effect.includes('_temp')) {
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
    // SHOP_ITEMS é carregado de items.js
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
    // SHOP_ITEMS é carregado de items.js
    changeScreen('game-play');

    // Gerar slots de anéis
    let ringSlotsHtml = '<div style="background: #2c3e50; padding: 15px; margin: 10px 0; border-radius: 10px; border: 2px solid #34495e;"><h4 style="color: #e74c3c; margin-bottom: 10px;">💍 SLOTS DE ANÉIS (4/4)</h4><div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">';

    const slots = ['slot1', 'slot2', 'slot3', 'slot4'];
    slots.forEach((slot, index) => {
        const equippedRing = gameState.equippedRings[slot];
        const slotNumber = index + 1;

        if (equippedRing) {
            const ring = BOSS_RINGS[equippedRing];
            ringSlotsHtml += `
                <div style="background: #8e44ad; padding: 8px; border-radius: 8px; text-align: center; border: 2px solid #9b59b6;">
                    <div style="font-size: 1.2em;">${ring ? `<i class="${ring.icon}"></i>` : '<i class="fa-solid fa-ring"></i>'} <strong>SLOT ${slotNumber}</strong></div>
                    <div style="font-size: 0.9em; color: #ecf0f1;">${equippedRing}</div>
                    <button onclick="unequipRing('${slot}')" style="background: #e74c3c; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 0.7em; margin-top: 5px;">❌ Remover</button>
                </div>`;
        } else {
            ringSlotsHtml += `
                <div style="background: #34495e; padding: 8px; border-radius: 8px; text-align: center; border: 2px dashed #7f8c8d;">
                    <div style="color: #bdc3c7;">⭕ SLOT ${slotNumber}</div>
                    <div style="font-size: 0.8em; color: #95a5a6;">Vazio</div>
                </div>`;
        }
    });

    ringSlotsHtml += '</div></div>';

    let inventoryList = '';

    if (gameState.inventory.length > 0) {
        inventoryList = gameState.inventory.map(item => {
            const shopItem = SHOP_ITEMS[item];
            let icon = '';
            let equipped = '';
            let useButton = '';

            if (shopItem) {
                icon = shopItem.icon ? `<i class="${shopItem.icon}"></i>` : '';
                if (shopItem.type === 'equipment') {
                    equipped = ' ⚡ <span style="color: #4CAF50;">(Equipado)</span>';
                } else if (shopItem.type === 'consumable') {
                    useButton = `<button class="rpg-button" style="margin-left: 10px; padding: 5px 10px; font-size: 0.8em;" onclick="useInventoryItem('${item}')">Usar</button>`;
                } else if (shopItem.type === 'revive') {
                    equipped = ' 💫 <span style="color: #e74c3c;">(Passivo)</span>';
                }
            }

            // Check if it's a ring
            if (BOSS_RINGS[item]) {
                icon = `<i class="${BOSS_RINGS[item].icon}"></i>`;
                const isEquipped = Object.values(gameState.equippedRings).includes(item);
                if (isEquipped) {
                    equipped = ' ✨ <span style="color: #9d4edd;">(Equipado)</span>';
                    useButton = `<button class="rpg-button" style="margin-left: 10px; padding: 5px 10px; font-size: 0.8em; background: #e74c3c;" onclick="unequipRingByName('${item}')">❌ Desequipar</button>`;
                } else {
                    equipped = ' 💍 <span style="color: #f39c12;">(No Inventário)</span>';
                    useButton = `<button class="rpg-button" style="margin-left: 10px; padding: 5px 10px; font-size: 0.8em; background: #8e44ad;" onclick="equipRing('${item}')">✨ Equipar</button>`;
                }
            }

            return `<li style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; padding: 8px; background: #34495e; border-radius: 5px;">
                <span>${icon} ${item}${equipped}</span>
                <span>${useButton}</span>
            </li>`;
        }).join('');
    } else {
        inventoryList = '<li style="color: #888;">Inventário Vazio.</li>';
    }

    const inventoryText = `
        <h3>🎒 Inventário de ${gameState.playerName}</h3>
        ${ringSlotsHtml}
        <div style="background: #2c3e50; padding: 15px; margin: 10px 0; border-radius: 10px; border: 2px solid #34495e;">
            <h4 style="color: #3498db; margin-bottom: 10px;">📦 ITENS</h4>
            <ul style="list-style: none; padding: 0; text-align: left;">${inventoryList}</ul>
        </div>
        <p style="font-size: 1.2em; color: #f7b731;">💰 Você tem <strong>${gameState.money} Ouro</strong></p>
        <p style="font-size: 0.9em; color: #888;">Total de itens: ${gameState.inventory.length}</p>
    `;
    updateGameText(inventoryText);

    const actionButtons = document.getElementById('action-buttons');

    // Se estiver em combate, mostrar botão para voltar ao combate
    if (combatState.active) {
        actionButtons.innerHTML = `
            <button onclick="renderCombatStatus(); renderCombatActions();" class="rpg-button menu-button" style="flex-basis: 100%;">↩️ Voltar ao Combate</button>
        `;
    } else {
        actionButtons.innerHTML = `
            <button onclick="loadPhase(gameState.currentPhase)" class="rpg-button menu-button">↩️ Voltar à Exploração</button>
            <button onclick="saveGame()" class="rpg-button">💾 Salvar Jogo</button>
        `;
    }
}

function useInventoryItem(itemName) {
    const item = SHOP_ITEMS[itemName];

    if (!item || item.type !== 'consumable') {
        updateGameText(`⚠️ ${itemName} não pode ser usado agora.`);
        return;
    }

    // Aplicar efeito do item
    if (item.effect === 'full_heal') {
        gameState.playerStats.pv_current = gameState.playerStats.pv;
        gameState.playerStats.mp_current = gameState.playerStats.mp;
        updateGameText(`✨ Você usou ${itemName}! PV e MP totalmente restaurados!`);
    } else if (item.effect === 'pv_current') {
        const healed = Math.min(item.value, gameState.playerStats.pv - gameState.playerStats.pv_current);
        gameState.playerStats.pv_current = Math.min(gameState.playerStats.pv_current + item.value, gameState.playerStats.pv);
        updateGameText(`❤️ Você usou ${itemName}! Recuperou ${healed} PV.`);
    } else if (item.effect === 'mp_current') {
        const recovered = Math.min(item.value, gameState.playerStats.mp - gameState.playerStats.mp_current);
        gameState.playerStats.mp_current = Math.min(gameState.playerStats.mp_current + item.value, gameState.playerStats.mp);
        updateGameText(`✨ Você usou ${itemName}! Recuperou ${recovered} MP.`);
    } else if (item.effect === 'buff_attack') {
        addBuff({ type: 'attack', value: item.value, duration: 3 });
        updateGameText(`🔥 Você usou ${itemName}! ATK aumentado em ${item.value} por 3 turnos!`);
    } else if (item.effect === 'buff_defense') {
        addBuff({ type: 'defense', value: item.value, duration: 3 });
        updateGameText(`🛡️ Você usou ${itemName}! DEF aumentado em ${item.value} por 3 turnos!`);
    } else if (item.effect === 'buff_agility') {
        addBuff({ type: 'agility', value: item.value, duration: 3 });
        updateGameText(`⚡ Você usou ${itemName}! AGI aumentado em ${item.value} por 3 turnos!`);
    } else if (item.effect === 'buff_magic') {
        addBuff({ type: 'magic', value: item.value, duration: 3 });
        updateGameText(`🔮 Você usou ${itemName}! MAG aumentado em ${item.value} por 3 turnos!`);
    } else if (item.effect === 'buff_pv_max') {
        addBuff({ type: 'pv', value: item.value, duration: 999 });
        gameState.playerStats.pv_current += item.value;
        updateGameText(`💖 Você usou ${itemName}! PV máximo aumentado em ${item.value}!`);
    } else if (item.effect === 'buff_mp_max') {
        addBuff({ type: 'mp', value: item.value, duration: 999 });
        gameState.playerStats.mp_current += item.value;
        updateGameText(`💫 Você usou ${itemName}! MP máximo aumentado em ${item.value}!`);
    } else if (item.effect === 'damage_enemy') {
        if (combatState.active) {
            combatState.enemyStats.pv_current -= item.value;
            updateGameText(`💥 Você usou ${itemName}! Causou ${item.value} de dano direto no inimigo!`);
            showFloatingDamage(-item.value, 'enemy-figure');
            renderCombatStatus();

            // Verificar se inimigo morreu
            if (combatState.enemyStats.pv_current <= 0) {
                setTimeout(() => onEnemyDefeated(combatState.enemyName), 800);
            }
        } else {
            updateGameText(`⚠️ ${itemName} só pode ser usado em combate!`);
            return; // Não remover item se não estiver em combate
        }
    } else if (item.effect === 'buff_critical') {
        addBuff({ type: 'critical', value: item.value, duration: 3 });
        updateGameText(`🍀 Você usou ${itemName}! Chance de crítico aumentada em ${item.value}% por 3 turnos!`);
    } else if (item.effect === 'restore_skills') {
        gameState.playerStats.mp_current = Math.min(gameState.playerStats.mp_current + item.value, gameState.playerStats.mp);
        updateGameText(`📜 Você usou ${itemName}! Recuperou ${item.value} MP!`);
    } else if (item.effect === 'buff_all_stats') {
        addBuff({ type: 'attack', value: item.value, duration: 5 });
        addBuff({ type: 'defense', value: item.value, duration: 5 });
        addBuff({ type: 'magic', value: item.value, duration: 5 });
        addBuff({ type: 'agility', value: item.value, duration: 5 });
        updateGameText(`🐉 Você usou ${itemName}! TODOS os atributos aumentados em ${item.value} por 5 turnos!`);
    } else if (item.effect === 'berserker') {
        addBuff({ type: 'attack', value: item.value, duration: 3 });
        addBuff({ type: 'defense', value: -5, duration: 3 });
        updateGameText(`👿 Você usou ${itemName}! ATK +${item.value}, mas DEF -5 por 3 turnos!`);
    } else if (item.effect === 'blessing') {
        if (!gameState.blessingActive) gameState.blessingActive = 0;
        gameState.blessingActive = 1;
        updateGameText(`✨ Você usou ${itemName}! Bênção Divina ativa - próximo ataque inimigo falhará!`);
    }

    // Remover item do inventário
    const index = gameState.inventory.indexOf(itemName);
    if (index > -1) {
        gameState.inventory.splice(index, 1);
    }

    updatePlayerStatus();
    saveGame();

    // Se estiver em combate, disparar turno do inimigo após usar item
    if (combatState.active) {
        setTimeout(() => {
            renderCombatStatus();
            enemyTurn();
        }, 1500);
    } else {
        // Fora de combate, apenas atualizar inventário
        setTimeout(() => showInventory(), 1500);
    }
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
    document.getElementById('newGameButton').addEventListener('click', () => {
        changeScreen('character-creation');
        renderClassSelection(); // GARANTE que o render aconteça
    });

    // SISTEMA DE LOAD NO MENU
    const loadGameButton = document.getElementById('loadGameButton');
    const hasSave = localStorage.getItem(`${SAVE_SLOT_KEY}1`);

    if (loadGameButton) {
        if (hasSave) {
            loadGameButton.disabled = false;
            loadGameButton.style.opacity = '1';
            loadGameButton.addEventListener('click', () => {
                loadGame(1);
            });
            // Adicionar tooltip ou texto indicando que há save
            loadGameButton.title = "Carregar jogo salvo";
        } else {
            loadGameButton.disabled = true;
            loadGameButton.style.opacity = '0.5';
            loadGameButton.title = "Nenhum jogo salvo encontrado";
        }
    }

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
                case 'l': // Loja
                    enterShop();
                    break;
                case 'p': // Salvar (Save)
                    saveGame();
                    showNotification('💾 Jogo Salvo!', 2000);
                    break;
            }
        }
        // Combat controls with numbers, QWER and space
        else if (document.getElementById('game-play').classList.contains('active-screen') && combatState.active) {
            if (event.key === ' ') {
                event.preventDefault();
                attemptToJump();
            } else if (event.key >= '1' && event.key <= '9') {
                const attackIndex = parseInt(event.key) - 1;
                if (gameState.playerAttacks[attackIndex]) {
                    handlePlayerAttack(gameState.playerAttacks[attackIndex]);
                }
            } else if (['q', 'w', 'e', 'r'].includes(event.key.toLowerCase())) {
                const keyMap = { 'q': 0, 'w': 1, 'e': 2, 'r': 3 };
                const attackIndex = keyMap[event.key.toLowerCase()];
                if (gameState.playerAttacks[attackIndex]) {
                    handlePlayerAttack(gameState.playerAttacks[attackIndex]);
                }
            } else if (event.key.toLowerCase() === 'f' || event.key === 'Escape') {
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
// SISTEMA DE SAVE / LOAD
// =======================================================

function saveGame() {
    if (!gameState.playerClass) return; // Proteção contra salvar estado vazio

    // Forçar slot 1 por enquanto (simples)
    gameState.saveSlot = 1;

    try {
        const dataToSave = JSON.stringify(gameState);
        localStorage.setItem(`${SAVE_SLOT_KEY}${gameState.saveSlot}`, dataToSave);
        console.log(`[SAVE] Jogo salvo no slot ${gameState.saveSlot}`);

        // Feedback visual
        const feedback = document.getElementById('save-feedback');
        if (feedback) {
            feedback.classList.remove('hidden-feedback');
            feedback.classList.add('show-feedback');
            setTimeout(() => {
                feedback.classList.remove('show-feedback');
                feedback.classList.add('hidden-feedback');
            }, 2000);
        }

    } catch (e) {
        console.error("Erro ao salvar jogo:", e);
        alert("Erro ao salvar jogo! Verifique se seu navegador permite localStorage.");
    }
}

function loadGame(slotNum) {
    try {
        const savedData = localStorage.getItem(`${SAVE_SLOT_KEY}${slotNum}`);
        if (!savedData) {
            alert("Nenhum jogo salvo encontrado neste slot!");
            return;
        }

        const loadedState = JSON.parse(savedData);

        // Restaurar estado
        // Merge cuidadoso para garantir que novos campos (como meditationCharges) tenham defaults
        gameState = { ...gameState, ...loadedState };

        // Garantir defaults para campos novos que podem não existir em saves antigos
        if (gameState.meditationCharges === undefined) gameState.meditationCharges = 3;
        if (gameState.defeatedMobNames === undefined) gameState.defeatedMobNames = [];
        if (gameState.playerLevel === undefined) gameState.playerLevel = 1;

        console.log(`[LOAD] Jogo carregado do slot ${slotNum}`);

        // Atualizar UI
        updatePlayerStatus();

        // Restaurar tela correta
        if (gameState.isBossActive) {
            // Se estava no boss, volta para exploração para evitar bugs visuais imediatos, mas renderiza o boss
            combatState.active = false;
            changeScreen('game-play');
            renderExplorationActions();
        } else {
            changeScreen('game-play');
            renderExplorationActions();
        }

        // Restaurar posição e mobs
        updatePlayerPosition();
        updateMapMobs();

        // Notificação
        const feedback = document.getElementById('save-feedback');
        if (feedback) {
            feedback.innerText = "📂 Jogo Carregado!";
            feedback.classList.remove('hidden-feedback');
            feedback.classList.add('show-feedback');
            setTimeout(() => {
                feedback.innerText = "💾 Jogo Salvo!"; // Reset text
                feedback.classList.remove('show-feedback');
                feedback.classList.add('hidden-feedback');
            }, 2000);
        }

    } catch (e) {
        console.error("Erro ao carregar jogo:", e);
        alert("Erro ao carregar o arquivo de save. O arquivo pode estar corrompido.");
    }
}

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

    // Prevenir scroll quando tocar no joystick
    const joystickContainer = document.querySelector('.mobile-joystick');
    if (joystickContainer) {
        joystickContainer.addEventListener('touchstart', (e) => {
            e.stopPropagation();
        }, { passive: false });

        joystickContainer.addEventListener('touchmove', (e) => {
            e.stopPropagation();
            e.preventDefault();
        }, { passive: false });
    }

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
    const bossDropItem = bossName ? ENEMIES[bossName]?.dropTable ? Object.keys(ENEMIES[bossName].dropTable)[0] : null : null;
    const bossDefeated = bossDropItem ? gameState.inventory.includes(bossDropItem) : false;

    // Spawnar até 3 mobs no mapa
    if (!bossDefeated) {
        const spawnPositions = [
            { x: 30, y: 15 },
            { x: 50, y: 20 },
            { x: 70, y: 15 }
        ];

        const remainingToSpawn = Math.min(3, Math.max(0, requiredKills - gameState.enemyKills));

        for (let i = 0; i < remainingToSpawn; i++) {
            const spawnIndex = gameState.enemyKills + i;
            const enemyName = phase.enemies[spawnIndex % phase.enemies.length] || Object.keys(ENEMIES)[0];
            const pos = spawnPositions[(spawnIndex) % spawnPositions.length];
            spawnMobSprite(enemyName, pos.x, pos.y, false);
        }

        if (gameState.enemyKills >= requiredKills) {
            spawnMobSprite(bossName, 55, 30, true);
        }
    }
}

function spawnMobSprite(enemyName, xPercent, yPercent, isBoss) {
    const mapMobsContainer = document.getElementById('map-mobs');
    if (!mapMobsContainer) return;

    const mobSprite = document.createElement('div');
    mobSprite.className = isBoss ? 'mob-sprite boss' : 'mob-sprite';

    const enemyData = ENEMIES[enemyName];
    if (enemyData) {
        mobSprite.style.backgroundImage = `url('${enemyData.image}')`;
        mobSprite.style.left = xPercent + '%';
        mobSprite.style.bottom = yPercent + '%'; // Using bottom for consistent ground alignment
        // Add name on hover
        mobSprite.title = enemyName;
        mapMobsContainer.appendChild(mobSprite);
    }
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
        floatingDiv.innerHTML = `+${value} <i class="fa-solid fa-coins"></i>`;
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

function restartGame() {
    console.log('[RESTART] Reiniciando jogo do zero...');

    // Limpar todos os saves (opcional - comentado para manter saves)
    // for (let i = 1; i <= 5; i++) {
    //     localStorage.removeItem(SAVE_SLOT_KEY + i);
    // }

    // Simplesmente recarregar a página para voltar ao menu inicial
    location.reload();

    console.log('[RESTART] Jogo reiniciado!');
}

function spawnFinalBoss() {
    // ENEMIES é carregado de mobs.js
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

// =======================================================
// SISTEMA DE ANÉIS - EQUIPAR E BUFFS PERMANENTES  
// =======================================================

function equipRing(ringName) {
    // Procurar slot vazio nos 4 slots
    const slots = ['slot1', 'slot2', 'slot3', 'slot4'];
    for (let slot of slots) {
        if (!gameState.equippedRings[slot]) {
            gameState.equippedRings[slot] = ringName;

            // Aplicar buffs permanentes do anel
            if (BOSS_RINGS[ringName]) {
                const buffs = BOSS_RINGS[ringName].buffs;
                gameState.playerStats.attack += buffs.attack || 0;
                gameState.playerStats.defense += buffs.defense || 0;
                gameState.playerStats.agility += buffs.agility || 0;
                gameState.playerStats.magic += buffs.magic || 0;
                gameState.playerStats.pv += buffs.pv || 0;
                gameState.playerStats.mp += buffs.mp || 0;

                updateGameText(`✨ ${ringName} equipado no ${slot}! Buffs aplicados permanentemente.`);
            }
            saveGame();
            return true;
        }
    }
    updateGameText('⚠️ Todos os 4 slots de anéis estão ocupados!');
    return false;
}

// Função para Game Over melhorado com delay e ESC
function closeGameOverAndExplore() {
    const currentPhase = PHASES[gameState.currentPhase];
    if (currentPhase) {
        const scenarioDiv = document.getElementById('scenario-image');
        scenarioDiv.style.backgroundImage = `url('${currentPhase.scenarioImage}')`;
        changeScreen('game-play');
        updateGameText(currentPhase.description);
    }
    renderExplorationActions();
}

// Função para desequipar anel por slot
function unequipRing(slot) {
    const ringName = gameState.equippedRings[slot];
    if (ringName && BOSS_RINGS[ringName]) {
        // Remover buffs
        const buffs = BOSS_RINGS[ringName].buffs;
        gameState.playerStats.attack -= buffs.attack || 0;
        gameState.playerStats.defense -= buffs.defense || 0;
        gameState.playerStats.agility -= buffs.agility || 0;
        gameState.playerStats.magic -= buffs.magic || 0;
        gameState.playerStats.pv -= buffs.pv || 0;
        gameState.playerStats.mp -= buffs.mp || 0;

        // Limpar slot
        gameState.equippedRings[slot] = null;

        updateGameText(`❌ ${ringName} removido do ${slot}. Buffs removidos.`);
        saveGame();
        setTimeout(() => showInventory(), 1500);
    }
}

// Função para desequipar anel por nome
function unequipRingByName(ringName) {
    const slots = ['slot1', 'slot2', 'slot3', 'slot4'];
    for (let slot of slots) {
        if (gameState.equippedRings[slot] === ringName) {
            unequipRing(slot);
            return;
        }
    }
}

// Listeners de teclado
document.addEventListener('keydown', function (event) {
    // ESC para fechar Game Over
    if (event.key === 'Escape') {
        const gameText = document.getElementById('game-text').innerHTML;
        if (gameText.includes('GAME OVER') && !gameText.includes('FINAL')) {
            closeGameOverAndExplore();
        }
    }

    // I para abrir inventário (sempre disponível)
    if (event.key && event.key.toLowerCase() === 'i') {
        showInventory();
    }

    // Durante combate - teclas 1-4 para ataques
    if (combatState.active) {
        if (event.key >= '1' && event.key <= '4') {
            const attackIndex = parseInt(event.key) - 1;
            if (gameState.playerAttacks[attackIndex]) {
                executePlayerAttack(attackIndex);
            }
        }
        // F para fugir
        if (event.key.toLowerCase() === 'f') {
            attemptEscape();
        }
    }
});