import { Share, Platform } from "react-native";
import { Car } from "../navigation/car";

/**
 * Formata as especificações do carro para compartilhamento
 */

export const formatCarSpecs = (car: Car): string => {
  return `🚗 ${car.name}

🏢 Marca: ${car.brand}
📅 Ano: ${car.year}
💰 Preço: R$ ${(car.price / 1000000).toFixed(1)}M

⚡ DESEMPENHO:
• Potência: ${car.horsepower} cv
• Torque: ${car.torque}
• Vel. Máxima: ${car.maxSpeed} km/h
• 0-100 km/h: ${car.acceleration}

🔧 MOTOR:
• ${car.engine}
• Transmissão: ${car.transmission}
• Tração: ${car.drivetrain}
• Combustível: ${car.fuelType}

📏 DIMENSÕES:
• Peso: ${car.weight} kg

🌟 JMS Car Showroom - A melhor garagem premium!
`.trim();
};

/**
 * Formata especificações resumidas para Instagram
 */
export const formatCarSpecsShort = (car: Car): string => {
  return `
🏎️ ${car.name}
💰 R$ ${(car.price / 1000000).toFixed(1)}M
⚡ ${car.horsepower}cv | 🏁 ${car.maxSpeed}km/h
📅 ${car.year}

#JMSCarShowroom #${car.brand} #CarrosEsportivos #Supercarros
`.trim();
};

/**
 * Compartilha o carro usando Share API nativa
 */
export const shareCarSpecs = async (
  car: Car,
): Promise<{ success: boolean; platform?: string }> => {
  try {
    const message = formatCarSpecs(car);

    const result = await Share.share(
      {
        message: message,
        title: `${car.name} - JMS Car Showroom`,
      },
      {
        dialogTitle: `Compartilhar ${car.name}`,
      },
    );

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        return { success: true, platform: result.activityType };
      } else {
        return { success: true, platform: "android/ios" };
      }
    } else if (result.action === Share.dismissedAction) {
      return { success: false };
    }

    return { success: false };
  } catch (error) {
    console.error("Erro ao compartilhar:", error);
    return { success: false };
  }
};

/**
 * Compartilha especificamente para WhatsApp
 */
export const shareToWhatsApp = (car: Car): string => {
  const message = formatCarSpecs(car);
  const encodedMessage = encodeURIComponent(message);
  
  if (Platform.OS === 'ios') {
    return `whatsapp://send?text=${encodedMessage}`;
  } else {
    return `https://wa.me/?text=${encodedMessage}`;
  }
};

/**
 * Compartilha especificamente para Instagram (formato curto)
 */
export const shareToInstagram = (car: Car): string => {
    const message = formatCarSpecsShort(car);

    return message;
};

/**
 * Gera texto para copiar para cliboard
 */
export const getClipboardText = (car: Car): string => {
    return formatCarSpecs(car);
}