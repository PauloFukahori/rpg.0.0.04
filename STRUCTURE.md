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

### 2. **classes.js** (240+ linhas)
- Objeto `CLASSES` com 11 classes jogáveis:
  - **Guerreiro**: Tank com alto PV e dano físico
  - **Mago**: Dano mágico elevado, baixa defesa  
  - **Ladino**: Ataques rápidos e alta agilidade
  - **Minotauro**: Defensor com habilidades de cura
  - **Caçador**: Atirador versátil
  - **Paladino**: Tanque com cura e resistência
  - **Necromante**: Controle de mortos-vivos
  - **Bardo**: Suporte com buffs de grupo
  - **Monge**: Artes marciais e velocidade
  - **Druida**: Controle da natureza
  - **Bárbaro**: Fúria e dano bruto
- Cada classe tem: stats base, 4 ataques únicos, lore, imagem

### 3. **mobs.js** (180+ linhas) 
- Objeto `ENEMIES` com todos os inimigos:
  - 21+ mobs comuns (3 por fase, fases 1-7)
  - 8 bosses únicos (1 por fase)
  - Sistema de drops com anéis de boss
- Cada inimigo tem: PV, ataque, defesa, recompensas, drops, sprite
- Boss drops: Anéis com buffs permanentes

### 4. **maps.js** (200+ linhas)
- Objeto `PHASES` com 8 fases do jogo:
  - Fases 1-7: Reinos diversos com lore expandida
  - Fase 8: Boss final épico
- Cada fase tem: nome, cenário, intro, inimigos únicos, boss exclusivo
- Sistema de spawn: 3 kills → 70% chance boss aparecer

### 5. **items.js** (69 linhas)
- `RANDOM_ITEMS`: Drops aleatórios (poções, buffs, debuffs)
- `QUIZ_QUESTIONS`: Perguntas do quiz com recompensas
- `SHOP_ITEMS`: Itens vendidos na loja (consumíveis e equipamentos)

### 6. **main.js** (3320+ linhas) ✅
- **Sistemas Implementados**:
  - ✅ Sistema de 3 vidas com penalidades progressivas
  - ✅ Inventário baseado em objetos (não array)
  - ✅ Sistema de anéis com 4 slots de equipamento
  - ✅ Boss spawn com 70% de chance após 3 kills
  - ✅ Sistema de save/load com 5 slots
  - ✅ Combate com uso de inventário
  - ✅ Loja com 70+ itens organizados
  - ✅ Share no WhatsApp e quiz de lore

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

## 🚀 Estado Atual das Melhorias

1. ✅ Estrutura modular de pastas
2. ✅ CSS movido para pasta própria  
3. ✅ JavaScript dividido em módulos básicos
4. ✅ Sistema de 8 mapas com mobs individuais implementado
5. ✅ Sistema de anéis e equipamentos funcionando
6. ✅ Sistema de 3 vidas com morte progressiva
7. ✅ Boss spawn com 70% chance implementado
8. ✅ Inventário reescrito (objeto vs array)
9. ⏳ Dividir `main.js` em submódulos funcionais
10. ⏳ Dividir `style.css` em módulos temáticos

## 📝 Notas de Desenvolvimento

- **Backups**: Todos os scripts originais estão em `/old/`
- **Encoding**: Arquivos em UTF-8 (cuidado com caracteres especiais)
- **Compatibilidade**: Testado em navegadores modernos (Chrome, Firefox, Edge)
- **Mobile**: Joystick touch implementado (precisa fix de preventDefault)

---

**Última atualização**: 12 de dezembro de 2025
**Status**: Jogo completamente funcional com 8 fases ✅  
**Versão**: 0.0.04 - Sistema de anéis e 3 vidas implementado
