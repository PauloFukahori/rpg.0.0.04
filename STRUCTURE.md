# 📁 Estrutura do Projeto - O Anel dos Quatro Reinos RPG

## 🎯 Nova Organização Modular

O projeto foi reorganizado para melhorar a manutenibilidade e separação de responsabilidades.

## 📂 Estrutura de Diretórios

```
rpg.0.0.04/
├── index.html              # Página principal do jogo
├── README.md               # Documentação do jogo
├── STRUCTURE.md            # Este arquivo - estrutura do projeto
│
├── css/                    # Arquivos de estilo
│   └── style.css          # Estilos principais (888+ linhas)
│
├── js/                     # Módulos JavaScript
│   ├── config.js          # Configurações globais e gameState
│   ├── classes.js         # Definições das 5 classes de personagens
│   ├── mobs.js            # Definições dos inimigos (mobs e bosses)
│   ├── maps.js            # Definições das fases/mapas
│   ├── items.js           # Itens (loot, shop, quiz)
│   └── main.js            # Lógica principal do jogo (2012 linhas)
│
├── assets/                 # Recursos do jogo
│   ├── audio/             # Músicas e efeitos sonoros
│   └── images/            # Imagens do jogo
│       ├── classes/       # Sprites das classes
│       ├── enemies/       # Sprites dos inimigos
│       │   ├── mapa01-07/ # Inimigos por mapa (3 mobs + 1 boss cada)
│       │   └── mapaBoss/  # Boss final
│       ├── items/         # Ícones de itens
│       ├── scenarios/     # Cenários das fases
│       ├── scenes/        # Imagens dos mapas (Mapa1-7.png, MapaBoss.png)
│       └── victory/       # Telas de vitória
│
└── old/                    # Backups dos arquivos antigos
    ├── script.js          # Script original (antes da modularização)
    ├── script2.js         # Backup secundário
    └── script_backup.js   # Outro backup
```

## 🔧 Módulos JavaScript

### 1. **config.js** (45 linhas)
- Constantes globais (`SAVE_SLOT_KEY`, `MAX_SAVE_SLOTS`)
- `gameState`: Estado principal do jogo (player, inventory, fase, money, etc)
- `combatState`: Estado temporário das batalhas
- `selectedClass`: Classe selecionada

### 2. **classes.js** (62 linhas)
- Objeto `CLASSES` com 5 classes jogáveis:
  - **Guerreiro**: Tank com alto PV e dano físico
  - **Mago**: Dano mágico elevado, baixa defesa
  - **Ladino**: Ataques rápidos e alta agilidade
  - **Minotauro**: Defensor com habilidades de cura
  - **Caçador**: Atirador versátil
- Cada classe tem: stats base, ataques, imagem

### 3. **mobs.js** (32 linhas)
- Objeto `ENEMIES` com todos os inimigos:
  - 8 mobs comuns (fases 1-4)
  - 4 bosses de fase
  - 1 boss final
- Cada inimigo tem: PV, ataque, defesa, recompensas, drops, sprite

### 4. **maps.js** (36 linhas)
- Objeto `PHASES` com 5 fases do jogo:
  - Fases 1-4: Reinos elementais (Fogo, Água, Terra, Ar)
  - Fase 5: Quiz final + Boss final
- Cada fase tem: nome, cenário, intro, inimigos, boss, kills necessárias

### 5. **items.js** (69 linhas)
- `RANDOM_ITEMS`: Drops aleatórios (poções, buffs, debuffs)
- `QUIZ_QUESTIONS`: Perguntas do quiz com recompensas
- `SHOP_ITEMS`: Itens vendidos na loja (consumíveis e equipamentos)

### 6. **main.js** (2012 linhas) ⚠️
- **TODO**: Este arquivo ainda contém toda a lógica do jogo
- Futuramente deve ser dividido em:
  - `battles.js`: Sistema de combate
  - `audio.js`: Controle de música
  - `victory.js`: Tela de vitória
  - `game-over.js`: Tela de game over
  - `saves.js`: Sistema de save/load
  - `ui.js`: Funções de interface

## 📋 Ordem de Carregamento (index.html)

```html
<script src="js/config.js"></script>    <!-- 1. Configurações -->
<script src="js/classes.js"></script>   <!-- 2. Classes -->
<script src="js/mobs.js"></script>      <!-- 3. Inimigos -->
<script src="js/maps.js"></script>      <!-- 4. Mapas -->
<script src="js/items.js"></script>     <!-- 5. Itens -->
<script src="js/main.js"></script>      <!-- 6. Lógica principal -->
```

⚠️ **IMPORTANTE**: A ordem é crítica! Os módulos dependem uns dos outros.

## 🎨 CSS

Por enquanto, todo o CSS está em `css/style.css` (888+ linhas).

**Sugestão para futura divisão:**
- `base.css`: Reset, variáveis, tipografia
- `layout.css`: Grid, containers, estrutura
- `ui.css`: Botões, cards, popups
- `combat.css`: Interface de batalha
- `mobile.css`: Responsividade e touch controls

## 🚀 Próximas Melhorias

1. ✅ Estrutura modular de pastas
2. ✅ CSS movido para pasta própria
3. ✅ JavaScript dividido em módulos básicos
4. ⏳ Dividir `main.js` em submódulos funcionais
5. ⏳ Dividir `style.css` em módulos temáticos
6. ⏳ Implementar sistema de 7 mapas com mobs individuais
7. ⏳ Adicionar sistema de spawn visual de mobs
8. ⏳ Melhorar UI/UX da tela inicial

## 📝 Notas de Desenvolvimento

- **Backups**: Todos os scripts originais estão em `/old/`
- **Encoding**: Arquivos em UTF-8 (cuidado com caracteres especiais)
- **Compatibilidade**: Testado em navegadores modernos (Chrome, Firefox, Edge)
- **Mobile**: Joystick touch implementado (precisa fix de preventDefault)

---

**Última atualização**: Dezembro 2025
**Status**: Estrutura modular básica implementada ✅
