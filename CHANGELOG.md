# 📋 Changelog — MetaCheck

Todas as alterações e versões deste projeto são documentadas neste arquivo.

---

## [Não lançado]

### Correções
* **Topo da tela inicial cortado:** o card de sequência e a linha de filtros encolhiam dentro da coluna flex de altura fixa (`.screen-content`). Filhos agora usam `flex-shrink: 0`.

---

## [1.1.0] — 2026-08-23

### 📱 Correções de Layout e Responsividade Mobile
* **Centralização da BottomNav:** Corrigido desalinhamento horizontal da barra inferior em telas mobile e tablets (`left: 50%; transform: translateX(-50%)`).
* **Suporte a Safe Area Insets:** Integração de variáveis CSS (`env(safe-area-inset-top)` e `env(safe-area-inset-bottom)`) para evitar colisão com entalhes de câmera e barra de gestos do Android/iOS.
* **Prevenção de Overflow e Quebra de Linha:** Adicionado `min-width: 0` e `word-break: break-word` nos cards para eliminar scrolls horizontais acidentais.
* **Altura Dinâmica (`100dvh`):** Ajuste de viewport para evitar cortes causados pela barra do navegador móvel.
* **Build Nativo Android:** Atualizada compatibilidade com Java 17 no Gradle e gerado APK atualizado (`v1.1.0`).

---

## [1.0.0] — 2026-08-16

### ✨ Funcionalidades Principais
* **Níveis de Metas:** Módulos dedicados para metas diárias, mensais e anuais.
* **Subtarefas Incrementais:** Criação e acompanhamento de etapas com cálculo percentual em tempo real.
* **Check-off com Celebração:** Micro-interações táteis e efeito de confetes ao concluir metas.
* **Filtros por Categoria:** Tags dinâmicas (Saúde, Estudos, Finanças, Carreira, Pessoal).
* **Engenharia Reversa para Figma:** Documentação completa em `FIGMA_DESIGN_SYSTEM.md`.
