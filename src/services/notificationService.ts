import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { Meta, ConfiguracoesNotificacao } from '../types/meta';

class NotificationService {
  private isNative = Capacitor.isNativePlatform();

  /**
   * Solicita permissão para envio de notificações (Nativo e Web/PWA)
   */
  async requestPermission(): Promise<boolean> {
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
   * Dispara uma notificação imediata de teste
   */
  async sendTestNotification(): Promise<boolean> {
    const hasPermission = await this.requestPermission();
    if (!hasPermission) return false;

    const titulo = '🔔 MetaCheck: Notificações Ativadas!';
    const corpo = 'Tudo pronto! Você receberá lembretes diários para não deixar nenhuma meta para trás 🚀';

    try {
      if (this.isNative) {
        await LocalNotifications.schedule({
          notifications: [
            {
              id: 999999,
              title: titulo,
              body: corpo,
              schedule: { at: new Date(Date.now() + 1000) },
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

    if (!this.isNative) return; // Notificações locais agendadas em background são nativas

    try {
      // Limpa notificações antigas agendadas
      await LocalNotifications.cancel({
        notifications: [{ id: 1001 }, { id: 1002 }]
      });

      const [horaMat, minMat] = config.horarioMatinal.split(':').map(Number);
      const [horaNot, minNot] = config.horarioNoturno.split(':').map(Number);

      const pendentes = metas.filter(m => m.tipo === 'diaria' && !m.concluidaHoje).length;
      const totalDiarias = metas.filter(m => m.tipo === 'diaria').length;

      // 1. Notificação Matinal (Diária)
      await LocalNotifications.schedule({
        notifications: [
          {
            id: 1001,
            title: '☀️ Bom dia, Foco nas Metas!',
            body: `Você tem ${totalDiarias} metas planejadas para hoje. Vamos começar com tudo? 🚀`,
            schedule: {
              on: {
                hour: horaMat || 8,
                minute: minMat || 0
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
            schedule: {
              on: {
                hour: horaNot || 20,
                minute: minNot || 0
              },
              allowWhileIdle: true
            },
            sound: 'default'
          }
        ]
      });

      // 3. Agendar lembretes individuais de metas que tenham horário específico
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

    try {
      const metasComHorario = metas.filter(m => m.tipo === 'diaria' && !m.concluidaHoje && m.horarioLembrete);
      
      const notifications = metasComHorario.map((meta, index) => {
        const [hora, min] = (meta.horarioLembrete || '09:00').split(':').map(Number);
        return {
          id: 2000 + index,
          title: `⏰ Lembrete: ${meta.titulo}`,
          body: meta.descricao || 'Hora de dar check na sua meta diária do MetaCheck!',
          schedule: {
            on: {
              hour: hora,
              minute: min
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
   * Dispara notificação comemorativa ao bater 100% das metas
   */
  async notifyAllCompleted(): Promise<void> {
    const hasPermission = await this.checkPermission();
    if (!hasPermission) return;

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
              schedule: { at: new Date(Date.now() + 500) },
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
