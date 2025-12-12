// =======================================================
// DEFINIÇÕES DE ITENS
// =======================================================

// Itens aleatórios que podem dropar dos inimigos
const RANDOM_ITEMS = [
    { name: 'Poção de Cura', type: 'good', effect: 'pv_current', value: 30, chance: 35, emoji: '❤️' },
    { name: 'Poção de Mana', type: 'good', effect: 'mp_current', value: 20, chance: 30, emoji: '✨' },
    { name: 'Amuleto da Sorte (AGI+)', type: 'good', effect: 'agility_temp', value: 5, chance: 10, emoji: '🍀' },
    { name: 'Erva Daninha Venenosa', type: 'bad', effect: 'pv_current', value: -15, chance: 15, emoji: '🤢' },
    { name: 'Espinhos Ferrugentos (DEF-)', type: 'bad', effect: 'defense_temp', value: -3, chance: 10, emoji: '⚙️' },
];

// Perguntas do Quiz
const QUIZ_QUESTIONS = [
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

// Itens disponíveis na loja
const SHOP_ITEMS = {
    'Poção Forte de Cura': { type: 'consumable', effect: 'pv_current', value: 50, cost: 50, emoji: '❤️' },
    'Poção Forte de Mana': { type: 'consumable', effect: 'mp_current', value: 40, cost: 40, emoji: '✨' },
    'Revive': { type: 'revive', effect: 'revive', value: 1, cost: 200, emoji: '💫', description: 'Revive ao morrer com 50% de PV/MP' },
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
