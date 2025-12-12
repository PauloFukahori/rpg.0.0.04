// =======================================================
// DEFINIÇÕES DAS FASES/MAPAS
// =======================================================

const PHASES = {
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
        finalBossName: 'O Abominável Guardião Final'
    }
};
