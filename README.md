# 🎮 O Anel dos Quatro Reinos
### RPG de Navegador em HTML5, CSS3 e JavaScript Vanilla

---

## 📖 Sobre o Jogo

**O Anel dos Quatro Reinos** é um RPG de navegador inspirado em clássicos como Pokémon e DragonCity, onde você embarca em uma jornada épica através de 7 mapas únicos para forjar o lendário Anel dos Quatro Reinos e derrotar o Guardião Final.

### 🎯 Objetivo
Atravesse 7 reinos perigosos, derrote 3 monstros em cada mapa, enfrente poderosos chefes e prove seu conhecimento através de desafios de quiz para conquistar o Anel Completo dos Quatro Reinos.

---

## ✨ Características Principais

### 🎭 Sistema de Classes
Escolha entre 5 heróis únicos, cada um com habilidades e estilos de combate distintos:

#### ⚔️ **Guerreiro**
- **Especialidade**: Combate corpo a corpo
- **Stats**: Alto PV e Ataque
- **Habilidades**:
  - Ataque Básico (0 MP) - Golpe físico padrão
  - Fúria (10 MP) - Ataque poderoso 1.8x
  - Grito de Guerra (5 MP) - +5 Defesa por 3 turnos

#### 🔮 **Mago**
- **Especialidade**: Magia destrutiva
- **Stats**: Alto MP e Magia
- **Habilidades**:
  - Cajadada (0 MP) - Ataque físico fraco com cajado
  - Bola de Fogo (10 MP) - Dano mágico 1.2x
  - Raio de Gelo (12 MP) - Dano mágico com lentidão
  - Escudo Arcano (15 MP) - +5 Magia por 3 turnos

#### 🗡️ **Ladino**
- **Especialidade**: Velocidade e furtividade
- **Stats**: Alta Agilidade
- **Habilidades**:
  - Golpe Rápido (0 MP) - Ataque físico veloz
  - Estoque Duplo (5 MP) - Ataque preciso 0.8x
  - Punhal de Veneno (8 MP) - 1.1x com efeito de veneno
  - Fuga Sombra (10 MP) - +5 Agilidade por 2 turnos

#### 🐂 **Minotauro**
- **Especialidade**: Defesa e resistência
- **Stats**: Alta Defesa e HP
- **Habilidades**:
  - Soco Básico (0 MP) - Ataque corpo a corpo
  - Defesa Total (5 MP) - +8 Defesa por 2 turnos
  - Cura Menor (15 MP) - Recupera 25 PV
  - Meditação (0 MP) - Recupera 10 MP

#### 🏹 **Caçador**
- **Especialidade**: Ataques à distância
- **Stats**: Balanceado com boa precisão
- **Habilidades**:
  - Flecha Simples (0 MP) - Ataque básico
  - Flecha de Fogo (8 MP) - 1.1x com bônus de fogo
  - Tiro de Precisão (15 MP) - 1.5x crítico garantido
  - Recuo Rápido (5 MP) - +3 Agilidade por 3 turnos

---

## 🗺️ Sistema de Mapas

O jogo possui **7 mapas progressivos** + **1 mapa final do boss**:

### Estrutura dos Mapas
Cada mapa contém:
- **3 Monstros Comuns** (M#_01, M#_02, M#_03)
- **1 Boss de Mapa** (M#_boss)

Os monstros aparecem visualmente no mapa e desaparecem conforme são derrotados. O boss só aparece após derrotar os 3 monstros comuns.

### 📂 Estrutura de Arquivos
```
assets/images/
├── scenes/
│   ├── Mapa1.png
│   ├── Mapa2.png
│   ├── Mapa3.png
│   ├── Mapa4.png
│   ├── Mapa5.png
│   ├── Mapa6.png
│   ├── Mapa7.png
│   └── MapaBoss.png
├── enemies/
│   ├── mapa01/ (M1_01.png, M1_02.png, M1_03.png, M1_boss.png)
│   ├── mapa02/ (M2_01.png, M2_02.png, M2_03.png, M2_boss.png)
│   ├── mapa03/
│   ├── mapa04/
│   ├── mapa05/
│   ├── mapa06/
│   ├── mapa07/
│   └── mapaBoss/
└── classes/
    ├── guerreiro-leao.png
    ├── mago-draconico.png
    ├── ladino-ondas.png
    ├── mino-cristal.png
    └── cacador-elemental.png
```

---

## ⚔️ Sistema de Combate

### Batalhas Individuais Estilo Pokémon
- **Sistema de Turnos**: Jogador ataca primeiro, depois o inimigo
- **Ataques Básicos**: Todas as classes têm ataque básico sem custo de MP
- **Habilidades Especiais**: Consomem MP mas causam mais dano ou aplicam efeitos
- **Buffs e Debuffs**: Sistema de modificadores temporários por turnos
- **Fuga**: Possibilidade de fugir do combate com chance baseada em agilidade

### Progressão de Dificuldade
- **Mapa 1**: Monstros fracos (30-40 HP, 8-10 ATK)
- **Mapa 2-3**: Dificuldade média (65-120 HP, 14-18 ATK)
- **Mapa 4-5**: Monstros fortes (110-140 HP, 20-24 ATK)
- **Mapa 6-7**: Muito difícil
- **Boss Final**: Extremamente poderoso (500 HP, 45 ATK, 30 DEF)

---

## 💰 Sistema Econômico

### Dinheiro
- Ganho ao derrotar inimigos
- Valores variam de 10 (monstros fracos) a 1000 (boss final)
- Atualização em tempo real no HUD

### 🏪 Loja
Itens disponíveis para compra:

#### Consumíveis
- **Poção de Cura** (50💰) - Recupera 30 PV
- **Poção de Mana** (40💰) - Recupera 20 MP
- **Poção Grande de Cura** (100💰) - Recupera 60 PV
- **Elixir de Mana** (80💰) - Recupera 40 MP
- **🔄 Revive** (200💰) - Revive após morte com 50% HP/MP

#### Equipamentos (Permanentes)
- **Espada de Ferro (+5 ATK)** - 150💰
- **Amuleto Arcano (+5 MAG)** - 150💰
- **Escudo de Pedra (+5 DEF)** - 120💰
- **Botas Rápidas (+5 AGI)** - 100💰

#### Itens Lendários (Fases 3-4)
- **Foco do Leão (+20 ATK)** - 800💰 🦁
- **Grimório Dracônico (+20 MAG)** - 800💰 🐉
- **Couraça dos Quatro Reinos (+15 DEF)** - 700💰 ⚖️
- **Botas do Vento Divino (+15 AGI)** - 700💰 🌪️

---

## 📱 Controles

### 🖥️ Desktop
- **WASD** ou **Setas** - Movimentação
- **E** - Explorar área
- **M** - Meditar (recupera MP)
- **I** - Abrir inventário
- **1-9** - Usar ataques em combate
- **F** - Fugir do combate
- **Espaço** - Usar primeiro ataque

### 📱 Mobile
- **Joystick Virtual** - Movimentação (canto inferior esquerdo)
- **Botões de Ação** - Explorar, Meditar, Inventário
- **Botões de Combate** - Toque nos ataques durante batalha

---

## 💾 Sistema de Salvamento

- **5 Slots de Save** independentes
- **Salvamento Automático** após cada ação importante
- **Salvamento Manual** através do menu
- **Dados Salvos**:
  - Classe escolhida
  - Stats do jogador
  - Fase atual e progresso
  - Inventário completo
  - Dinheiro
  - Quiz respondidos
  - Buffs ativos

---

## 🎯 Sistema de Quiz

- Perguntas sobre a história dos Quatro Reinos
- Aparecem aleatoriamente durante exploração
- **Quiz Final** obrigatório na Fase 5
- **Recompensas**: Restauração de HP/MP
- Necessário completar para enfrentar o boss final

---

## 🎨 Recursos Visuais

### Animações
- **Sprites Animados**: Personagens e inimigos com animações fluidas
- **Efeitos de Combate**: 
  - Ataques com shake e brilho
  - Recebimento de dano com feedback visual
  - Buffs com auras coloridas
- **Transições**: Mudanças de fase suaves
- **Notificações Épicas**: Popups para momentos importantes

### UI/UX
- **HUD Completo**: HP, MP, Dinheiro, XP sempre visível
- **Mini-mapa**: Indicador de posição do jogador
- **Inventory System**: Grade visual com ícones
- **Shop Interface**: Tabela organizada com categorias
- **Mobile-First**: Design responsivo otimizado

---

## 🎮 Mecânicas Especiais

### Sistema de Morte e Revive
1. **Ao Morrer** (PV = 0):
   - Tela de Game Over com imagem `victory/game_over.png`
   - **Opção 1**: Voltar ao menu e recomeçar
   - **Opção 2**: Usar **Revive** (se tiver no inventário)
     - Restaura 50% HP e MP
     - Retorna à exploração no mesmo mapa

### Drops de Itens
- Sistema de probabilidade para drops
- Itens raros dos bosses
- Anéis lendários dos chefes de fase

### Exploração
- Encontro aleatório com monstros (reduzido)
- Baús com tesouros
- Eventos especiais
- Quiz surpresa

---

## 🚀 Melhorias Implementadas (Versão Atual)

### ✅ Concluído
1. **Sistema de 3 Mobs Obrigatórios** - Derrote 3 para acessar boss
2. **Ataque Básico para Todas as Classes** - Sem custo de MP
3. **Balanceamento Progressivo** - Fase 1 mais fácil, aumenta gradualmente
4. **Tela de Game Over** - Imagem visual ao morrer
5. **Item Revive** - Segunda chance sem perder progresso
6. **Corrigido Sistema de Dinheiro** - Atualização em tempo real
7. **Melhorias CSS** - Botões, loja e inventário aprimorados
8. **Nova Estrutura de Pastas** - scenes/ e enemies/mapa##/
9. **Classes Renomeadas** - Nomes simplificados
10. **Joystick Mobile Otimizado** - Não move a tela

---

## 🔧 Requisitos Técnicos

- **Navegador Moderno** (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- **JavaScript Habilitado**
- **Resolução Mínima**: 360x640 (mobile) / 1024x768 (desktop)
- **Armazenamento Local**: ~1MB para saves

---

## 📝 Como Jogar

1. **Abra** `index.html` no navegador
2. **Escolha** sua classe na tela de criação de personagem
3. **Explore** o mapa usando WASD ou joystick mobile
4. **Clique** nos monstros para iniciar batalha
5. **Derrote** os 3 monstros comuns
6. **Enfrente** o boss do mapa
7. **Avance** para o próximo reino
8. **Complete** o quiz final na Fase 5
9. **Derrote** o Guardião Final
10. **Conquiste** o Anel Completo dos Quatro Reinos!

---

## 🎯 Dicas de Jogo

### Para Iniciantes
- Use **ataques básicos** para economizar MP nos monstros fracos
- **Medite** entre batalhas para recuperar MP
- Compre **Poções** antes de enfrentar bosses
- **Salve** frequentemente

### Para Avançados
- **Buffs** são cruciais contra bosses
- Invista em **equipamentos lendários** nas fases 3-4
- Mantenha sempre 1-2 **Revives** no inventário
- Priorize **Agilidade** para fugir quando necessário

### Builds Recomendadas
- **Guerreiro**: Foco em Ataque e Defesa
- **Mago**: Maximize Magia e MP
- **Ladino**: Agilidade e Ataque Múltiplo
- **Minotauro**: Tanque com Defesa e PV
- **Caçador**: Balanceado, versátil

---

## 🐛 Problemas Conhecidos & Soluções

### Mobile
- **Joystick move a tela**: Implementado `preventDefault()` nos eventos touch
- **Botões pequenos**: Aumentado tamanho mínimo para 44x44px

### Desktop
- **Performance**: Otimizado com `will-change` e transições CSS
- **Salvamento**: LocalStorage com validação e fallback

---

## 📜 Créditos

- **Desenvolvimento**: Paulo Roberto do Nascimento
- **Design**: Original
- **Engine**: Vanilla JavaScript + HTML5 Canvas
- **Assets**: Sprites customizados

---

## 📅 Histórico de Versões

### v0.0.04 (Atual) - 12/12/2024
- ✅ Sistema de 7 mapas implementado
- ✅ Nova estrutura de pastas (scenes, enemies/mapa##)
- ✅ Classes renomeadas para nomes simples
- ✅ Sistema de Revive
- ✅ Melhorias mobile (joystick, botões)
- ✅ Balanceamento de dificuldade progressivo
- ✅ Tela de Game Over visual
- ✅ Correção do sistema de dinheiro
- ✅ UI/UX aprimorado

### v0.0.03
- Sistema de quiz
- Boss final
- Itens lendários

### v0.0.02
- Sistema de save/load
- Loja funcional
- 5 classes jogáveis

### v0.0.01
- Conceito inicial
- Combate básico
- 2 fases

---

## 🔮 Roadmap Futuro

### Planejado
- [ ] Sistema de XP e Level Up
- [ ] Mais classes jogáveis
- [ ] Crafting system
- [ ] Conquistas (Achievements)
- [ ] Modo hardcore
- [ ] Multiplayer local
- [ ] Tradução para outros idiomas
- [ ] Trilha sonora original
- [ ] Mais mapas e chefes
- [ ] Sistema de pets/aliados

---

## 📞 Suporte

Para bugs, sugestões ou dúvidas:
- Abra uma issue no repositório
- Entre em contato: pauloroberto@example.com

---

## 📄 Licença

Este projeto está sob licença MIT. Veja arquivo LICENSE para mais detalhes.

---

**🎮 Boa Sorte, Herói! Que sua jornada pelos Quatro Reinos seja lendária! 🏆**
