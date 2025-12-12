// =======================================================
// DEFINIÇÕES DOS INIMIGOS (MOBS E BOSSES)
// =======================================================

const ENEMIES = {
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
    'O Abominável Guardião Final': { pv: 500, attack: 45, defense: 30, isBoss: true, rewardMoney: 1000, dropTable: { 'Anel Completo dos Quatro Reinos': 100 }, image: 'assets/images/enemies/dragao-fantasma.png' }
};
