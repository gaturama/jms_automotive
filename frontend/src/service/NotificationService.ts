import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PUSH_TOKEN_KEY = '@CarShowroom:pushToken';
const DAILY_NOTIFICATION_ID = '@CarShowroom:dailyNotificationId';
const WEEKLY_NOTIFICATION_ID = '@CarShowroom:weeklyNotificationId';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Registrar para notificações push
 */
export async function registerForPushNotificationsAsync(): Promise<string | undefined> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#DC143C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Permissão para notificações negada');
    return undefined;
  }

  console.log('Notificações locais habilitadas');
  
  return 'local-notifications-enabled';
}

/**
 * Obter token salvo
 */
export async function getSavedPushToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(PUSH_TOKEN_KEY);
  } catch (error) {
    console.error('Erro ao obter push token:', error);
    return null;
  }
}

/**
 * Agendar notificação local
 */
export async function scheduleLocalNotification(
  title: string,
  body: string,
  data?: any,
  seconds: number = 0
): Promise<string> {
  let trigger: Notifications.NotificationTriggerInput | null = null;
  
  if (seconds > 0) {
    trigger = {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds,
    };
  }

  return await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: true,
      badge: 1,
    },
    trigger,
  });
}

/**
 * Cancelar notificação agendada
 */
export async function cancelScheduledNotification(notificationId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

/**
 * Cancelar todas notificações
 */
export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Obter notificações agendadas
 */
export async function getScheduledNotifications() {
  return await Notifications.getAllScheduledNotificationsAsync();
}

/**
 * Notificações pré-definidas para o app
 */
export async function notifyNewCar(carName: string, carBrand: string) {
  return await scheduleLocalNotification(
    'Novo Carro Disponível!',
    `${carBrand} ${carName} foi adicionado à galeria!`,
    { type: 'new_car', carName, carBrand }
  );
}

export async function notifyPromotion(carName: string, discount: string) {
  return await scheduleLocalNotification(
    'Promoção Especial!',
    `${carName} com ${discount}% de desconto por tempo limitado!`,
    { type: 'promotion', carName, discount }
  );
}

export async function notifyVisitReminder(carName: string, delaySeconds: number = 86400) {
  return await scheduleLocalNotification(
    'Que tal voltar a ver?',
    `Você gostou de ${carName}. Quer ver mais detalhes?`,
    { type: 'reminder', carName },
    delaySeconds
  );
}

export async function notifyWeeklyUpdate(totalCars: number) {
  return await scheduleLocalNotification(
    'Resumo Semanal',
    `${totalCars} carros na sua lista de favoritos. Confira as novidades!`,
    { type: 'weekly_update', totalCars }
  );
}

export async function notifyFavoriteAvailable(carName: string) {
  return await scheduleLocalNotification(
    'Seu Favorito Disponível!',
    `${carName} está disponível para consulta. Não perca!`,
    { type: 'favorite_available', carName }
  );
}

export async function notifyNewReview(carName: string, rating: number) {
  const stars = '⭐'.repeat(rating);
  return await scheduleLocalNotification(
    '📝 Nova Avaliação',
    `${carName} recebeu uma nova avaliação: ${stars}`,
    { type: 'new_review', carName, rating }
  );
}

export async function notifyComparisonReady(car1: string, car2: string) {
  return await scheduleLocalNotification(
    'Comparação Pronta',
    `Comparação entre ${car1} e ${car2} está disponível!`,
    { type: 'comparison_ready', car1, car2 }
  );
}

/**
 * Notificações agendadas (daily, weekly)
 */
export async function scheduleDailyNotification() {
  const existingId = await AsyncStorage.getItem(DAILY_NOTIFICATION_ID);
  if (existingId) {
    await Notifications.cancelScheduledNotificationAsync(existingId);
  }

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'JMS Car Showroom',
      body: 'Confira os novos carros adicionados hoje!',
      data: { type: 'daily_check' },
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 12,
      minute: 0,
    },
  });

  await AsyncStorage.setItem(DAILY_NOTIFICATION_ID, notificationId);
  console.log('Notificação diária agendada:', notificationId);
}

export async function scheduleWeeklyNotification() {
  const existingId = await AsyncStorage.getItem(WEEKLY_NOTIFICATION_ID);
  if (existingId) {
    await Notifications.cancelScheduledNotificationAsync(existingId);
  }

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Resumo Semanal',
      body: 'Veja o que você perdeu esta semana no JMS Showroom!',
      data: { type: 'weekly_summary' },
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday: 1, 
      hour: 10,
      minute: 0,
    },
  });

  await AsyncStorage.setItem(WEEKLY_NOTIFICATION_ID, notificationId);
  console.log('Notificação semanal agendada:', notificationId);
}

/**
 * Cancelar notificação diária
 */
export async function cancelDailyNotification() {
  const notificationId = await AsyncStorage.getItem(DAILY_NOTIFICATION_ID);
  if (notificationId) {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    await AsyncStorage.removeItem(DAILY_NOTIFICATION_ID);
    console.log('Notificação diária cancelada');
  }
}

/**
 * Cancelar notificação semanal
 */
export async function cancelWeeklyNotification() {
  const notificationId = await AsyncStorage.getItem(WEEKLY_NOTIFICATION_ID);
  if (notificationId) {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    await AsyncStorage.removeItem(WEEKLY_NOTIFICATION_ID);
    console.log('Notificação semanal cancelada');
  }
}

/**
 * Listeners para notificações
 */
export function addNotificationReceivedListener(
  callback: (notification: Notifications.Notification) => void
) {
  return Notifications.addNotificationReceivedListener(callback);
}

export function addNotificationResponseReceivedListener(
  callback: (response: Notifications.NotificationResponse) => void
) {
  return Notifications.addNotificationResponseReceivedListener(callback);
}

/**
 * Badge (contador de notificações)
 */
export async function setBadgeCount(count: number) {
  await Notifications.setBadgeCountAsync(count);
}

export async function getBadgeCount(): Promise<number> {
  return await Notifications.getBadgeCountAsync();
}

export async function clearBadge() {
  await Notifications.setBadgeCountAsync(0);
}

/**
 * Verificar permissões
 */
export async function checkNotificationPermissions(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  return status === 'granted';
}

/**
 * Abrir configurações do app
 */
export async function openSettings() {
  console.log('Abrir configurações do app');
}