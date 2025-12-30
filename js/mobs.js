const ENEMIES = {
    // ================= MAPA 01 (Tutorial/Suave) =================
    // Reduzi PV e Ataque para permitir que o jogador sobreviva sem equipamentos de elite.
    'Murkfang': { 
        pv: 20, attack: 5, defense: 2, isBoss: false, rewardMoney: 10, 
        dropTable: { 'Poção de Cura': 35 }, // Aumentei chance de drop para ajudar o início
        image: 'assets/images/enemies/mapa01/Murkfang.png',
        attacks: [
            { name: 'Mordida Sombria', type: 'physical', multiplier: 1.0 },
            { name: 'Presas Venenosas', type: 'physical', multiplier: 1.1 }
        ]
    },
    'Verdagor': { 
        pv: 25, attack: 7, defense: 3, isBoss: false, rewardMoney: 12, 
        dropTable: { 'Poção de Mana': 20 }, 
        image: 'assets/images/enemies/mapa01/Verdagor.png',
        attacks: [
            { name: 'Chicote de Vinhas', type: 'physical', multiplier: 1.0 },
            { name: 'Rajada de Espinhos', type: 'physical', multiplier: 1.15 }
        ]
    },
    'Talpigno': { 
        pv: 30, attack: 8, defense: 4, isBoss: false, rewardMoney: 15, 
        dropTable: { 'Amuleto da Sorte (AGI+)': 8 }, 
        image: 'assets/images/enemies/mapa01/Talpigno.png',
        attacks: [
            { name: 'Garra Escavadora', type: 'physical', multiplier: 1.0 },
            { name: 'Emboscada Subterrânea', type: 'physical', multiplier: 1.15 }
        ]
    },
    'Sylvarok': { 
        pv: 80, attack: 15, defense: 6, isBoss: true, rewardMoney: 150, 
        dropTable: { 'Anel de Floresta': 100 }, 
        image: 'assets/images/enemies/mapa01/Sylvarok.png',
        attacks: [
            { name: 'Golpe de Raízes', type: 'physical', multiplier: 1.0 },
            { name: 'Abraço da Floresta', type: 'physical', multiplier: 1.15 },
            { name: 'Coração Selvagem', type: 'magic', multiplier: 1.3 }
        ]
    },

    // ================= MAPA 02 (Desenvolvimento) =================
    'Mosscryst': { 
        pv: 50, attack: 12, defense: 6, isBoss: false, rewardMoney: 22, 
        dropTable: { 'Poção de Cura': 20 }, 
        image: 'assets/images/enemies/mapa02/Mosscryst.png',
        attacks: [
            { name: 'Investida da Concha', type: 'physical', multiplier: 1.0 },
            { name: 'Estilhaço de Cristal', type: 'physical', multiplier: 1.15 }
        ]
    },
    'Putrefax': { 
        pv: 55, attack: 14, defense: 7, isBoss: false, rewardMoney: 24, 
        dropTable: { 'Poção de Mana': 18 }, 
        image: 'assets/images/enemies/mapa02/Putrefax.png',
        attacks: [
            { name: 'Mordida', type: 'physical', multiplier: 1.0 },
            { name: 'Sopro Pestilento', type: 'magic', multiplier: 1.15 }
        ]
    },
    'Crocaris': { 
        pv: 65, attack: 16, defense: 8, isBoss: false, rewardMoney: 26, 
        dropTable: { 'Amuleto da Sorte (AGI+)': 12 }, 
        image: 'assets/images/enemies/mapa02/Crocaris.png',
        attacks: [
            { name: 'Mordida de Ferro', type: 'physical', multiplier: 1.0 },
            { name: 'Esmagar Escamas', type: 'physical', multiplier: 1.15 }
        ]
    },
    'Fungorax': { 
        pv: 150, attack: 22, defense: 12, isBoss: true, rewardMoney: 220, 
        dropTable: { 'Coroa Fúngica': 100 }, 
        image: 'assets/images/enemies/mapa02/Fungorax.png',
        attacks: [
            { name: 'Arremesso de Esporos', type: 'magic', multiplier: 1.0 },
            { name: 'Explosão Fúngica', type: 'magic', multiplier: 1.15 },
            { name: 'Senhor dos Cogumelos', type: 'magic', multiplier: 1.5 }
        ]
    },

    // ================= MAPA 03 (Desafio Moderado) =================
    'Aegishell': { 
        pv: 90, attack: 20, defense: 12, isBoss: false, rewardMoney: 32, 
        dropTable: { 'Escudo de Concha (DEF+)': 12 }, 
        image: 'assets/images/enemies/mapa03/Aegishell.png',
        attacks: [
            { name: 'Investida de Casco', type: 'physical', multiplier: 1.0 },
            { name: 'Onda Destrutiva', type: 'magic', multiplier: 1.15 }
        ]
    },
    'Sanguifish': { 
        pv: 85, attack: 22, defense: 10, isBoss: false, rewardMoney: 30, 
        dropTable: { 'Poção de Cura': 20 }, 
        image: 'assets/images/enemies/mapa03/Sanguifish.png',
        attacks: [
            { name: 'Mordida Sangrenta', type: 'physical', multiplier: 1.0 },
            { name: 'Cardume Frenético', type: 'physical', multiplier: 1.15 }
        ]
    },
    'Tentaculon': { 
        pv: 105, attack: 24, defense: 11, isBoss: false, rewardMoney: 36, 
        dropTable: { 'Tentáculo Pegajoso': 10 }, 
        image: 'assets/images/enemies/mapa03/Tentaculon.png',
        attacks: [
            { name: 'Chicote de Tentáculo', type: 'physical', multiplier: 1.0 },
            { name: 'Nuvem de Tinta', type: 'magic', multiplier: 1.15 }
        ]
    },
    'Melusyria': { 
        pv: 250, attack: 30, defense: 16, isBoss: true, rewardMoney: 260, 
        dropTable: { 'Lira das Marés': 100 }, 
        image: 'assets/images/enemies/mapa03/Melusyria.png',
        attacks: [
            { name: 'Estocada de Tridente', type: 'physical', multiplier: 1.0 },
            { name: 'Canção da Sereia', type: 'magic', multiplier: 1.15 },
            { name: 'Rainha do Abismo', type: 'magic', multiplier: 1.6 }
        ]
    },

    // ================= MAPA 04 (Metade do Jogo) =================
    'Vermiscaldus': { 
        pv: 130, attack: 28, defense: 14, isBoss: false, rewardMoney: 40, 
        dropTable: { 'Veneno de Escorpião': 10 }, 
        image: 'assets/images/enemies/mapa04/Vermiscaldus.png',
        attacks: [
            { name: 'Mordida Arenosa', type: 'physical', multiplier: 1.0 },
            { name: 'Investida Subterrânea', type: 'physical', multiplier: 1.15 }
        ]
    },
    'Scorpiris': { 
        pv: 125, attack: 30, defense: 15, isBoss: false, rewardMoney: 38, 
        dropTable: { 'Garras de Escorpião': 12 }, 
        image: 'assets/images/enemies/mapa04/Scorpiris.png',
        attacks: [
            { name: 'Picada de Ferrão', type: 'physical', multiplier: 1.0 },
            { name: 'Raio Venenoso', type: 'magic', multiplier: 1.15 }
        ]
    },
    'Spectrovore': { 
        pv: 140, attack: 32, defense: 16, isBoss: false, rewardMoney: 44, 
        dropTable: { 'Essência Etérea': 8 }, 
        image: 'assets/images/enemies/mapa04/Spectrovore.png',
        attacks: [
            { name: 'Garra Fantasmagórica', type: 'physical', multiplier: 1.0 },
            { name: 'Drenar Alma', type: 'magic', multiplier: 1.15 }
        ]
    },
    'Lapidarion': { 
        pv: 350, attack: 40, defense: 22, isBoss: true, rewardMoney: 320, 
        dropTable: { 'Coração de Pedra': 100 }, 
        image: 'assets/images/enemies/mapa04/Lapidarion.png',
        attacks: [
            { name: 'Soco Cristalino', type: 'physical', multiplier: 1.0 },
            { name: 'Raio Prismático', type: 'magic', multiplier: 1.15 },
            { name: 'Núcleo da Eternidade', type: 'magic', multiplier: 1.6 }
        ]
    },

    // ================= MAPA 05 (Deserto / Avançado) =================
    'Scarabrix': { 
        pv: 170, attack: 45, defense: 22, isBoss: false, rewardMoney: 48, 
        dropTable: { 'Casca Dourada': 10 }, 
        image: 'assets/images/enemies/mapa05/Scarabrix.png',
        attacks: [
            { name: 'Investida Dourada', type: 'physical', multiplier: 1.0 },
            { name: 'Explosão Solar', type: 'magic', multiplier: 1.15 }
        ]
    },
    'Serporea': { 
        pv: 185, attack: 48, defense: 24, isBoss: false, rewardMoney: 52, 
        dropTable: { 'Poção de Cura': 20 }, 
        image: 'assets/images/enemies/mapa05/Serporea.png',
        attacks: [
            { name: 'Mordida de Presas', type: 'physical', multiplier: 1.0 },
            { name: 'Enroscar da Tempestade', type: 'physical', multiplier: 1.15 }
        ]
    },
    'Sarcophagum': { 
        pv: 200, attack: 52, defense: 26, isBoss: false, rewardMoney: 56, 
        dropTable: { 'Sarcófago Antigo': 6 }, 
        image: 'assets/images/enemies/mapa05/Sarcophagum.png',
        attacks: [
            { name: 'Chicote de Faixas', type: 'physical', multiplier: 1.0 },
            { name: 'Maldição da Tumba', type: 'magic', multiplier: 1.15 }
        ]
    },
    'Felisphinx': { 
        pv: 500, attack: 65, defense: 35, isBoss: true, rewardMoney: 400, 
        dropTable: { 'Sphinx Crown': 100 }, 
        image: 'assets/images/enemies/mapa05/Felisphinx.png',
        attacks: [
            { name: 'Arranhão Enigmático', type: 'physical', multiplier: 1.0 },
            { name: 'Rugido do Mistério', type: 'magic', multiplier: 1.15 },
            { name: 'Enigma de Bastet', type: 'magic', multiplier: 1.6 }
        ]
    },

    // ================= MAPA 06 (Gelo / Elite) =================
    'Glaciocetus': { 
        pv: 240, attack: 60, defense: 32, isBoss: false, rewardMoney: 60, 
        dropTable: { 'Gema de Gelo': 10 }, 
        image: 'assets/images/enemies/mapa06/Glaciocetus.png',
        attacks: [
            { name: 'Investida Gelada', type: 'physical', multiplier: 1.0 },
            { name: 'Onda Congelante', type: 'magic', multiplier: 1.15 }
        ]
    },
    'Umbriflakes': { 
        pv: 230, attack: 58, defense: 30, isBoss: false, rewardMoney: 58, 
        dropTable: { 'Fragmento Sombrio': 10 }, 
        image: 'assets/images/enemies/mapa06/Umbriflakes.png',
        attacks: [
            { name: 'Bola de Neve Sombria', type: 'physical', multiplier: 1.0 },
            { name: 'Nevasca Negra', type: 'magic', multiplier: 1.15 }
        ]
    },
    'Polarbastion': { 
        pv: 280, attack: 65, defense: 38, isBoss: false, rewardMoney: 68, 
        dropTable: { 'Placa Polar': 6 }, 
        image: 'assets/images/enemies/mapa06/Polarbastion.png',
        attacks: [
            { name: 'Soco Ursino', type: 'physical', multiplier: 1.0 },
            { name: 'Investida Glacial', type: 'physical', multiplier: 1.15 }
        ]
    },
    'Nivifox': { 
        pv: 750, attack: 85, defense: 45, isBoss: true, rewardMoney: 480, 
        dropTable: { 'Cauda de Nivi': 100 }, 
        image: 'assets/images/enemies/mapa06/Nivifox.png',
        attacks: [
            { name: 'Chicote de Cauda', type: 'physical', multiplier: 1.0 },
            { name: 'Miragem de Neve', type: 'magic', multiplier: 1.15 },
            { name: 'Blizzard Hexa', type: 'magic', multiplier: 1.6 }
        ]
    },

    // ================= MAPA 07 (Vulcão / Final) =================
    'Pyrosaur': { 
        pv: 350, attack: 80, defense: 40, isBoss: false, rewardMoney: 72, 
        dropTable: { 'Escama Flamejante': 10 }, 
        image: 'assets/images/enemies/mapa07/Pyrosaur.png',
        attacks: [
            { name: 'Mordida Flamejante', type: 'physical', multiplier: 1.0 },
            { name: 'Sopro de Fogo', type: 'magic', multiplier: 1.15 }
        ]
    },
    'Noctiflamma': { 
        pv: 330, attack: 78, defense: 38, isBoss: false, rewardMoney: 70, 
        dropTable: { 'Pó Noturno': 10 }, 
        image: 'assets/images/enemies/mapa07/Noctiflamma.png',
        attacks: [
            { name: 'Asa de Brasa', type: 'physical', multiplier: 1.0 },
            { name: 'Labareda Noturna', type: 'magic', multiplier: 1.15 }
        ]
    },
    'Magmafang': { 
        pv: 400, attack: 90, defense: 45, isBoss: false, rewardMoney: 78, 
        dropTable: { 'Dente de Magma': 8 }, 
        image: 'assets/images/enemies/mapa07/Magmafang.png',
        attacks: [
            { name: 'Esmagar Garras', type: 'physical', multiplier: 1.0 },
            { name: 'Explosão de Lava', type: 'magic', multiplier: 1.15 }
        ]
    },
    'Lavamachus': { 
        pv: 1200, attack: 110, defense: 60, isBoss: true, rewardMoney: 600, 
        dropTable: { 'Coracao de Lava': 100 }, 
        image: 'assets/images/enemies/mapa07/Lavamachus.png',
        attacks: [
            { name: 'Golpe Rochoso', type: 'physical', multiplier: 1.0 },
            { name: 'Investida de Magma', type: 'physical', multiplier: 1.15 },
            { name: 'Titã do Fogo', type: 'magic', multiplier: 1.8 } // Multiplicador final aumentado
        ]
    }
};