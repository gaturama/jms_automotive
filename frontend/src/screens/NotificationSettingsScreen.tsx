import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  StatusBar,
} from 'react-native';
import {
  scheduleDailyNotification,
  scheduleWeeklyNotification,
  cancelAllNotifications,
} from '../service/NotificationService';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATION_SETTINGS_KEY = '@CarShowroom:notificationSettings';

interface NotificationSettings {
  newCars: boolean;
  promotions: boolean;
  reminders: boolean;
  reviews: boolean;
  dailyUpdates: boolean;
  weeklyUpdates: boolean;
}

export default function NotificationSettingsScreen({ navigation }: any) {
  const { colors } = useTheme();
  const {
    expoPushToken,
    notificationPermissionGranted,
    sendTestNotification,
    clearAllNotifications,
    badgeCount,
  } = useNotifications();

  const [settings, setSettings] = useState<NotificationSettings>({
    newCars: true,
    promotions: true,
    reminders: true,
    reviews: true,
    dailyUpdates: false,
    weeklyUpdates: false,
  });

  React.useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  const saveSettings = async (newSettings: NotificationSettings) => {
    try {
      await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);

      if (newSettings.dailyUpdates) {
        await scheduleDailyNotification();
      }
      if (newSettings.weeklyUpdates) {
        await scheduleWeeklyNotification();
      }
      if (!newSettings.dailyUpdates && !newSettings.weeklyUpdates) {
        await cancelAllNotifications();
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    }
  };

  const toggleSetting = (key: keyof NotificationSettings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    saveSettings(newSettings);
  };

  const handleTestNotification = async () => {
    if (!notificationPermissionGranted) {
      Alert.alert(
        'Permissão Negada',
        'Você precisa permitir notificações nas configurações do app.'
      );
      return;
    }

    await sendTestNotification();
    Alert.alert('Enviado!', 'A notificação de teste chegará em 2 segundos.');
  };

  const handleClearAll = async () => {
    Alert.alert(
      'Limpar Notificações',
      'Deseja cancelar todas as notificações agendadas?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            await clearAllNotifications();
            Alert.alert('Pronto!', 'Todas as notificações foram canceladas.');
          },
        },
      ]
    );
  };

  const renderSettingRow = (
    icon: string,
    title: string,
    description: string,
    settingKey: keyof NotificationSettings,
    iconColor: string
  ) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.glassBorder,
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: `${iconColor}20`,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
        }}
      >
        <Ionicons name={icon as any} size={24} color={iconColor} />
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: colors.textPrimary,
            marginBottom: 4,
          }}
        >
          {title}
        </Text>
        <Text style={{ fontSize: 13, color: colors.textSecondary }}>
          {description}
        </Text>
      </View>

      <Switch
        value={settings[settingKey]}
        onValueChange={() => toggleSetting(settingKey)}
        trackColor={{ false: colors.inputBackground, true: `${colors.accent}80` }}
        thumbColor={settings[settingKey] ? colors.accent : colors.textTertiary}
      />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={colors.statusBarStyle} backgroundColor={colors.accent} />

      <View
        style={{
          backgroundColor: colors.accent,
          paddingTop: 50,
          paddingBottom: 16,
          paddingHorizontal: 16,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              color: '#fff',
              flex: 1,
              textAlign: 'center',
              marginRight: 24,
            }}
          >
            Notificações
          </Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        <View
          style={{
            backgroundColor: notificationPermissionGranted
              ? `${colors.accent}20`
              : `${colors.textTertiary}20`,
            borderRadius: 16,
            padding: 16,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: notificationPermissionGranted ? colors.accent : colors.textTertiary,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Ionicons
              name={notificationPermissionGranted ? 'checkmark-circle' : 'alert-circle'}
              size={24}
              color={notificationPermissionGranted ? colors.accent : colors.textTertiary}
              style={{ marginRight: 8 }}
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: colors.textPrimary,
              }}
            >
              {notificationPermissionGranted ? 'Notificações Ativadas' : 'Notificações Desativadas'}
            </Text>
          </View>
          <Text style={{ fontSize: 13, color: colors.textSecondary }}>
            {notificationPermissionGranted
              ? 'Você receberá notificações sobre novidades e atualizações.'
              : 'Permita notificações nas configurações do sistema para receber atualizações.'}
          </Text>
          {badgeCount > 0 && (
            <View
              style={{
                marginTop: 8,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Ionicons name="notifications" size={16} color={colors.accent} />
              <Text style={{ marginLeft: 6, fontSize: 13, color: colors.accent, fontWeight: '600' }}>
                {badgeCount} notificação{badgeCount > 1 ? 'ões' : ''} não lida{badgeCount > 1 ? 's' : ''}
              </Text>
            </View>
          )}
        </View>

        <Text
          style={{
            fontSize: 18,
            fontWeight: '700',
            color: colors.textPrimary,
            marginBottom: 16,
          }}
        >
          Tipos de Notificação
        </Text>

        {renderSettingRow(
          'car-sport',
          'Novos Carros',
          'Receba alertas quando novos carros forem adicionados',
          'newCars',
          '#4CAF50'
        )}

        {renderSettingRow(
          'pricetag',
          'Promoções',
          'Seja notificado sobre promoções e ofertas especiais',
          'promotions',
          '#FF9800'
        )}

        {renderSettingRow(
          'time',
          'Lembretes',
          'Receba lembretes sobre carros que você visualizou',
          'reminders',
          '#2196F3'
        )}

        {renderSettingRow(
          'star',
          'Novas Avaliações',
          'Alertas quando seus carros favoritos receberem reviews',
          'reviews',
          '#9C27B0'
        )}

        <Text
          style={{
            fontSize: 18,
            fontWeight: '700',
            color: colors.textPrimary,
            marginTop: 24,
            marginBottom: 16,
          }}
        >
          Resumos Periódicos
        </Text>

        {renderSettingRow(
          'calendar',
          'Resumo Diário',
          'Receba um resumo diário às 12:00',
          'dailyUpdates',
          '#00BCD4'
        )}

        {renderSettingRow(
          'newspaper',
          'Resumo Semanal',
          'Receba um resumo semanal aos domingos às 10:00',
          'weeklyUpdates',
          '#E91E63'
        )}

        <View style={{ marginTop: 32, gap: 12 }}>
          <TouchableOpacity
            style={{
              backgroundColor: colors.accent,
              borderRadius: 14,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}
            onPress={handleTestNotification}
          >
            <Ionicons name="notifications" size={20} color="#fff" />
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>
              Enviar Notificação de Teste
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: colors.surface,
              borderRadius: 14,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              borderWidth: 1,
              borderColor: colors.glassBorder,
            }}
            onPress={handleClearAll}
          >
            <Ionicons name="trash-outline" size={20} color={colors.textPrimary} />
            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.textPrimary }}>
              Limpar Todas Notificações
            </Text>
          </TouchableOpacity>
        </View>

        {expoPushToken && (
          <View
            style={{
              marginTop: 24,
              backgroundColor: colors.inputBackground,
              borderRadius: 12,
              padding: 12,
              borderWidth: 1,
              borderColor: colors.inputBorder,
            }}
          >
            <Text style={{ fontSize: 11, color: colors.textTertiary, fontFamily: 'monospace' }}>
              Token: {expoPushToken.substring(0, 30)}...
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}