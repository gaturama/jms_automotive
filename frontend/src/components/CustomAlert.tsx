import React, { useEffect, useRef } from "react";
import { Modal, Text, TouchableOpacity, View, Animated } from "react-native";
import { styles } from "../styles/stylesCustomAlert";
import { Ionicons } from "@expo/vector-icons";

interface CustomAlertProps {
  isVisible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  isVisible,
  title,
  message,
  onClose,
}) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.8);
      fadeAnim.setValue(0);
    }
  }, [isVisible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const getIconAndColor = () => {
    const lowerTitle = title.toLowerCase();

    if (lowerTitle.includes("erro") || lowerTitle.includes("error")) {
      return { icon: "close-circle", color: "#004643" };
    } else if (
      lowerTitle.includes("sucesso") ||
      lowerTitle.includes("success")
    ) {
      return { icon: "checkmark-circle", color: "#4CAF50" };
    } else if (lowerTitle.includes("aviso") || lowerTitle.includes("atenção")) {
      return { icon: "warning", color: "#FF9800" };
    } else {
      return { icon: "information-circle", color: "#2196F3" };
    }
  };

  const { icon, color } = getIconAndColor();

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isVisible}
      onRequestClose={handleClose}
    >
      <Animated.View
        style={[
          styles.centeredView,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.modalView,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: `${color}20`,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <Ionicons name={icon as any} size={40} color={color} />
          </View>

          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalText}>{message}</Text>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            activeOpacity={0.8}
          >
            <Text style={styles.textStyle}>Fechar</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default CustomAlert;
