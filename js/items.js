// =======================================================
// DEFINIÇÕES DE ITENS
// =======================================================

// Itens aleatórios que podem dropar dos inimigos
const RANDOM_ITEMS = [
    { name: 'Poção de Cura', type: 'good', effect: 'pv_current', value: 30, chance: 35, icon: 'fa-solid fa-heart' },
    { name: 'Poção de Mana', type: 'good', effect: 'mp_current', value: 20, chance: 30, icon: 'fa-solid fa-bolt' },
    { name: 'Amuleto da Sorte (AGI+)', type: 'good', effect: 'agility_temp', value: 5, chance: 10, icon: 'fa-solid fa-clover' },
    { name: 'Erva Daninha Venenosa', type: 'bad', effect: 'pv_current', value: -15, chance: 15, icon: 'fa-solid fa-skull-crossbones' },
    { name: 'Espinhos Ferrugentos (DEF-)', type: 'bad', effect: 'defense_temp', value: -3, chance: 10, icon: 'fa-solid fa-link-slash' },
];

// Perguntas do Quiz
const QUIZ_QUESTIONS = [
    {
        id: 1,
        question: "Qual dos 11 heróis jogáveis é mais provável que venha do Império de Ferro, devido à sua especialização em armas de fogo/engenharia?",
        options: ["Assassino", "Caçador", "Atirador", "Clérigo"],
        answer: 2,
        reward: { type: 'mp_current', value: 30 },
        hint: "Especialista em tecnologia e armas de fogo."
    },
    {
        id: 2,
        question: "Na fase do Deserto de Areth, onde o calor é extremo, qual classe é ideal para mitigar o dano e curar status de queimadura?",
        options: ["Bárbaro", "Clérigo", "Assassino", "Tank"],
        answer: 1,
        reward: { type: 'pv_current', value: 35 },
        hint: "Especialista em cura e suporte."
    },
    {
        id: 3,
        question: "Qual é o principal papel do personagem Tank na equipe, de acordo com sua função na lista de classes?",
        options: ["Realizar dano furtivo", "Dano de longo alcance", "Foco em Defesa e Apanhar Dano", "Curar aliados"],
        answer: 2,
        reward: { type: 'mp_current', value: 40 },
        hint: "Sua função é proteger o time."
    },
    {
        id: 4,
        question: "Qual classe tem uma aparência (felinóide) que sugere uma origem no Reino de Sylvânia, conhecido por abrigar criaturas da floresta?",
        options: ["Guerreiro", "Caçador", "Ladino", "Bárbaro"],
        answer: 1,
        reward: { type: 'pv_current', value: 45 },
        hint: "Gato Negro é seu nome."
    },
    {
        id: 5,
        question: "Qual dos heróis (Assassino, Ladino) é o mais indicado para usar sua evasão e dano furtivo nas rotas marítimas da República de Aqua?",
        options: ["Mago", "Ladino", "Tank", "Assassino"],
        answer: 3,
        reward: { type: 'mp_current', value: 50 },
        hint: "Mestre da furtividade e katana."
    },
    {
        id: 6,
        question: "O sprite do Bárbaro (Grom) mostra que ele é de qual raça tradicionalmente associada ao Império de Ferro?",
        options: ["Elfo", "Tritão", "Anão", "Leonino"],
        answer: 2,
        reward: { type: 'pv_current', value: 55 },
        hint: "Raça de mineradores e ferreiros."
    }
];

// Itens disponíveis na loja - Organizados por categoria
const SHOP_ITEMS = {
    // ==== CONSUMÍVEIS BÁSICOS ====
    'Poção de Cura Pequena': { type: 'consumable', effect: 'pv_current', value: 30, cost: 25, icon: 'fa-solid fa-heart', category: 'consumable' },
    'Poção de Cura Média': { type: 'consumable', effect: 'pv_current', value: 50, cost: 45, icon: 'fa-solid fa-heart-pulse', category: 'consumable' },
    'Poção de Cura Grande': { type: 'consumable', effect: 'pv_current', value: 100, cost: 80, icon: 'fa-solid fa-kit-medical', category: 'consumable', phaseUnlock: 3 },
    'Poção de Cura Suprema': { type: 'consumable', effect: 'pv_current', value: 200, cost: 150, icon: 'fa-solid fa-suitcase-medical', category: 'consumable', phaseUnlock: 5 },

    'Poção de Mana Pequena': { type: 'consumable', effect: 'mp_current', value: 20, cost: 20, icon: 'fa-solid fa-bolt', category: 'consumable' },
    'Poção de Mana Média': { type: 'consumable', effect: 'mp_current', value: 40, cost: 35, icon: 'fa-solid fa-wand-sparkles', category: 'consumable' },
    'Poção de Mana Grande': { type: 'consumable', effect: 'mp_current', value: 80, cost: 65, icon: 'fa-solid fa-hand-sparkles', category: 'consumable', phaseUnlock: 3 },
    'Poção de Mana Suprema': { type: 'consumable', effect: 'mp_current', value: 150, cost: 120, icon: 'fa-solid fa-star', category: 'consumable', phaseUnlock: 5 },

    'Elixir Completo': { type: 'consumable', effect: 'full_heal', value: 999, cost: 180, icon: 'fa-solid fa-flask', category: 'consumable', description: 'Restaura 100% de PV e MP', phaseUnlock: 4 },
    'Revive': { type: 'revive', effect: 'revive', value: 1, cost: 250, icon: 'fa-solid fa-ankh', category: 'special', description: 'Revive ao morrer com 50% de PV/MP' },

    // ==== EQUIPAMENTOS PARA GUERREIRO (ATK/DEF) ====
    'Espada do Reino (+5 ATK)': { type: 'equipment', stat: 'attack', value: 5, cost: 120, icon: 'fa-solid fa-sword', category: 'warrior', classRecommended: 'Guerreiro do Leão' },
    'Espada Flamejante (+8 ATK)': { type: 'equipment', stat: 'attack', value: 8, cost: 220, icon: 'fa-brands fa-gripfire', category: 'warrior', phaseUnlock: 2, classRecommended: 'Guerreiro do Leão' },
    'Foco do Leão (+15 ATK)': { type: 'equipment', stat: 'attack', value: 15, cost: 500, icon: 'fa-solid fa-paw', category: 'warrior', phaseUnlock: 4, classRecommended: 'Guerreiro do Leão' },
    'Lâmina Lendária (+25 ATK)': { type: 'equipment', stat: 'attack', value: 25, cost: 1000, icon: 'fa-solid fa-khanda', category: 'warrior', phaseUnlock: 6, classRecommended: 'Guerreiro do Leão' },

    'Armadura Reforçada (+5 DEF)': { type: 'equipment', stat: 'defense', value: 5, cost: 120, icon: 'fa-solid fa-shield', category: 'warrior', classRecommended: 'Guerreiro do Leão' },
    'Couraça de Cristal (+10 DEF)': { type: 'equipment', stat: 'defense', value: 10, cost: 250, icon: 'fa-solid fa-diamond', category: 'warrior', phaseUnlock: 3, classRecommended: 'Guerreiro do Leão' },
    'Escudo dos Sete Reinos (+18 DEF)': { type: 'equipment', stat: 'defense', value: 18, cost: 800, icon: 'fa-solid fa-shield-halved', category: 'warrior', phaseUnlock: 5, classRecommended: 'Guerreiro do Leão' },

    // ==== EQUIPAMENTOS PARA MAGO (MAG/MP) ====
    'Manto da Sabedoria (+5 MAG)': { type: 'equipment', stat: 'magic', value: 5, cost: 120, icon: 'fa-solid fa-hat-wizard', category: 'mage', classRecommended: 'Mago das Estrelas' },
    'Cajado Arcano (+8 MAG)': { type: 'equipment', stat: 'magic', value: 8, cost: 220, icon: 'fa-solid fa-staff-snake', category: 'mage', phaseUnlock: 2, classRecommended: 'Mago das Estrelas' },
    'Grimório Dracônico (+15 MAG)': { type: 'equipment', stat: 'magic', value: 15, cost: 500, icon: 'fa-solid fa-book-skull', category: 'mage', phaseUnlock: 4, classRecommended: 'Mago das Estrelas' },
    'Báculo Celestial (+25 MAG)': { type: 'equipment', stat: 'magic', value: 25, cost: 1000, icon: 'fa-solid fa-sun', category: 'mage', phaseUnlock: 6, classRecommended: 'Mago das Estrelas' },

    'Anel de MP (+15 MP)': { type: 'equipment', stat: 'mp', value: 15, cost: 180, icon: 'fa-solid fa-ring', category: 'mage', classRecommended: 'Mago das Estrelas' },
    'Capa Mística (+30 MP)': { type: 'equipment', stat: 'mp', value: 30, cost: 350, icon: 'fa-solid fa-vest-patches', category: 'mage', phaseUnlock: 3, classRecommended: 'Mago das Estrelas' },

    // ==== EQUIPAMENTOS PARA LADINO (AGI/CRIT) ====
    'Botas Leves (+5 AGI)': { type: 'equipment', stat: 'agility', value: 5, cost: 120, icon: 'fa-solid fa-shoe-prints', category: 'rogue', classRecommended: 'Ladino das Ondas' },
    'Adagas Gêmeas (+8 AGI)': { type: 'equipment', stat: 'agility', value: 8, cost: 220, icon: 'fa-solid fa-xmarks-lines', category: 'rogue', phaseUnlock: 2, classRecommended: 'Ladino das Ondas' },
    'Botas do Vento Divino (+15 AGI)': { type: 'equipment', stat: 'agility', value: 15, cost: 500, icon: 'fa-solid fa-wind', category: 'rogue', phaseUnlock: 4, classRecommended: 'Ladino das Ondas' },
    'Sombras Eternas (+25 AGI)': { type: 'equipment', stat: 'agility', value: 25, cost: 1000, icon: 'fa-solid fa-mask', category: 'rogue', phaseUnlock: 6, classRecommended: 'Ladino das Ondas' },

    'Amuleto Aquático (+10 AGI)': { type: 'equipment', stat: 'agility', value: 10, cost: 200, icon: 'fa-solid fa-droplet', category: 'rogue', phaseUnlock: 1, classRecommended: 'Ladino das Ondas' },

    // ==== ITENS UNIVERSAIS ====
    'Anel de Vitalidade (+20 PV)': { type: 'equipment', stat: 'pv', value: 20, cost: 150, icon: 'fa-solid fa-heart', category: 'universal', description: 'Aumenta PV máximo' },
    'Colar da Fortuna (+50 PV)': { type: 'equipment', stat: 'pv', value: 50, cost: 300, icon: 'fa-solid fa-gem', category: 'universal', phaseUnlock: 3, description: 'Aumenta PV máximo' },
    'Amuleto dos Campeões (+100 PV)': { type: 'equipment', stat: 'pv', value: 100, cost: 600, icon: 'fa-solid fa-trophy', category: 'universal', phaseUnlock: 5, description: 'Aumenta PV máximo' },
    'Joia da Vida Eterna (+150 PV)': { type: 'equipment', stat: 'pv', value: 150, cost: 900, icon: 'fa-solid fa-heart-pulse', category: 'universal', phaseUnlock: 6, description: 'Aumenta PV máximo' },

    // ==== EQUIPAMENTOS ADICIONAIS GUERREIRO ====
    'Machado de Guerra (+12 ATK)': { type: 'equipment', stat: 'attack', value: 12, cost: 350, icon: 'fa-solid fa-gavel', category: 'warrior', phaseUnlock: 3, classRecommended: 'Guerreiro do Leão' },
    'Espada do Dragão (+20 ATK)': { type: 'equipment', stat: 'attack', value: 20, cost: 750, icon: 'fa-solid fa-dragon', category: 'warrior', phaseUnlock: 5, classRecommended: 'Guerreiro do Leão' },
    'Excalibur (+35 ATK)': { type: 'equipment', stat: 'attack', value: 35, cost: 1500, icon: 'fa-brands fa-fort-awesome', category: 'warrior', phaseUnlock: 7, classRecommended: 'Guerreiro do Leão' },

    'Armadura de Ferro (+8 DEF)': { type: 'equipment', stat: 'defense', value: 8, cost: 180, icon: 'fa-solid fa-shirt', category: 'warrior', phaseUnlock: 2, classRecommended: 'Guerreiro do Leão' },
    'Armadura de Platina (+15 DEF)': { type: 'equipment', stat: 'defense', value: 15, cost: 450, icon: 'fa-solid fa-shield-virus', category: 'warrior', phaseUnlock: 4, classRecommended: 'Guerreiro do Leão' },
    'Armadura Divina (+25 DEF)': { type: 'equipment', stat: 'defense', value: 25, cost: 1200, icon: 'fa-solid fa-shield-cat', category: 'warrior', phaseUnlock: 7, classRecommended: 'Guerreiro do Leão' },

    // ==== EQUIPAMENTOS ADICIONAIS MAGO ====
    'Orbe Místico (+12 MAG)': { type: 'equipment', stat: 'magic', value: 12, cost: 350, icon: 'fa-solid fa-bahai', category: 'mage', phaseUnlock: 3, classRecommended: 'Mago das Estrelas' },
    'Cajado Estelar (+20 MAG)': { type: 'equipment', stat: 'magic', value: 20, cost: 750, icon: 'fa-solid fa-star-of-david', category: 'mage', phaseUnlock: 5, classRecommended: 'Mago das Estrelas' },
    'Cajado do Arquimago (+35 MAG)': { type: 'equipment', stat: 'magic', value: 35, cost: 1500, icon: 'fa-solid fa-wand-sparkles', category: 'mage', phaseUnlock: 7, classRecommended: 'Mago das Estrelas' },

    'Coroa Arcana (+50 MP)': { type: 'equipment', stat: 'mp', value: 50, cost: 550, icon: 'fa-solid fa-crown', category: 'mage', phaseUnlock: 5, classRecommended: 'Mago das Estrelas' },
    'Manto Estelar (+80 MP)': { type: 'equipment', stat: 'mp', value: 80, cost: 900, icon: 'fa-solid fa-cloud-moon', category: 'mage', phaseUnlock: 6, classRecommended: 'Mago das Estrelas' },

    // ==== EQUIPAMENTOS ADICIONAIS LADINO ====
    'Luvas de Ladino (+8 AGI)': { type: 'equipment', stat: 'agility', value: 8, cost: 180, icon: 'fa-solid fa-mitten', category: 'rogue', phaseUnlock: 2, classRecommended: 'Ladino das Ondas' },
    'Manto das Sombras (+20 AGI)': { type: 'equipment', stat: 'agility', value: 20, cost: 750, icon: 'fa-solid fa-ghost', category: 'rogue', phaseUnlock: 5, classRecommended: 'Ladino das Ondas' },
    'Asas de Mercúrio (+35 AGI)': { type: 'equipment', stat: 'agility', value: 35, cost: 1500, icon: 'fa-solid fa-feather-pointed', category: 'rogue', phaseUnlock: 7, classRecommended: 'Ladino das Ondas' },

    'Colar da Velocidade (+15 AGI)': { type: 'equipment', stat: 'agility', value: 15, cost: 400, icon: 'fa-solid fa-forward', category: 'rogue', phaseUnlock: 4, classRecommended: 'Ladino das Ondas' },

    // ==== ITENS ESPECIAIS AVANÇADOS ====
    'Elixir de Força (+3 ATK)': { type: 'equipment', stat: 'attack', value: 3, cost: 200, icon: 'fa-solid fa-dumbbell', category: 'special', phaseUnlock: 2, description: 'Bônus permanente de ataque' },
    'Elixir de Inteligência (+3 MAG)': { type: 'equipment', stat: 'magic', value: 3, cost: 200, icon: 'fa-solid fa-brain', category: 'special', phaseUnlock: 2, description: 'Bônus permanente de magia' },
    'Elixir de Agilidade (+3 AGI)': { type: 'equipment', stat: 'agility', value: 3, cost: 200, icon: 'fa-solid fa-running', category: 'special', phaseUnlock: 2, description: 'Bônus permanente de agilidade' },
    'Elixir de Resistência (+3 DEF)': { type: 'equipment', stat: 'defense', value: 3, cost: 200, icon: 'fa-solid fa-shield-halved', category: 'special', phaseUnlock: 2, description: 'Bônus permanente de defesa' },

    // ==== CONSUMÍVEIS COM EFEITOS ESPECIAIS ====
    'Poção de Fogo': { type: 'consumable', effect: 'buff_attack', value: 10, cost: 100, icon: 'fa-solid fa-fire', category: 'consumable', phaseUnlock: 3, description: 'Aumenta ATK em 10 por 3 turnos' },
    'Poção de Gelo': { type: 'consumable', effect: 'buff_defense', value: 8, cost: 90, icon: 'fa-solid fa-snowflake', category: 'consumable', phaseUnlock: 3, description: 'Aumenta DEF em 8 por 3 turnos' },
    'Poção de Raio': { type: 'consumable', effect: 'buff_agility', value: 12, cost: 95, icon: 'fa-solid fa-bolt', category: 'consumable', phaseUnlock: 3, description: 'Aumenta AGI em 12 por 3 turnos' },
    'Poção Arcana': { type: 'consumable', effect: 'buff_magic', value: 10, cost: 105, icon: 'fa-solid fa-atom', category: 'consumable', phaseUnlock: 4, description: 'Aumenta MAG em 10 por 3 turnos' },

    'Tônico da Força Vital': { type: 'consumable', effect: 'buff_pv_max', value: 50, cost: 150, icon: 'fa-solid fa-heart-circle-plus', category: 'consumable', phaseUnlock: 4, description: 'Aumenta PV máximo em 50 por combate' },
    'Tônico Arcano': { type: 'consumable', effect: 'buff_mp_max', value: 30, cost: 140, icon: 'fa-solid fa-faucet-drip', category: 'consumable', phaseUnlock: 4, description: 'Aumenta MP máximo em 30 por combate' },

    'Granada de Fogo': { type: 'consumable', effect: 'damage_enemy', value: 80, cost: 120, icon: 'fa-solid fa-explosion', category: 'consumable', phaseUnlock: 5, description: 'Causa 80 de dano direto ao inimigo' },
    'Bomba de Gelo': { type: 'consumable', effect: 'damage_enemy', value: 100, cost: 150, icon: 'fa-solid fa-icicles', category: 'consumable', phaseUnlock: 6, description: 'Causa 100 de dano direto ao inimigo' },

    'Talismã da Sorte': { type: 'consumable', effect: 'buff_critical', value: 20, cost: 180, icon: 'fa-solid fa-clover', category: 'consumable', phaseUnlock: 5, description: 'Aumenta chance de crítico em 20% por 3 turnos' },
    'Pergaminho da Sabedoria': { type: 'consumable', effect: 'restore_skills', value: 50, cost: 160, icon: 'fa-solid fa-scroll', category: 'consumable', phaseUnlock: 5, description: 'Restaura 50 MP de todas habilidades' },

    'Essencia do Dragão': { type: 'consumable', effect: 'buff_all_stats', value: 5, cost: 250, icon: 'fa-solid fa-dragon', category: 'special', phaseUnlock: 6, description: 'Aumenta TODOS os atributos em 5 por 5 turnos' },
    'Elixir Demoníaco': { type: 'consumable', effect: 'berserker', value: 15, cost: 200, icon: 'fa-solid fa-skull-crossbones', category: 'special', phaseUnlock: 6, description: 'Aumenta ATK em 15 mas reduz DEF em 5' },
    'Benção Divina': { type: 'consumable', effect: 'blessing', value: 1, cost: 300, icon: 'fa-solid fa-hands-praying', category: 'special', phaseUnlock: 7, description: 'Próximo ataque inimigo erra automaticamente' },
};

// =======================================================
// ANÉIS DOS BOSSES - DROPS ÚNICOS COM BUFFS PERMANENTES
// =======================================================
const BOSS_RINGS = {
    'Anel de Fogo': {
        description: 'Anel do Dragão Flamejante',
        icon: 'fa-solid fa-fire-flame-curved',
        phase: 1,
        buffs: {
            attack: 10,
            magic: 5,
            pv: 30
        },
        lore: 'Forjado no coração do Dragão Flamejante, este anel pulsa com poder ardente.'
    },
    'Anel de Água': {
        description: 'Anel da Serpente Gélida',
        icon: 'fa-solid fa-water',
        phase: 2,
        buffs: {
            defense: 8,
            mp: 40,
            agility: 5
        },
        lore: 'Das profundezas geladas, este anel concede a resiliência das águas eternas.'
    },
    'Anel de Rocha': {
        description: 'Anel do Guardião de Cristal',
        icon: 'fa-solid fa-gem',
        phase: 3,
        buffs: {
            defense: 15,
            pv: 50,
            attack: 5
        },
        lore: 'Cristalizado pela vontade do Guardião, este anel oferece proteção impenetrável.'
    },
    'Anel de Vento': {
        description: 'Anel do Senhor dos Ventos',
        icon: 'fa-solid fa-wind',
        phase: 4,
        buffs: {
            agility: 15,
            attack: 8,
            mp: 30
        },
        lore: 'Leve como a brisa, mortal como a tempestade - o poder do Senhor dos Ventos.'
    },
    'Anel das Sombras': {
        description: 'Anel do Boss Fase 5',
        icon: 'fa-solid fa-poo-storm',
        phase: 5,
        buffs: {
            attack: 12,
            agility: 10,
            defense: 8,
            pv: 40
        },
        lore: 'Nascido da escuridão absoluta, este anel esconde poder além da compreensão.'
    },
    'Anel da Luz': {
        description: 'Anel do Boss Fase 6',
        icon: 'fa-solid fa-sun',
        phase: 6,
        buffs: {
            magic: 20,
            mp: 60,
            defense: 10,
            pv: 50
        },
        lore: 'Radiante e puro, este anel canaliza a essência da luz celestial.'
    },
    'Anel do Caos': {
        description: 'Anel do Boss Fase 7',
        icon: 'fa-solid fa-bolt-lightning',
        phase: 7,
        buffs: {
            attack: 18,
            magic: 15,
            agility: 12,
            defense: 12,
            pv: 60,
            mp: 50
        },
        lore: 'O caos primordial condensado em forma de anel - poder sem limites.'
    },
    'Anel Completo dos Sete Reinos': {
        description: 'Anel do Guardião Final',
        icon: 'fa-solid fa-crown',
        phase: 8,
        buffs: {
            attack: 30,
            magic: 30,
            agility: 25,
            defense: 25,
            pv: 100,
            mp: 100
        },
        lore: 'A união de todos os reinos - o poder supremo que transcende a mortalidade.'
    }
};
