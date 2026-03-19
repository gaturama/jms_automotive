import * as LocalAuthentication from "expo-local-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform, Alert } from "react-native";

/**
 * Biometric Authentication Service
 *
 * Supports:
 * - Face ID (iOS)
 * - Touch ID (iOS)
 * - Fingerprint (Android)
 * - Face Recognition (Android)
 *
 * Features:
 * - Biometric login
 * - Confirm sensitive actions
 * - Manage preferences
 */

interface BiometricResult {
  success: boolean;
  error?: string;
  biometricType?: string;
}

const BIOMETRIC_SETTINGS_KEY = "@CarShowroom:biometricSettings";

export class BiometricAuthService {
  /**
   * Checks if the device supports biometrics
   */
  static async isAvailable(): Promise<boolean> {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      return compatible && enrolled;
    } catch (error) {
      console.error("Erro ao verificar biometria:", error);
      return false;
    }
  }

  /**
   * Returns the available biometric type
   */
  static async getBiometricType(): Promise<string> {
    try {
      const types =
        await LocalAuthentication.supportedAuthenticationTypesAsync();

      if (
        types.includes(
          LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION,
        )
      ) {
        return Platform.OS === "ios" ? "Face ID" : "Reconhecimento Facial";
      }

      if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        return Platform.OS === "ios" ? "Touch ID" : "Impressão Digital";
      }

      if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
        return "Reconhecimento de Íris";
      }

      return "Biometria";
    } catch (error) {
      console.error("Erro ao obter tipo de biometria:", error);
      return "Biometria";
    }
  }

  /**
   * Checks if there is biometric data enrolled on the device
   */
  static async hasEnrolledBiometrics(): Promise<boolean> {
    try {
      return await LocalAuthentication.isEnrolledAsync();
    } catch (error) {
      return false;
    }
  }

  /**
   * Requests biometric authentication
   */
  static async authenticate(reason?: string): Promise<BiometricResult> {
    try {
      const isAvailable = await this.isAvailable();

      if (!isAvailable) {
        return {
          success: false,
          error: "Biometria não disponível neste dispositivo",
        };
      }

      const biometricType = await this.getBiometricType();
      const defaultReason = `Use ${biometricType} para continuar`;

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: reason || defaultReason,
        cancelLabel: "Cancelar",
        disableDeviceFallback: true,
      });

      if (result.success) {
        return { success: true, biometricType };
      } else {
        return {
          success: false,
          error: result.error || "Autenticação falhou",
        };
      }
    } catch (error) {
      console.error("Erro na autenticação biométrica:", error);
      return { success: false, error: "Erro ao autenticar" };
    }
  }

  /**
   * Enable biometrics for login
   */
  static async enableBiometricLogin(email: string): Promise<boolean> {
    try {
      const settings = await this.getSettings();
      settings.biometricLoginEnabled = true;
      settings.userEmail = email;
      await AsyncStorage.setItem(
        BIOMETRIC_SETTINGS_KEY,
        JSON.stringify(settings),
      );
      console.log("Biometria habilitada para login");
      return true;
    } catch (error) {
      console.error("Erro ao habilitar biometria:", error);
      return false;
    }
  }

  /**
   * Disable biometrics for login
   */
  static async disableBiometricLogin(): Promise<boolean> {
    try {
      const settings = await this.getSettings();
      settings.biometricLoginEnabled = false;
      settings.userEmail = "";
      await AsyncStorage.setItem(
        BIOMETRIC_SETTINGS_KEY,
        JSON.stringify(settings),
      );
      console.log("Biometria desabilitada para login");
      return true;
    } catch (error) {
      console.error("Erro ao desabilitar biometria:", error);
      return false;
    }
  }

  /**
   * Check if biometrics are enabled
   */
  static async isBiometricLoginEnabled(): Promise<boolean> {
    try {
      const settings = await this.getSettings();
      return settings.biometricLoginEnabled;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get the email of the user with biometrics enabled
   */
  static async getBiometricUserEmail(): Promise<string | null> {
    try {
      const settings = await this.getSettings();
      return settings.biometricLoginEnabled ? settings.userEmail : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get biometric settings
   */
  static async getSettings(): Promise<{
    biometricLoginEnabled: boolean;
    userEmail: string;
    requireForSensitiveActions: boolean;
  }> {
    try {
      const saved = await AsyncStorage.getItem(BIOMETRIC_SETTINGS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
      return {
        biometricLoginEnabled: false,
        userEmail: "",
        requireForSensitiveActions: true,
      };
    } catch (error) {
      return {
        biometricLoginEnabled: false,
        userEmail: "",
        requireForSensitiveActions: true,
      };
    }
  }

  /**
   * Update settings
   */
  static async updateSettings(settings: {
    requireForSensitiveActions?: boolean;
  }): Promise<boolean> {
    try {
      const current = await this.getSettings();
      const updated = { ...current, ...settings };
      await AsyncStorage.setItem(
        BIOMETRIC_SETTINGS_KEY,
        JSON.stringify(updated),
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Confirm a sensitive action with biometrics
   */
  static async confirmSensitiveAction(actionName: string): Promise<boolean> {
    try {
      const settings = await this.getSettings();

      if (!settings.requireForSensitiveActions) {
        return true;
      }

      const isAvailable = await this.isAvailable();

      if (!isAvailable) {
        Alert.alert(
          "Atenção",
          "Biometria não disponível. Considere configurá-la para maior segurança.",
          [{ text: "OK" }],
        );
        return true;
      }

      const result = await this.authenticate(`Confirmar: ${actionName}`);
      return result.success;
    } catch (error) {
      console.error("Erro ao confirmar ação sensível:", error);
      return false;
    }
  }

  /**
   * Confirm logout
   */
  static async confirmLogout(): Promise<boolean> {
    return await this.confirmSensitiveAction("Sair da conta");
  }

  /**
   * Confirm data deletion
   */
  static async confirmDataDeletion(): Promise<boolean> {
    return await this.confirmSensitiveAction("Excluir dados");
  }

  /**
   * Confirm password change
   */
  static async confirmPasswordChange(): Promise<boolean> {
    return await this.confirmSensitiveAction("Alterar senha");
  }

  /**
   * Confirm payment/purchase
   */
  static async confirmPayment(amount: string): Promise<boolean> {
    return await this.confirmSensitiveAction(`Pagamento de ${amount}`);
  }

  /**
   * Confirm sharing of sensitive data
   */
  static async confirmDataSharing(): Promise<boolean> {
    return await this.confirmSensitiveAction("Compartilhar dados");
  }

  /**
   * Test biometrics (for debugging)
   */
  static async test(): Promise<void> {
    console.log("Testando biometria...");

    const available = await this.isAvailable();
    console.log("Disponível:", available);

    const type = await this.getBiometricType();
    console.log("Tipo:", type);

    const enrolled = await this.hasEnrolledBiometrics();
    console.log("Cadastrada:", enrolled);

    const settings = await this.getSettings();
    console.log("Configurações:", settings);
  }

  /**
   * Clear all settings
   */
  static async clearSettings(): Promise<void> {
    try {
      await AsyncStorage.removeItem(BIOMETRIC_SETTINGS_KEY);
      console.log("Configurações de biometria limpas");
    } catch (error) {
      console.error("Erro ao limpar configurações:", error);
    }
  }
}
