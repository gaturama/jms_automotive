import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import {
  registerForPushNotificationsAsync,
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
  scheduleLocalNotification,
  cancelAllNotifications,
  setBadgeCount,
  clearBadge,
} from '../service/NotificationService';  

interface NotificationContextData {
  expoPushToken: string | undefined;
  notification: Notifications.Notification | undefined;
  notificationPermissionGranted: boolean;
  sendTestNotification: () => Promise<void>;
  clearAllNotifications: () => Promise<void>;
  badgeCount: number;
  incrementBadge: () => void;
  resetBadge: () => void;
}

const NotificationContext = createContext<NotificationContextData>({} as NotificationContextData);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const [notification, setNotification] = useState<Notifications.Notification | undefined>();
  const [notificationPermissionGranted, setNotificationPermissionGranted] = useState(false);
  const [badgeCount, setBadgeCountState] = useState(0);

  const notificationListener = useRef<Notifications.EventSubscription | undefined>(undefined);
  const responseListener = useRef<Notifications.EventSubscription | undefined>(undefined);

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(token => {
        setExpoPushToken(token);
        setNotificationPermissionGranted(!!token);
      })
      .catch(error => {
        console.error('Erro ao registrar notificações:', error);
      });

    notificationListener.current = addNotificationReceivedListener(notification => {
      console.log('Notificação recebida:', notification);
      setNotification(notification);
      incrementBadge();
    });

    responseListener.current = addNotificationResponseReceivedListener(response => {
      console.log('Notificação clicada:', response);
      
      const data = response.notification.request.content.data;
      
      handleNotificationNavigation(data);
      
      resetBadge();
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  const handleNotificationNavigation = (data: any) => {
    switch (data?.type) {
      case 'new_car':
        console.log('Navegar para detalhes do carro:', data.carName);
        break;
      case 'promotion':
        console.log('Navegar para promoção');
        break;
      case 'reminder':
        console.log('Navegar para carro lembrado');
        break;
      case 'new_review':
        console.log('Navegar para reviews');
        break;
      default:
        console.log('Notificação genérica');
    }
  };

  const sendTestNotification = async () => {
    await scheduleLocalNotification(
      'Notificação de Teste',
      'Esta é uma notificação de teste do JMS Car Showroom!',
      { type: 'test' },
      2 
    );
  };

  const clearAllNotifications = async () => {
    await cancelAllNotifications();
    await resetBadge();
  };

  const incrementBadge = () => {
    const newCount = badgeCount + 1;
    setBadgeCountState(newCount);
    setBadgeCount(newCount);
  };

  const resetBadge = () => {
    setBadgeCountState(0);
    clearBadge();
  };

  return (
    <NotificationContext.Provider
      value={{
        expoPushToken,
        notification,
        notificationPermissionGranted,
        sendTestNotification,
        clearAllNotifications,
        badgeCount,
        incrementBadge,
        resetBadge,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};