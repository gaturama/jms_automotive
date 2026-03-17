import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Car } from '../navigation/car';
import { useTheme } from '../context/ThemeContext';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { createStyles } from '../styles/stylesCarCard';
import { useUnsplash } from '../context/UnsplashContext';

interface CarCardProps {
  car: Car;
  onPress?: () => void;
}

export const CarCard: React.FC<CarCardProps> = ({ car, onPress }) => {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const { getCarImages } = useUnsplash();
  
  const [thumbnailImage, setThumbnailImage] = useState<string | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(true);

  useEffect(() => {
    loadThumbnail();
  }, [car._id]);

  const loadThumbnail = async () => {
    try {
      const images = await getCarImages(car._id, car);
      if (images && images.length > 0) {
        setThumbnailImage(images[0].urls.small);
      }
      setIsLoadingImage(false);
    } catch (error) {
      console.error('Error loading thumbnail:', error);
      setIsLoadingImage(false);
    }
  };
  
  return (
    <Pressable 
      style={styles.card}
      onPress={onPress}
      android_ripple={{ color: '#333' }}
    >
      <View style={{ height: 180, backgroundColor: colors.surface, borderRadius: 16, overflow: 'hidden' }}>
        {isLoadingImage ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="small" color={colors.accentLight} />
          </View>
        ) : thumbnailImage ? (
          <Image
            source={{ uri: thumbnailImage }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        ) : (
          <View style={{ 
            flex: 1, 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: colors.inputBackground,
          }}>
            <Ionicons name="car-sport" size={48} color={colors.textTertiary} />
            <Text style={{ 
              color: colors.textTertiary, 
              fontSize: 12, 
              marginTop: 8,
              fontWeight: '600',
            }}>
              {car.brand}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.info}>
        <Text style={styles.name}>{car.name}</Text>
        
        <View style={styles.specs}>
          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Motor</Text>
            <Text style={styles.specValue}>{car.engine}</Text>
          </View>
          
          <View style={styles.specItem}>
            <Text style={styles.specLabel}>0-100 km/h</Text>
            <Text style={styles.specValue}>{car.acceleration}</Text>
          </View>
          
          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Vel. Máxima</Text>
            <Text style={styles.specValue}>{car.maxSpeed} km/h</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};