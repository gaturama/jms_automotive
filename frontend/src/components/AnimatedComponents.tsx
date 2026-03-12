import React, { useEffect, useRef, useState } from "react";
import { Animated, ViewStyle, TextStyle } from "react-native";
import * as Animations from "../utils/Animations";

/**
 * Componentes Animados Prontos para Usar
 */

interface FadeInViewProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  style?: ViewStyle;
}

/**
 * Container que aparece com fade
 */
export const FadeInView: React.FC<FadeInViewProps> = ({
  children,
  duration = 600,
  delay = 0,
  style,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animations.fadeIn(opacity, duration, delay).start();
  }, []);

  return <Animated.View style={[style, { opacity }]}>{children}</Animated.View>;
};

interface SlideInViewProps {
  children: React.ReactNode;
  direction?: "bottom" | "top" | "left" | "right";
  distance?: number;
  duration?: number;
  delay?: number;
  style?: ViewStyle;
}

/**
 * Container que desliza ao aparecer
 */
export const SlideInView: React.FC<SlideInViewProps> = ({
  children,
  direction = "bottom",
  distance = 100,
  duration = 600,
  delay = 0,
  style,
}) => {
  const translateY = useRef(
    new Animated.Value(
      direction === "bottom" ? distance : direction === "top" ? -distance : 0,
    ),
  ).current;
  const translateX = useRef(
    new Animated.Value(
      direction === "right" ? distance : direction === "left" ? -distance : 0,
    ),
  ).current;

  useEffect(() => {
    if (direction === "bottom" || direction === "top") {
      Animations.slideInFromBottom(
        translateY,
        distance,
        duration,
        delay,
      ).start();
    } else {
      Animations.slideInFromBottom(
        translateX,
        distance,
        duration,
        delay,
      ).start();
    }
  }, []);

  return (
    <Animated.View
      style={[
        style,
        {
          transform: [
            {
              translateY:
                direction === "bottom" || direction === "top" ? translateY : 0,
            },
            {
              translateX:
                direction === "left" || direction === "right" ? translateX : 0,
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

interface ScaleInViewProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  overshoot?: boolean;
  style?: ViewStyle;
}

/**
 * Container que cresce ao aparecer
 */
export const ScaleInView: React.FC<ScaleInViewProps> = ({
  children,
  duration = 600,
  delay = 0,
  overshoot = true,
  style,
}) => {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animations.scaleIn(scale, duration, delay, overshoot).start();
  }, []);

  return (
    <Animated.View style={[style, { transform: [{ scale }] }]}>
      {children}
    </Animated.View>
  );
};

interface FadeScaleInViewProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  style?: ViewStyle;
}

/**
 * Container que aparece com fade + scale
 */
export const FadeScaleInView: React.FC<FadeScaleInViewProps> = ({
  children,
  duration = 600,
  delay = 0,
  style,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animations.fadeScaleIn(opacity, scale, duration, delay).start();
  }, []);

  return (
    <Animated.View style={[style, { opacity, transform: [{ scale }] }]}>
      {children}
    </Animated.View>
  );
};

interface PulseViewProps {
  children: React.ReactNode;
  minOpacity?: number;
  maxOpacity?: number;
  duration?: number;
  style?: ViewStyle;
}

/**
 * Container que pulsa (fade in/out infinito)
 */
export const PulseView: React.FC<PulseViewProps> = ({
  children,
  minOpacity = 0.3,
  maxOpacity = 1,
  duration = 1000,
  style,
}) => {
  const opacity = useRef(new Animated.Value(maxOpacity)).current;

  useEffect(() => {
    Animations.pulse(opacity, minOpacity, maxOpacity, duration).start();
  }, []);

  return <Animated.View style={[style, { opacity }]}>{children}</Animated.View>;
};

interface FloatViewProps {
  children: React.ReactNode;
  distance?: number;
  duration?: number;
  style?: ViewStyle;
}

/**
 * Container que flutua (sobe e desce infinitamente)
 */
export const FloatView: React.FC<FloatViewProps> = ({
  children,
  distance = 10,
  duration = 2000,
  style,
}) => {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animations.float(translateY, distance, duration).start();
  }, []);

  return (
    <Animated.View style={[style, { transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
};

interface RotateViewProps {
  children: React.ReactNode;
  duration?: number;
  loop?: boolean;
  style?: ViewStyle;
}

/**
 * Container que gira 360°
 */
export const RotateView: React.FC<RotateViewProps> = ({
  children,
  duration = 1000,
  loop = false,
  style,
}) => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animations.rotate360(rotation, duration, loop).start();
  }, []);

  const rotate = Animations.interpolateRotation(rotation);

  return (
    <Animated.View style={[style, { transform: [{ rotate }] }]}>
      {children}
    </Animated.View>
  );
};

interface AnimatedPressableProps {
  children: React.ReactNode;
  onPress: () => void;
  scaleEffect?: "scale" | "bounce";
  style?: ViewStyle;
}

/**
 * Botão com animação de pressão
 */
export const AnimatedPressable: React.FC<AnimatedPressableProps> = ({
  children,
  onPress,
  scaleEffect = "scale",
  style,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlers =
    scaleEffect === "bounce"
      ? Animations.pressBounce(scale)
      : Animations.pressScale(scale);

  return (
    <Animated.View style={[style, { transform: [{ scale }] }]}>
      <Animated.View
        onTouchStart={handlers.pressIn}
        onTouchEnd={handlers.pressOut}
        onTouchCancel={handlers.pressOut}
      >
        <Animated.View onTouchEnd={onPress}>{children}</Animated.View>
      </Animated.View>
    </Animated.View>
  );
};

interface ShimmerViewProps {
  children: React.ReactNode;
  duration?: number;
  style?: ViewStyle;
}

/**
 * Container com efeito shimmer (loading)
 */
export const ShimmerView: React.FC<ShimmerViewProps> = ({
  children,
  duration = 1500,
  style,
}) => {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animations.shimmer(shimmer, duration).start();
  }, []);

  const translateX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300],
  });

  return (
    <Animated.View style={[style, { overflow: "hidden" }]}>
      {children}
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          transform: [{ translateX }, { rotate: "20deg" }],
        }}
      />
    </Animated.View>
  );
};

interface WaveViewProps {
  children: React.ReactNode;
  duration?: number;
  style?: ViewStyle;
}

/**
 * Container com onda expandindo (ripple effect)
 */
export const WaveView: React.FC<WaveViewProps> = ({
  children,
  duration = 2000,
  style,
}) => {
  const wave = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animations.wave(wave, duration).start();
  }, []);

  const scale = wave.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 3],
  });

  const opacity = wave.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 0],
  });

  return (
    <Animated.View style={[style, { position: "relative" }]}>
      <Animated.View
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 100,
          height: 100,
          marginLeft: -50,
          marginTop: -50,
          borderRadius: 50,
          backgroundColor: "#004643",
          opacity,
          transform: [{ scale }],
        }}
      />
      {children}
    </Animated.View>
  );
};

interface AnimatedTextProps {
  children: string;
  style?: TextStyle;
  animation?: "fade" | "slide" | "scale";
  duration?: number;
  delay?: number;
}

/**
 * Texto animado
 */
export const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  style,
  animation = "fade",
  duration = 600,
  delay = 0,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animation === "fade") {
      Animations.fadeIn(opacity, duration, delay).start();
    } else if (animation === "slide") {
      Animated.parallel([
        Animations.fadeIn(opacity, duration, delay),
        Animations.slideInFromBottom(translateY, 30, duration, delay),
      ]).start();
    } else if (animation === "scale") {
      Animated.parallel([
        Animations.fadeIn(opacity, duration, delay),
        Animations.scaleIn(scale, duration, delay),
      ]).start();
    }
  }, []);

  const animatedStyle =
    animation === "slide"
      ? { opacity, transform: [{ translateY }] }
      : animation === "scale"
        ? { opacity, transform: [{ scale }] }
        : { opacity };

  return (
    <Animated.Text style={[style, animatedStyle]}>{children}</Animated.Text>
  );
};

interface StaggeredListProps {
  children: React.ReactNode[];
  staggerDelay?: number;
  animation?: "fade" | "slide";
  style?: ViewStyle;
}

/**
 * Lista com itens aparecendo em cascata
 */
export const StaggeredList: React.FC<StaggeredListProps> = ({
  children,
  staggerDelay = 100,
  animation = "fade",
  style,
}) => {
  const animatedValues = useRef(
    children.map(() => new Animated.Value(animation === "slide" ? 50 : 0)),
  ).current;

  useEffect(() => {
    if (animation === "fade") {
      Animations.staggerFadeIn(animatedValues, staggerDelay).start();
    } else {
      Animations.staggerSlideIn(animatedValues, staggerDelay).start();
    }
  }, []);

  return (
    <Animated.View style={style}>
      {React.Children.map(children, (child, index) => (
        <Animated.View
          key={index}
          style={{
            opacity: animation === "fade" ? animatedValues[index] : 1,
            transform:
              animation === "slide"
                ? [{ translateY: animatedValues[index] }]
                : undefined,
          }}
        >
          {child}
        </Animated.View>
      ))}
    </Animated.View>
  );
};
