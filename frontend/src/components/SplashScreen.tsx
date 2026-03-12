import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Image,
  Text,
  Animated,
  StatusBar,
  StyleSheet,
  Easing,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

interface AnimatedSplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<AnimatedSplashScreenProps> = ({ onFinish }) => {
  const { colors } = useTheme();
  const [showLogo, setShowLogo] = useState(true);
  
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textSlide = useRef(new Animated.Value(30)).current;
  
  const iconScale = useRef(new Animated.Value(0)).current;
  const iconRotate = useRef(new Animated.Value(0)).current;
  
  const particles = useRef(
    Array.from({ length: 6 }, () => ({
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    startAnimations();
  }, []);

  const startAnimations = () => {
    particles.forEach((particle, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(particle.opacity, {
              toValue: 0.6,
              duration: 1000 + index * 200,
              useNativeDriver: true,
            }),
            Animated.timing(particle.scale, {
              toValue: 1,
              duration: 1000 + index * 200,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(particle.opacity, {
              toValue: 0,
              duration: 1000 + index * 200,
              useNativeDriver: true,
            }),
            Animated.timing(particle.scale, {
              toValue: 0,
              duration: 1000 + index * 200,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    });

    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotate, {
          toValue: 1,
          duration: 1200,
          easing: Easing.elastic(1.5),
          useNativeDriver: true,
        }),
      ]),

      Animated.delay(200),
      Animated.parallel([
        Animated.spring(iconScale, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.timing(iconRotate, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
      ]),

      Animated.delay(200),
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(textSlide, {
          toValue: 0,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),

      Animated.delay(1000),

      Animated.parallel([
        Animated.sequence([
          Animated.timing(logoScale, {
            toValue: 1.1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(logoScale, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(iconScale, {
            toValue: 1.2,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(iconScale, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ]),

      Animated.delay(400),
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(iconScale, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setShowLogo(false);
      setTimeout(() => onFinish(), 300);
    });
  };

  const logoRotation = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-15deg', '0deg'],
  });

  const iconRotation = iconRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '0deg'],
  });

  if (!showLogo) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={colors.statusBarStyle}
        backgroundColor={colors.background}
        translucent
      />

      {particles.map((particle, index) => {
        const positions = [
          { left: width * 0.1, top: height * 0.15 },
          { left: width * 0.8, top: height * 0.2 },
          { left: width * 0.2, top: height * 0.7 },
          { left: width * 0.75, top: height * 0.65 },
          { left: width * 0.5, top: height * 0.1 },
          { left: width * 0.3, top: height * 0.8 },
        ];

        return (
          <Animated.View
            key={index}
            style={[
              styles.particleDot,
              positions[index],
              {
                opacity: particle.opacity,
                transform: [{ scale: particle.scale }],
                backgroundColor: index % 2 === 0 ? colors.accent : colors.particleColorSecondary,
              },
            ]}
          />
        );
      })}

      <Animated.View
        style={{
          opacity: logoOpacity,
          transform: [
            { scale: logoScale },
            { rotate: logoRotation },
          ],
        }}
      >
        <Image
          source={require('../assets/jms_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.iconContainer,
          {
            opacity: logoOpacity,
            transform: [
              { scale: iconScale },
              { rotate: iconRotation },
            ],
          },
        ]}
      >
        <View style={[styles.iconCircle, { backgroundColor: colors.accent }]}>
          <Ionicons name="car-sport" size={40} color="#fff" />
        </View>
      </Animated.View>

      <Animated.View
        style={{
          opacity: textOpacity,
          transform: [{ translateY: textSlide }],
        }}
      >
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          JMS CAR SHOWROOM
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Premium Collection
        </Text>
      </Animated.View>

      <View style={styles.loadingDots}>
        {[0, 1, 2].map((i) => (
          <Animated.View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: colors.accent,
                opacity: logoOpacity,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    width: 280,
    height: 160,
    marginBottom: 30,
  },

  iconContainer: {
    marginBottom: 40,
  },

  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#004643',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: 3,
    textAlign: 'center',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 2,
    textAlign: 'center',
    textTransform: 'uppercase',
  },

  loadingDots: {
    flexDirection: 'row',
    gap: 8,
    position: 'absolute',
    bottom: 60,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  particleDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});