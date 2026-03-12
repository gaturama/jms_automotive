import React, { useState } from 'react';
import { View, Image, Dimensions, ScrollView } from 'react-native';
import { styles } from '../styles/stylesCarCarousel';

interface CarImageCarouselProps {
  images: string[];
  height?: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_MARGIN = 32; 
const IMAGE_WIDTH = SCREEN_WIDTH - CARD_MARGIN;

export const CarImageCarousel: React.FC<CarImageCarouselProps> = ({ 
  images, 
  height = 180 
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.floor(event.nativeEvent.contentOffset.x / slideSize);
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={{ height }}
      >
        {images.map((image, index) => (
          <Image
            key={index}
            source={typeof image === 'string' ? { uri: image } : image}
            style={[styles.image, { width: IMAGE_WIDTH, height }]}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === activeIndex && styles.dotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
};
