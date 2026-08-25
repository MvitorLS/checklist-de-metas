# 🎯 MetaCheck — Gestão de Metas Diárias, Mensais e Anuais

<div align="center">

![Versão](https://img.shields.io/badge/versão-1.3.2-38bdf8?style=for-the-badge&logo=android&logoColor=white)
![React 19](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?style=for-the-badge&logo=typescript&logoColor=white)
![Capacitor](https://img.shields.io/badge/Capacitor-7.0-119eff?style=for-the-badge&logo=capacitor&logoColor=white)
![Licença](https://img.shields.io/badge/licença-MIT-10b981?style=for-the-badge)

<br/>

**Aplicativo Mobile Nativo & PWA para Gestão de Metas, Hábitos e Alarmes em Tempo Real.**

[📥 Baixar APK Android (v1.3.2)](https://github.com/MvitorLS/checklist-de-metas/releases/latest) • [🎨 Design System](./FIGMA_DESIGN_SYSTEM.md) • [✨ Releases](https://github.com/MvitorLS/checklist-de-metas/releases)

</div>

---

## 📱 Visão Geral

O **MetaCheck** é um aplicativo mobile híbrido de alta performance desenvolvido para acompanhar hábitos diários, objetivos mensais e metas estratégicas anuais com foco em produtividade pessoal, alarmes nativos e design personalizável.

### 🌟 Principais Recursos

1. **🔔 Sistema de Notificações & Alarmes Nativos**:
   - **Lembrete Matinal (08:00)**: Resumo das metas do dia logo cedo para planejar o foco.
   - **Revisão Noturna (20:00)**: Lembrete com contagem das metas pendentes para fechar o dia em 100%.
   - **Alarmes Individuais**: Definição de horários específicos por meta com disparo no segundo exato (`SCHEDULE_EXACT_ALARM`).
   - **Pop-up Heads-Up com Som & Vibração**: Notificações com canal de alta prioridade (`IMPORTANCE_HIGH = 5`) e som harmônico sintetizado via Web Audio.
   - **Celebração de Vitória**: Notificação comemorativa automática e confetes na tela ao bater todas as metas diárias.

2. **🌈 Motor de 5 Temas Visuais Dinâmicos**:
   - 🌙 **Tokyo Dark**: Azul neon & marinho escuro (tema padrão moderno).
   - 🌌 **OLED Pitch Black**: Preto puro (`#000000`) com acentos esmeralda para economia de bateria.
   - ☀️ **Porcelain Light**: Tema claro e minimalista com acentos azul oceano.
   - 🟣 **Cyberpunk Neon**: Roxo profundo (`#0d071a`) com acentos magenta/rose neon.
   - 🌲 **Emerald Forest**: Tons floresta/saúde com verde esmeralda.

3. **💾 Central de Backup & Exportação**:
   - 📥 **Backup Completo (JSON)**: Exportação e restauração completa de dados em 1 clique.
   - 📊 **Exportação em Planilha (CSV)**: Relatórios formatados para abrir no Excel ou Google Planilhas.
   - 🔒 **Privacidade Total**: Todos os dados e configurações são armazenados 100% offline no dispositivo.

4. **🎯 3 Horizontes de Tempo**:
   - **Diárias:** Hábitos com check-off rápido, dias seguidos (*streaks*) e cálculo da taxa de conclusão.
   - **Mensais:** Objetivos de médio prazo divididos em etapas/subtarefas dinâmicas com progresso incremental (0–100%).
   - **Anuais:** Metas estratégicas de longo prazo com acompanhamento de prazos.

---

## 🛠️ Tecnologias Utilizadas

* **Frontend:** React 19, TypeScript, Vite
* **Mobile Runtime:** Capacitor 7 (Android / iOS / PWA)
* **Notificações:** `@capacitor/local-notifications`, Web Notifications API, Web Audio API
* **Ícones & UI:** Lucide React, Canvas Confetti, CSS Custom Properties Dinâmicas
* **Build Android:** Gradle 8.13, OpenJDK 17, Android SDK 35/36

---

## 🚀 Como Rodar Localmente

```bash
# Instalar dependências
npm install

# Rodar servidor de desenvolvimento
npm run dev

# Compilar para produção Web / PWA
npm run build

# Sincronizar com o projeto Android
npx cap sync android
```

---

## 📦 Como Instalar o APK no Android

1. Acesse a aba de [Releases do GitHub](https://github.com/MvitorLS/checklist-de-metas/releases/latest).
2. Baixe o arquivo **`MetaCheck-v1.3.2-sound-alarm.apk`**.
3. Abra o arquivo no seu smartphone Android e confirme a instalação.

---

## 📄 Licença

Distribuído sob a licença MIT. Desenvolvido por [Matheus Vitor Lourenço Schionato](https://github.com/MvitorLS).
