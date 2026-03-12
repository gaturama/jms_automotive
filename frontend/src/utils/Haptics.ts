import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

/**
 * Serviço de Haptic Feedback
 *
 * Centraliza todos os feedbacks táteis do app
 */

export const HapticFeedback = {
  light: () => {
    if (Platform.OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  },

  medium: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  },

  success: () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },

  warning: () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  },

  error: () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  },

  selection: () => {
    Haptics.selectionAsync();
  },

  favorite: async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 100);
  },

  delete: async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }, 50);
  },

  press: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },

  toggle: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  },
};
