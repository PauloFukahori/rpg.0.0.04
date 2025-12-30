// =======================================================
// DEFINIÇÕES DAS CLASSES DE PERSONAGENS
// =======================================================

const CLASSES = {
    'Arqueira': {
        characterName: 'Anya',
        kingdom: 'Sylvânia (Elfa)',
        role: 'Dano de Longo Alcance',
        description: 'Elfa ágil e precisa, mestra do arco longo. Velocidade e críticos devastadores.',
        baseStats: { pv: 85, mp: 55, attack: 14, magic: 8, defense: 6, agility: 18 },
        image: 'assets/images/classes/arqueira.png',
        attacks: [
            { id: 'ataqueBasico', name: "Flecha Rápida", type: "physical", cost: 0, multiplier: 1.0, icon: "fa-solid fa-bullseye", description: "Disparo básico de flecha sem custo de MP." },
            { id: 'chuvaFlechas', name: "Chuva de Flechas", type: "physical", cost: 12, multiplier: 1.4, icon: "fa-solid fa-layer-group", description: "Múltiplos disparos causam dano elevado." },
            { id: 'flechaPerfurante', name: "Flecha Perfurante", type: "physical", cost: 8, multiplier: 1.2, icon: "fa-solid fa-arrow-right-long", description: "Ignora parte da defesa inimiga." },
            { id: 'olhoAguia', name: "Olho de Águia", type: "buff", cost: 10, targetStat: "agility", value: 7, duration: 3, icon: "fa-solid fa-eye", description: "Aumenta Agilidade em 7 por 3 turnos." }
        ]
    },
    'Assassino': {
        characterName: 'Kael',
        kingdom: 'República de Aqua (Humano)',
        role: 'Dano Furtivo/Evasão',
        description: 'Ninja das sombras com katana mortal. Ataca com velocidade e letalidade.',
        baseStats: { pv: 75, mp: 45, attack: 16, magic: 4, defense: 5, agility: 20 },
        image: 'assets/images/classes/assassino.png',
        attacks: [
            { id: 'ataqueBasico', name: "Corte Silencioso", type: "physical", cost: 0, multiplier: 1.0, icon: "fa-solid fa-user-ninja", description: "Golpe rápido com a katana sem custo de MP." },
            { id: 'golpeSombrio', name: "Golpe Sombrio", type: "physical", cost: 15, multiplier: 2.0, icon: "fa-solid fa-moon", description: "Ataque crítico devastador das sombras." },
            { id: 'fumaca', name: "Bomba de Fumaça", type: "buff", cost: 8, targetStat: "agility", value: 10, duration: 2, icon: "fa-solid fa-smog", description: "Esquiva aumentada drasticamente por 2 turnos." },
            { id: 'laminaDupla', name: "Lâmina Dupla", type: "physical", cost: 10, multiplier: 0.9, icon: "fa-solid fa-xmarks-lines", description: "Dois cortes rápidos consecutivos." }
        ]
    },
    'Atirador': {
        characterName: 'Borin',
        kingdom: 'Império de Ferro (Humano/Engenheiro)',
        role: 'Dano de Área (Tecnologia)',
        description: 'Mestre de armas duplas, combina precisão e velocidade de tiro.',
        baseStats: { pv: 90, mp: 50, attack: 15, magic: 5, defense: 7, agility: 14 },
        image: 'assets/images/classes/atirador.png',
        attacks: [
            { id: 'ataqueBasico', name: "Tiro Duplo", type: "physical", cost: 0, multiplier: 1.0, icon: "fa-solid fa-gun", description: "Disparo com ambas as armas sem custo de MP." },
            { id: 'rajada', name: "Rajada de Tiros", type: "physical", cost: 12, multiplier: 1.5, icon: "fa-solid fa-wind", description: "Sequência rápida de disparos." },
            { id: 'tiroExplosivo', name: "Tiro Explosivo", type: "physical", cost: 10, multiplier: 1.3, icon: "fa-solid fa-bomb", description: "Munição explosiva causa dano em área." },
            { id: 'recarga', name: "Recarga Tática", type: "buff", cost: 5, targetStat: "attack", value: 5, duration: 3, icon: "fa-solid fa-rotate", description: "Aumenta Ataque em 5 por 3 turnos." }
        ]
    },
    'Bárbaro': {
        characterName: 'Grom',
        kingdom: 'Império de Ferro (Anão)',
        role: 'Dano Corpo a Corpo/Tank Secundário',
        description: 'Anão guerreiro feroz com machado colossal. Força bruta e resistência.',
        baseStats: { pv: 140, mp: 25, attack: 18, magic: 3, defense: 12, agility: 4 },
        image: 'assets/images/classes/barbaro.png',
        attacks: [
            { id: 'ataqueBasico', name: "Machadada", type: "physical", cost: 0, multiplier: 1.0, icon: "fa-solid fa-gavel", description: "Golpe pesado com machado sem custo de MP." },
            { id: 'furiaGuerreiro', name: "Fúria Bárbara", type: "physical", cost: 15, multiplier: 2.2, icon: "fa-solid fa-face-angry", description: "Ataque devastador com força máxima." },
            { id: 'girarMachado', name: "Girar Machado", type: "physical", cost: 10, multiplier: 1.4, icon: "fa-solid fa-spinner", description: "Gira o machado causando dano amplo." },
            { id: 'peleRochosa', name: "Pele Rochosa", type: "buff", cost: 8, targetStat: "defense", value: 8, duration: 3, icon: "fa-solid fa-mountain", description: "Aumenta Defesa em 8 por 3 turnos." }
        ]
    },
    'Caçador': {
        characterName: 'Gato Negro',
        kingdom: 'Sylvânia (Felinóide)',
        role: 'Batedor/Dano Corpo a Corpo Rápido',
        description: 'Gato negro ágil com machado afiado. Equilibra força e velocidade.',
        baseStats: { pv: 95, mp: 60, attack: 13, magic: 7, defense: 8, agility: 12 },
        image: 'assets/images/classes/cacador.png',
        attacks: [
            { id: 'ataqueBasico', name: "Corte Felino", type: "physical", cost: 0, multiplier: 1.0, icon: "fa-solid fa-cat", description: "Ataque rápido com machado sem custo de MP." },
            { id: 'garrasAfiadas', name: "Garras Afiadas", type: "physical", cost: 10, multiplier: 1.3, icon: "fa-solid fa-paw", description: "Combina garras e machado em ataque feroz." },
            { id: 'saltoMortal', name: "Salto Mortal", type: "physical", cost: 12, multiplier: 1.5, icon: "fa-solid fa-angles-up", description: "Salta e ataca com força devastadora." },
            { id: 'instintoCaca', name: "Instinto de Caça", type: "buff", cost: 8, targetStat: "agility", value: 6, duration: 3, icon: "fa-solid fa-binoculars", description: "Sentidos aguçados aumentam Agilidade em 6." }
        ]
    },
    'Clérigo': {
        characterName: 'Rassul',
        kingdom: 'Sultanato de Areth (Humano/Curandeiro)',
        role: 'Cura e Suporte',
        description: 'Sacerdote da luz com cajado sagrado. Cura aliados e repele trevas.',
        baseStats: { pv: 100, mp: 90, attack: 6, magic: 16, defense: 10, agility: 6 },
        image: 'assets/images/classes/clerigo.png',
        attacks: [
            { id: 'ataqueBasico', name: "Toque Sagrado", type: "magic", cost: 0, multiplier: 0.8, icon: "fa-solid fa-star", description: "Ataque mágico leve sem custo de MP." },
            { id: 'raioLuz', name: "Raio de Luz", type: "magic", cost: 12, multiplier: 1.3, icon: "fa-solid fa-sun", description: "Feixe de luz sagrada causa dano puro." },
            { id: 'curacao', name: "Cura Divina", type: "heal", cost: 15, value: 40, icon: "fa-solid fa-heart-pulse", description: "Restaura 40 PV com poder sagrado." },
            { id: 'benção', name: "Bênção Protetora", type: "buff", cost: 10, targetStat: "defense", value: 7, duration: 3, icon: "fa-solid fa-shield-halved", description: "Aumenta Defesa em 7 por 3 turnos." }
        ]
    },
    'Guerreiro': {
        characterName: 'Mako',
        kingdom: 'República de Aqua (Leonino/Paladino)',
        role: 'Tank Secundário/Dano',
        description: 'Leão nobre com espada e escudo. Defensor corajoso e combatente habilidoso.',
        baseStats: { pv: 125, mp: 40, attack: 16, magic: 5, defense: 14, agility: 7 },
        image: 'assets/images/classes/guerreiro.png',
        attacks: [
            { id: 'ataqueBasico', name: "Golpe de Espada", type: "physical", cost: 0, multiplier: 1.0, icon: "fa-solid fa-khanda", description: "Ataque básico com espada sem custo de MP." },
            { id: 'investida', name: "Investida Real", type: "physical", cost: 12, multiplier: 1.7, icon: "fa-solid fa-forward", description: "Carga poderosa com a força de um leão." },
            { id: 'escudoEspada', name: "Escudo e Espada", type: "physical", cost: 10, multiplier: 1.3, icon: "fa-solid fa-shield-cat", description: "Ataque equilibrado entre defesa e ataque." },
            { id: 'rugidoLeao', name: "Rugido do Leão", type: "buff", cost: 8, targetStat: "attack", value: 6, duration: 3, icon: "fa-solid fa-bullhorn", description: "Aumenta Ataque em 6 por 3 turnos." }
        ]
    },
    'Ladino': {
        characterName: 'Sasha',
        kingdom: 'Neutro (Espiã)',
        role: 'Debuffs/Desarmar Armadilhas',
        description: 'Mestre das sombras gótico com adagas gêmeas. Ataca do escuro com precisão mortal.',
        baseStats: { pv: 80, mp: 55, attack: 15, magic: 6, defense: 5, agility: 17 },
        image: 'assets/images/classes/ladino.png',
        attacks: [
            { id: 'ataqueBasico', name: "Corte Sombrio", type: "physical", cost: 0, multiplier: 1.0, icon: "fa-solid fa-pen-nib", description: "Ataque furtivo com adagas sem custo de MP." },
            { id: 'estocadaDupla', name: "Estocada Dupla", type: "physical", cost: 10, multiplier: 1.4, icon: "fa-solid fa-check-double", description: "Dois golpes rápidos e precisos." },
            { id: 'veneno', name: "Lâmina Envenenada", type: "physical", cost: 12, multiplier: 1.2, icon: "fa-solid fa-flask", description: "Ataque com veneno que causa dano contínuo." },
            { id: 'camuflagem', name: "Manto das Sombras", type: "buff", cost: 8, targetStat: "agility", value: 8, duration: 2, icon: "fa-solid fa-user-secret", description: "Funde-se às sombras, aumenta Agilidade em 8." }
        ]
    },
    'Mago': {
        characterName: 'Mago Ancião',
        kingdom: 'Sylvânia / Neutro',
        role: 'Dano Mágico/Controle',
        description: 'Ancião sábio dominador de magia arcana. Poder mágico supremo.',
        baseStats: { pv: 70, mp: 110, attack: 4, magic: 22, defense: 4, agility: 6 },
        image: 'assets/images/classes/mago.png',
        attacks: [
            { id: 'ataqueBasico', name: "Cajadada Mística", type: "magic", cost: 0, multiplier: 0.7, icon: "fa-solid fa-wand-sparkles", description: "Golpe com cajado imbuído de magia sem custo." },
            { id: 'meteorito', name: "Meteorito Arcano", type: "magic", cost: 18, multiplier: 2.0, icon: "fa-solid fa-meteor", description: "Invoca meteorito devastador do céu." },
            { id: 'relampago', name: "Relâmpago", type: "magic", cost: 12, multiplier: 1.5, icon: "fa-solid fa-bolt", description: "Descarga elétrica poderosa." },
            { id: 'concentracao', name: "Concentração Arcana", type: "buff", cost: 10, targetStat: "magic", value: 8, duration: 3, icon: "fa-solid fa-brain", description: "Aumenta Poder Mágico em 8 por 3 turnos." }
        ]
    },
    'Necromancer': {
        characterName: 'Zahara',
        kingdom: 'Sultanato de Areth',
        role: 'Dano Mágico Elevado (Fogo)',
        description: 'Maga do deserto, mestra do fogo e das areias. Poder mágico devastador.',
        baseStats: { pv: 75, mp: 100, attack: 5, magic: 20, defense: 5, agility: 8 },
        image: 'assets/images/classes/necromancer.png',
        attacks: [
            { id: 'ataqueBasico', name: "Toque Gélido", type: "magic", cost: 0, multiplier: 0.8, icon: "fa-solid fa-skull", description: "Toque necrótico sem custo de MP." },
            { id: 'drenaVida', name: "Drenar Vida", type: "magic", cost: 15, multiplier: 1.2, icon: "fa-solid fa-droplet", description: "Absorve vida do inimigo e cura a si mesmo." },
            { id: 'bolaSombria', name: "Bola Sombria", type: "magic", cost: 12, multiplier: 1.4, icon: "fa-solid fa-circle-dot", description: "Energia das trevas causa dano necrótico." },
            { id: 'maldicao', name: "Maldição Profana", type: "buff", cost: 10, targetStat: "magic", value: 7, duration: 3, icon: "fa-solid fa-biohazard", description: "Poder das trevas aumenta Magia em 7." }
        ]
    },
    'Tank': {
        characterName: 'Ferro-Velho',
        kingdom: 'Império de Ferro',
        role: 'Tank Principal (Defesa)',
        description: 'Orc colossal de músculos de aço. Defesa imbatível e força esmagadora.',
        baseStats: { pv: 150, mp: 30, attack: 14, magic: 3, defense: 18, agility: 3 },
        image: 'assets/images/classes/tank.png',
        attacks: [
            { id: 'ataqueBasico', name: "Soco Pesado", type: "physical", cost: 0, multiplier: 1.0, icon: "fa-solid fa-hand-fist", description: "Golpe poderoso sem custo de MP." },
            { id: 'esmagamento', name: "Esmagamento", type: "physical", cost: 15, multiplier: 1.8, icon: "fa-solid fa-weight-hanging", description: "Esmaga o inimigo com força brutal." },
            { id: 'provocar', name: "Provocação", type: "buff", cost: 8, targetStat: "defense", value: 10, duration: 3, icon: "fa-solid fa-comments", description: "Aumenta Defesa em 10 enquanto provoca." },
            { id: 'cura', name: "Regeneração Orc", type: "heal", cost: 12, value: 30, icon: "fa-solid fa-bandage", description: "Recupera 30 PV com regeneração natural." }
        ]
    }
};
