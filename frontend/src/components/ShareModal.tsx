import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useTheme } from "../context/ThemeContext";
import { Car } from "../navigation/car";
import {
  shareCarSpecs,
  shareToInstagram,
  getClipboardText,
  formatCarSpecs,
} from "../utils/ShareUtils";

interface ShareModalProps {
    visible: boolean;
    onClose: () => void;
    car: Car;
}

export const ShareModal: React.FC<ShareModalProps> = ({ visible, onClose, car }) => {
    const { colors } = useTheme();

    const handleShareNative = async () => {
        const result = await shareCarSpecs(car);
        if (result.success) {
            Alert.alert("Success!", "Carro compartilhado com sucesso!");
            onClose();
        }
    };

    const handleWhatsApp = async () => {
    try {
      const text = formatCarSpecs(car);
      const encodedText = encodeURIComponent(text);
      
      const whatsappUrls = [
        `whatsapp://send?text=${encodedText}`,          
        `https://wa.me/?text=${encodedText}`,             
        `https://api.whatsapp.com/send?text=${encodedText}`, 
      ];

      for (const url of whatsappUrls) {
        try {
          const canOpen = await Linking.canOpenURL(url);
          if (canOpen) {
            await Linking.openURL(url);
            onClose();
            return;
          }
        } catch (err) {
          continue;
        }
      }

      Alert.alert(
        'WhatsApp não encontrado',
        'Instale o WhatsApp para compartilhar por este app.',
        [
          {
            text: 'Copiar Texto',
            onPress: async () => {
              await Clipboard.setStringAsync(text);
              Alert.alert('Copiado!', 'Texto copiado. Cole manualmente no WhatsApp.');
              onClose();
            },
          },
          { text: 'OK' },
        ]
      );
    } catch (error) {
      console.error('Erro ao abrir WhatsApp:', error);
      Alert.alert('Erro', 'Não foi possível abrir o WhatsApp.');
    }
  };

    const handleInstagram = async () => {
    try {
      const text = shareToInstagram(car);
      await Clipboard.setStringAsync(text);
      
      Alert.alert(
        'Copiado!',
        'Texto copiado para a área de transferência. Cole no Instagram!',
        [
          {
            text: 'Abrir Instagram',
            onPress: async () => {
              const instagramUrl = 'instagram://';
              const canOpen = await Linking.canOpenURL(instagramUrl);
              
              if (canOpen) {
                await Linking.openURL(instagramUrl);
              } else {
                Alert.alert('Instagram não encontrado', 'Instale o Instagram para continuar.');
              }
              onClose();
            },
          },
          { text: 'OK', onPress: onClose },
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível copiar o texto.');
    }
  };

  const handleCopyLink = async () => {
    try {
        const text = getClipboardText(car);
        await Clipboard.setStringAsync(text);
        Alert.alert("Copiado!", "Texto copiado para a área de transferência.");
        onClose
    } catch (error) {
        Alert.alert("Erro", "Não foi possível copiar o texto.");
    }
  };


  const shareOptions = [
    {
        id: 'native',
        icon: 'share-social',
        label: 'Compartilhar',
        color: '#4A90E2',
        onPress: handleShareNative,
    },
    {
        id: 'whatsapp',
        icon: 'logo-whatsapp',
        label: 'WhatsApp',
        color: '#25D366',
        onPress: handleWhatsApp,
    },
    {
        id: 'instagram',
        icon: 'logo-instagram',
        label: 'Instagram',
        color: '#E4405F',
        onPress: handleInstagram,
    },
    {
        id: 'copy',
        icon: 'copy',
        label: 'Copiar',
        color: '#8E8E93',
        onPress: handleCopyLink,
    },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles(colors).overlay}>
        <View style={styles(colors).modalContainer}>
          <View style={styles(colors).header}>
            <View>
              <Text style={styles(colors).headerTitle}>Compartilhar Carro</Text>
              <Text style={styles(colors).headerSubtitle}>{car.name}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles(colors).closeButton}>
              <Ionicons name="close" size={28} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={styles(colors).optionsGrid}>
            {shareOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles(colors).optionCard}
                onPress={option.onPress}
                activeOpacity={0.7}
              >
                <View style={[styles(colors).iconContainer, { backgroundColor: option.color }]}>
                  <Ionicons name={option.icon as any} size={28} color="#fff" />
                </View>
                <Text style={styles(colors).optionLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles(colors).previewContainer}>
            <Text style={styles(colors).previewTitle}>Preview:</Text>
            <View style={styles(colors).previewBox}>
              <Text style={styles(colors).previewText} numberOfLines={8}>
                {getClipboardText(car)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = (colors: any) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end',
  },

  modalContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.glassBorder,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 0.3,
  },

  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },

  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.inputBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },

  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 16,
  },

  optionCard: {
    width: '30%',
    alignItems: 'center',
    gap: 12,
  },

  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  optionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },

  previewContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.glassBorder,
  },

  previewTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 12,
  },

  previewBox: {
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    maxHeight: 200,
  },

  previewText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});