import React, { useState, useRef } from 'react';
import {
  View,
  Modal,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  FlatList,
  Animated,
  PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ImageGalleryModalProps {
  visible: boolean;
  images: any[];
  initialIndex?: number;
  onClose: () => void;
}

export const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({
  visible,
  images,
  initialIndex = 0,
  onClose,
}) => {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const flatListRef = useRef<FlatList>(null);

  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const [isZoomed, setIsZoomed] = useState(false);

  const lastTap = useRef(0);

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTap.current < DOUBLE_TAP_DELAY) {
      if (isZoomed) {
        Animated.parallel([
          Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
          }),
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }),
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }),
        ]).start();
        setIsZoomed(false);
      } else {
        Animated.spring(scale, {
          toValue: 2,
          useNativeDriver: true,
        }).start();
        setIsZoomed(true);
      }
    }

    lastTap.current = now;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isZoomed,
      onMoveShouldSetPanResponder: () => isZoomed,
      onPanResponderMove: (_, gestureState) => {
        if (isZoomed) {
          translateX.setValue(gestureState.dx);
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (isZoomed) {
          const maxTranslate = SCREEN_WIDTH / 4;
          const newX = Math.max(-maxTranslate, Math.min(maxTranslate, gestureState.dx));
          const newY = Math.max(-maxTranslate, Math.min(maxTranslate, gestureState.dy));

          Animated.parallel([
            Animated.spring(translateX, {
              toValue: newX,
              useNativeDriver: true,
            }),
            Animated.spring(translateY, {
              toValue: newY,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    })
  ).current;

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
      resetZoom();
    }
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
      resetZoom();
    }
  };

  const resetZoom = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
    setIsZoomed(false);
  };

  const handleClose = () => {
    resetZoom();
    setCurrentIndex(initialIndex);
    onClose();
  };

  const renderImage = ({ item, index }: { item: any; index: number }) => {
    const isActive = index === currentIndex;

    return (
      <View style={styles.imageContainer}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleDoubleTap}
          {...(isActive ? panResponder.panHandlers : {})}
        >
          <Animated.Image
            source={item}
            style={[
              styles.image,
              isActive && {
                transform: [
                  { scale },
                  { translateX },
                  { translateY },
                ],
              },
            ]}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    );
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
      resetZoom();
    }
  }).current;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={[styles.container, { backgroundColor: '#000' }]}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />

        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={32} color="#fff" />
          </TouchableOpacity>

          <View style={styles.counterContainer}>
            <Ionicons name="image" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Animated.Text style={styles.counter}>
              {currentIndex + 1} / {images.length}
            </Animated.Text>
          </View>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-social" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <FlatList
          ref={flatListRef}
          data={images}
          renderItem={renderImage}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 50,
          }}
          initialScrollIndex={initialIndex}
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
        />

        {!isZoomed && (
          <>
            {currentIndex > 0 && (
              <TouchableOpacity
                style={[styles.navButton, styles.navButtonLeft]}
                onPress={handlePrevious}
              >
                <Ionicons name="chevron-back" size={32} color="#fff" />
              </TouchableOpacity>
            )}

            {currentIndex < images.length - 1 && (
              <TouchableOpacity
                style={[styles.navButton, styles.navButtonRight]}
                onPress={handleNext}
              >
                <Ionicons name="chevron-forward" size={32} color="#fff" />
              </TouchableOpacity>
            )}
          </>
        )}

        <View style={styles.thumbnailsContainer}>
          <FlatList
            data={images}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => `thumb-${index}`}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => {
                  setCurrentIndex(index);
                  flatListRef.current?.scrollToIndex({ index, animated: true });
                  resetZoom();
                }}
              >
                <View
                  style={[
                    styles.thumbnail,
                    index === currentIndex && styles.thumbnailActive,
                  ]}
                >
                  <Image source={item} style={styles.thumbnailImage} />
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.thumbnailsList}
          />
        </View>

        {!isZoomed && (
          <View style={styles.hintContainer}>
            <Ionicons name="expand" size={16} color="rgba(255,255,255,0.6)" />
            <Animated.Text style={styles.hintText}>
              Toque 2x para ampliar
            </Animated.Text>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },

  counter: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  actionButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.8,
  },

  navButton: {
    position: 'absolute',
    top: '50%',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },

  navButtonLeft: {
    left: 16,
  },

  navButtonRight: {
    right: 16,
  },

  thumbnailsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },

  thumbnailsList: {
    paddingHorizontal: 16,
    gap: 12,
  },

  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },

  thumbnailActive: {
    borderColor: '#0F766E',
  },

  thumbnailImage: {
    width: '100%',
    height: '100%',
  },

  hintContainer: {
    position: 'absolute',
    top: 110,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },

  hintText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontWeight: '600',
  },
});