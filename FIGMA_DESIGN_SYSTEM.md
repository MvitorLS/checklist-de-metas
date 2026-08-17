# 🎨 MetaCheck — Especificação de Engenharia Reversa para Figma (Design System & Telas)

Este documento contém a **engenharia reversa completa** do aplicativo **MetaCheck**, estruturado para modelagem e criação no **Figma** (Frames mobile de `393 x 852 px` — padrão iPhone 16 / Android moderno).

---

## 🌈 1. Tokens de Design (Design Tokens)

### 🎨 Paleta de Cores (Color Styles)
| Token | HEX | Função / Uso |
| :--- | :--- | :--- |
| **`bg/canvas`** | `#030712` | Fundo externo do viewport |
| **`bg/app`** | `#090D16` | Fundo principal do app mobile |
| **`surface/card`** | `#131B2E` | Cartões de metas e containers |
| **`surface/card-hover`**| `#1B2640` | Estado hover / focado |
| **`surface/input`** | `#1A233A` | Campos de formulário e checkboxes vazios |
| **`border/subtle`** | `#233050` | Bordas e divisores sutis |
| **`primary/cyan`** | `#38BDF8` | Cor primária, botões de ação e destaques |
| **`primary/gradient`**| `linear(135deg, #0EA5E9, #3B82F6, #6366F1)` | Banner Hero do Dashboard |
| **`accent/emerald`** | `#34D399` | Status Concluído / Check-off |
| **`accent/flame`** | `#FB923C` | Streaks de dias seguidos (Fogo) |
| **`accent/purple`** | `#818CF8` | Metas Anuais e tags de carreira |
| **`text/primary`** | `#F8FAFC` | Títulos e textos com alto contraste |
| **`text/secondary`** | `#94A3B8` | Subtítulos e descrições |
| **`text/muted`** | `#64748B` | Textos desativados e placeholders |

---

### 🔤 Tipografia (Text Styles)
* **Família:** `Plus Jakarta Sans` (Google Fonts)

| Estilo no Figma | Tamanho | Peso | Line Height | Tracking | Uso |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`Display/Large`** | `36px` | 800 (Bold) | `44px` | `-1px` | Porcentagens do Hero Banner |
| **`Heading/Screen`** | `22px` | 800 (Bold) | `28px` | `-0.5px`| Título do Header e Telas |
| **`Heading/Section`**| `18px` | 700 (Bold) | `24px` | `-0.3px`| Títulos de seções nos cards |
| **`Body/Title`** | `15px` | 700 (Bold) | `20px` | `0px` | Título da Meta nos cards |
| **`Body/Regular`** | `13px` | 500 (Medium) | `18px` | `0px` | Descrições e subtarefas |
| **`Caption/Bold`** | `11px` | 700 (Bold) | `14px` | `+0.5px` | Badges, tags e Bottom Nav |

---

### 📐 Formas, Cantos e Sombras (Effects & Corner Radius)
* **Corner Radius (Border Radius):**
  * `Pills & Badges:` `9999px` (Full Circle)
  * `Cards:` `18px`
  * `Banners & Modais:` `24px`
  * `Inputs & Botões:` `12px`
  * `Checkboxes:` `10px`
* **Effects (Drop Shadows):**
  * `Card Elevation:` `X: 0, Y: 10, Blur: 30, Spread: -10, Color: rgba(0, 0, 0, 0.5)`
  * `Primary Glow:` `X: 0, Y: 0, Blur: 20, Color: rgba(56, 189, 248, 0.3)`
  * `FAB Button Shadow:` `X: 0, Y: 4, Blur: 18, Color: rgba(56, 189, 248, 0.5)`

---

## 📱 2. Especificação dos Frames / Telas (Mobile `393 x 852 px`)

### 1️⃣ Frame: `📱 01_Home_Dashboard`
1. **Header Fixo (`H: 80px`):**
   * Label: `METAS PESSOAIS` (Caption/Bold, `#38BDF8`)
   * Título: `MetaCheck` (Heading/Screen, `#F8FAFC`)
   * Ícone à direita: Target icon em container circular `#131B2E`.
2. **Hero Card Banner (`H: 140px`):**
   * Background: Gradiente Azul $\rightarrow$ Índigo.
   * Topo: Badge Pill `🔥 7 dias seguidos` + Tag `HOJE`.
   * Centro: `75%` (Display/Large).
   * Barra de progresso com preenchimento em branco (`H: 8px`).
   * Rodapé: `3 de 4 metas diárias concluídas hoje`.
3. **Filter Scroll Horizontal:**
   * Pills selecionáveis: `Todas`, `Saúde`, `Estudos`, `Finanças`, `Carreira`, `Pessoal`.
4. **Seção Checklist de Hoje:**
   * MetaCards diários com botão checkbox grande à esquerda.
5. **Seção Metas em Andamento:**
   * MetaCards mensais/anuais com indicador de porcentagem e barra de progresso.
6. **Bottom Navigation Bar (`H: 74px`):**
   * 4 abas (`Início`, `Diárias`, `Mensais`, `Anuais`) + Botão Central Flutuante FAB (`+`).

---

### 2️⃣ Frame: `📱 02_Metas_Diarias`
* **Segmented Control no Topo:** `Todas (3)` | `Pendentes (1)` | `Feitas (2)`.
* **Cards com Streaks:** Ícone de chama com número de dias seguidos.
* **Micro-interação de Check:** Botão com transição de `#1A233A` para `#34D399` com ícone de `Check` branco.

---

### 3️⃣ Frame: `📱 03_Metas_Mensais`
* **Progresso Incremental:** Porcentagem calculada a partir de subtarefas.
* **Componente Accordion de Etapas:**
  * Linha da subtarefa com checkbox compacto de `18 x 18 px`.
  * Botão `+ Adicionar etapa` para planejamento rápido.

---

### 4️⃣ Frame: `📱 04_Metas_Anuais`
* **Banner Visão Anual (`Gradiente Índigo-Púrpura`):** Mostra a média ponderada de todas as grandes metas do ano.
* **Data Prazo em Destaque:** Exibição com ícone de calendário.

---

### 5️⃣ Frame: `📱 05_Modal_Nova_Meta (Bottom Sheet)`
* **Overlay:** `rgba(0, 0, 0, 0.75)` com Blur de `8px`.
* **Container Sheet:** Canto superior arredondado `24px`, background `#131B2E`.
* **Pill Handler central:** `40 x 4 px` em `#233050`.
* **Toggle Segmentado:** `Diária` | `Mensal` | `Anual`.
* **Campos:** Título, Descrição, Categoria (Dropdown) e Construtor Dinâmico de Subtarefas.
* **Botão Primário:** `Criar Meta` com gradiente ciano-índigo.
