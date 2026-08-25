import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { Meta, ConfiguracoesNotificacao } from '../types/meta';

class NotificationService {
  private isNative = Capacitor.isNativePlatform();
  private channelId = 'metacheck_alarm_v2'; // Canal com ID novo para forçar o Android a aplicar som e pop-up flutuante

  constructor() {
    this.initChannel();
  }

  /**
   * Toca um som harmônico de sino cristalino usando Web Audio API
   */
  tocarSomNotificacao(): void {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Oscilador 1 (Nota fundamental - 587.33 Hz - D5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, ctx.currentTime);
      gain1.gain.setValueAtTime(0.3, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.8);

      // Oscilador 2 (Harmônico superior - 880 Hz - A5) com leve delay
      setTimeout(() => {
        try {
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(880, ctx.currentTime);
          gain2.gain.setValueAtTime(0.35, ctx.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.start();
          osc2.stop(ctx.currentTime + 1.2);
        } catch (e) {}
      }, 120);

      // Vibração no celular
      if ('vibrate' in navigator) {
        navigator.vibrate([150, 80, 150]);
      }
    } catch (e) {
      console.warn('Falha ao reproduzir áudio sintético:', e);
    }
  }

  /**
   * Inicializa o canal de alta prioridade (com som, vibração e banner flutuante heads-up)
   */
  async initChannel(): Promise<void> {
    if (!this.isNative) return;
    try {
      // Exclui canais legados se existirem
      try {
        await LocalNotifications.deleteChannel({ id: 'metacheck_high_priority' });
        await LocalNotifications.deleteChannel({ id: 'default' });
      } catch (e) {}

      // Cria o canal com prioridade máxima (IMPORTANCE_HIGH = 5)
      await LocalNotifications.createChannel({
        id: this.channelId,
        name: 'Alarmes e Lembretes MetaCheck',
        description: 'Disparos com som, vibração e aviso flutuante no topo da tela',
        importance: 5, // Força o Android a fazer o pop-up na tela (Heads-Up) e tocar o som
        visibility: 1, // Visível na tela de bloqueio
        sound: 'default',
        vibration: true,
        lights: true,
        lightColor: '#38bdf8'
      });
    } catch (err) {
      console.warn('Falha ao registrar canal de notificações:', err);
    }
  }

  /**
   * Solicita permissão para envio de notificações (Nativo e Web/PWA)
   */
  async requestPermission(): Promise<boolean> {
    await this.initChannel();
    try {
      if (this.isNative) {
        const status = await LocalNotifications.requestPermissions();
        return status.display === 'granted';
      }

      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      }

      return false;
    } catch (err) {
      console.warn('Erro ao solicitar permissão de notificação:', err);
      return false;
    }
  }

  /**
   * Verifica se as notificações estão autorizadas no dispositivo
   */
  async checkPermission(): Promise<boolean> {
    try {
      if (this.isNative) {
        const status = await LocalNotifications.checkPermissions();
        return status.display === 'granted';
      }

      if ('Notification' in window) {
        return Notification.permission === 'granted';
      }

      return false;
    } catch (err) {
      console.warn('Erro ao verificar permissão:', err);
      return false;
    }
  }

  /**
   * Dispara uma notificação imediata de teste com som e pop-up
   */
  async sendTestNotification(): Promise<boolean> {
    const hasPermission = await this.requestPermission();
    if (!hasPermission) return false;

    await this.initChannel();
    this.tocarSomNotificacao();

    const titulo = '🔔 MetaCheck: Alarme & Som Ativos!';
    const corpo = 'Som e banner flutuante no topo da tela funcionando perfeitamente! 🚀';

    try {
      if (this.isNative) {
        await LocalNotifications.schedule({
          notifications: [
            {
              id: 999999,
              title: titulo,
              body: corpo,
              channelId: this.channelId,
              schedule: {
                at: new Date(Date.now() + 100),
                allowWhileIdle: true
              },
              sound: 'default',
              smallIcon: 'ic_launcher_round',
              actionTypeId: '',
              extra: null
            }
          ]
        });
        return true;
      }

      if ('Notification' in window && Notification.permission === 'granted') {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          const reg = await navigator.serviceWorker.ready;
          await reg.showNotification(titulo, {
            body: corpo,
            icon: '/icon-192.png',
            badge: '/icon-192.png'
          });
        } else {
          new Notification(titulo, {
            body: corpo,
            icon: '/icon-192.png'
          });
        }
        return true;
      }
    } catch (err) {
      console.error('Erro ao enviar notificação de teste:', err);
    }

    return false;
  }

  /**
   * Agenda os lembretes diários automáticos (Matinal e Noturno)
   */
  async scheduleDailyReminders(config: ConfiguracoesNotificacao, metas: Meta[]): Promise<void> {
    if (!config.ativado) {
      await this.cancelAll();
      return;
    }

    const hasPermission = await this.checkPermission();
    if (!hasPermission) return;

    if (!this.isNative) return;

    await this.initChannel();

    try {
      await LocalNotifications.cancel({
        notifications: [{ id: 1001 }, { id: 1002 }]
      });

      const [horaMat, minMat] = config.horarioMatinal.split(':').map(Number);
      const [horaNot, minNot] = config.horarioNoturno.split(':').map(Number);

      const pendentes = metas.filter(m => m.tipo === 'diaria' && !m.concluidaHoje).length;
      const totalDiarias = metas.filter(m => m.tipo === 'diaria').length;

      await LocalNotifications.schedule({
        notifications: [
          // 1. Notificação Matinal (Com som e banner no topo)
          {
            id: 1001,
            title: '☀️ Bom dia, Foco nas Metas!',
            body: `Você tem ${totalDiarias} metas planejadas para hoje. Vamos começar com tudo? 🚀`,
            channelId: this.channelId,
            schedule: {
              on: {
                hour: isNaN(horaMat) ? 8 : horaMat,
                minute: isNaN(minMat) ? 0 : minMat
              },
              allowWhileIdle: true
            },
            sound: 'default'
          },
          // 2. Notificação Noturna (Revisão de Metas Pendentes)
          {
            id: 1002,
            title: '🌙 Revisão do Dia — MetaCheck',
            body: pendentes > 0 
              ? `Ainda restam ${pendentes} metas para concluir hoje! Que tal bater seu 100%? 🔥`
              : 'Excelente! Todas as metas de hoje foram cumpridas com sucesso 🎉',
            channelId: this.channelId,
            schedule: {
              on: {
                hour: isNaN(horaNot) ? 20 : horaNot,
                minute: isNaN(minNot) ? 0 : minNot
              },
              allowWhileIdle: true
            },
            sound: 'default'
          }
        ]
      });

      // 3. Agendar lembretes individuais
      if (config.lembreteIndividual) {
        await this.scheduleIndividualGoalReminders(metas);
      }
    } catch (err) {
      console.warn('Erro ao agendar lembretes diários:', err);
    }
  }

  /**
   * Agenda lembretes específicos para metas com horário configurado
   */
  async scheduleIndividualGoalReminders(metas: Meta[]): Promise<void> {
    if (!this.isNative) return;

    await this.initChannel();

    try {
      const metasComHorario = metas.filter(m => m.tipo === 'diaria' && !m.concluidaHoje && m.horarioLembrete);
      
      const notifications = metasComHorario.map((meta, index) => {
        const [hora, min] = (meta.horarioLembrete || '09:00').split(':').map(Number);
        return {
          id: 2000 + index,
          title: `⏰ Lembrete: ${meta.titulo}`,
          body: meta.descricao || 'Hora de dar check na sua meta diária do MetaCheck!',
          channelId: this.channelId,
          schedule: {
            on: {
              hour: isNaN(hora) ? 9 : hora,
              minute: isNaN(min) ? 0 : min
            },
            allowWhileIdle: true
          },
          sound: 'default'
        };
      });

      if (notifications.length > 0) {
        await LocalNotifications.schedule({ notifications });
      }
    } catch (err) {
      console.warn('Erro ao agendar lembretes específicos:', err);
    }
  }

  /**
   * Dispara notificação comemorativa imediata ao bater 100% das metas
   */
  async notifyAllCompleted(): Promise<void> {
    const hasPermission = await this.checkPermission();
    if (!hasPermission) return;

    await this.initChannel();
    this.tocarSomNotificacao();

    const titulo = '🔥 100% DAS METAS BATIDAS!';
    const corpo = 'Incrível! Você concluiu todas as suas metas de hoje e aumentou sua sequência! 🏆';

    try {
      if (this.isNative) {
        await LocalNotifications.schedule({
          notifications: [
            {
              id: 9999,
              title: titulo,
              body: corpo,
              channelId: this.channelId,
              schedule: {
                at: new Date(Date.now() + 100),
                allowWhileIdle: true
              },
              sound: 'default'
            }
          ]
        });
      } else if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(titulo, { body: corpo, icon: '/icon-192.png' });
      }
    } catch (err) {
      console.warn('Erro ao disparar notificação comemorativa:', err);
    }
  }

  /**
   * Cancela todas as notificações ativas
   */
  async cancelAll(): Promise<void> {
    if (this.isNative) {
      try {
        const pending = await LocalNotifications.getPending();
        if (pending.notifications.length > 0) {
          await LocalNotifications.cancel(pending);
        }
      } catch (err) {
        console.warn('Erro ao cancelar notificações:', err);
      }
    }
  }
}

export const notificationService = new NotificationService();
