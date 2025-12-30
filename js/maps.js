// =======================================================
// DEFINIÇÕES DAS FASES/MAPAS
// =======================================================

const PHASES = {
    1: {
        name: "Reino da Chama (Fogo)",
        scenarioImage: "assets/images/scenes/Mapa1.png",
        introText: "Você emerge em uma terra de cinzas e magma. Criaturas sombrias da floresta e bestas antigas te aguardam!",
        enemies: ['Murkfang', 'Verdagor', 'Talpigno'],
        bossName: 'Sylvarok',
        killsToBoss: 3,
    },
    2: {
        name: "Reino da Tundra (Água)",
        scenarioImage: "assets/images/scenes/Mapa2.png",
        introText: "As ondas geladas da Tundra testarão sua agilidade. Cuidado com as criaturas marinhas!",
        enemies: ['Mosscryst', 'Putrefax', 'Crocaris'],
        bossName: 'Fungorax',
        killsToBoss: 3,
    },
    3: {
        name: "Reino da Rocha (Terra)",
        scenarioImage: "assets/images/scenes/Mapa3.png",
        introText: "Profundezas escuras, cristalinas e cheias de armadilhas. Golems e gárgulas guardam os segredos!",
        enemies: ['Aegishell', 'Sanguifish', 'Tentaculon'],
        bossName: 'Melusyria',
        killsToBoss: 3,
    },
    4: {
        name: "Reino do Vento (Ar)",
        scenarioImage: "assets/images/scenes/Mapa4.png",
        introText: "O último reino flutua nas nuvens, guardado por harpias selvagens e elementais do ar!",
        enemies: ['Vermiscaldus', 'Scorpiris', 'Spectrovore'],
        bossName: 'Lapidarion',
        killsToBoss: 3,
    },
    5: {
        name: "Reino do Crepúsculo (Misticismo)",
        scenarioImage: "assets/images/scenes/Mapa5.png",
        introText: "Terras onde o misticismo e relíquias antigas aparecem ao entardecer.",
        enemies: ['Scarabrix', 'Serporea', 'Sarcophagum'],
        bossName: 'Felisphinx',
        killsToBoss: 3,
    },
    6: {
        name: "Reino Gélido (Glaciar)",
        scenarioImage: "assets/images/scenes/Mapa6.png",
        introText: "Geleiras e ventos cortantes testam sua resistência.",
        enemies: ['Glaciocetus', 'Umbriflakes', 'Polarbastion'],
        bossName: 'Nivifox',
        killsToBoss: 3,
    },
    7: {
        name: "Forja Infernal (Volcano)",
        scenarioImage: "assets/images/scenes/Mapa7.png",
        introText: "Fendas de magma e monstros nascidos do fogo aguardam sua coragem.",
        enemies: ['Pyrosaur', 'Noctiflamma', 'Magmafang'],
        bossName: 'Lavamachus',
        killsToBoss: 3,
    },
    8: {
        name: "O Conclave Final",
        scenarioImage: "assets/images/scenes/MapaBoss.png",
        introText: "Após conquistar os sete reinos, o Guardião Final desperta. Prepare-se.",
        type: 'final_boss',
        bossName: 'O Abominável Guardião Final',
        battleImage: 'assets/images/battles/battle-boss.png'
    }
};
