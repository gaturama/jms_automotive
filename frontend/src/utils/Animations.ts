import { Animated, Easing } from "react-native";

/**
 * Biblioteca de Animações Avançadas - JMS Car Showroom
 *
 * Animações reutilizáveis e performáticas usando Animeted API
 * Todas com useNativeDriver: true para 60fps
 */

/**
 * Fade In - Aparecer suavemente
 */
export const fadeIn = (
  animatedValue: Animated.Value,
  duration: number = 600,
  delay: number = 0,
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue: 1,
    duration,
    delay,
    easing: Easing.out(Easing.ease),
    useNativeDriver: true,
  });
};

/**
 * Fade Out - Desaparecer suavemente
 */
export const fadeOut = (
  animatedValue: Animated.Value,
  duration: number = 400,
  delay: number = 0,
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue: 0,
    duration,
    delay,
    easing: Easing.in(Easing.ease),
    useNativeDriver: true,
  });
};

/**
 * Pulse - Piscar opacity
 */
export const pulse = (
  animatedValue: Animated.Value,
  minOpacity: number = 0.3,
  maxOpacity: number = 1,
  duration: number = 1000
): Animated.CompositeAnimation => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: minOpacity,
        duration: duration / 2,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: maxOpacity,
        duration: duration / 2,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ])
  );
};

/**
 * Scale In - Crescer de 0 a 1
 */
export const scaleIn = (
  animatedValue: Animated.Value,
  duration: number = 600,
  delay: number = 0,
  overshoot: boolean = true,
): Animated.CompositeAnimation => {
  if (overshoot) {
    return Animated.spring(animatedValue, {
      toValue: 1,
      delay,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    });
  }

  return Animated.timing(animatedValue, {
    toValue: 1,
    duration,
    delay,
    easing: Easing.out(Easing.back(1.5)),
    useNativeDriver: true,
  });
};

/**
 * Scale Out - Diminuir de 1 a 0
 */
export const scaleOut = (
  animatedValue: Animated.Value,
  duration: number = 400,
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue: 0,
    duration,
    easing: Easing.in(Easing.back(1.5)),
    useNativeDriver: true,
  });
};

/**
 * Bounce - Efeito de quicar
 */
export const bounce = (
  animatedValue: Animated.Value,
  toValue: number = 1,
  bounciness: number = 8,
): Animated.CompositeAnimation => {
  return Animated.spring(animatedValue, {
    toValue,
    bounciness,
    speed: 12,
    useNativeDriver: true,
  });
};

/**
 * Heart Beat - Pulsar como coração
 */
export const heartBeat = (
  animatedValue: Animated.Value,
): Animated.CompositeAnimation => {
  return Animated.sequence([
    Animated.timing(animatedValue, {
      toValue: 1.3,
      duration: 150,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 150,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: 1.15,
      duration: 100,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 100,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }),
  ]);
};

/**
 * Slide In From Bottom - Deslizar de baixo
 */
export const slideInFromBottom = (
  animatedValue: Animated.Value,
  distance: number = 100,
  duration: number = 600,
  delay: number = 0,
): Animated.CompositeAnimation => {
  return Animated.spring(animatedValue, {
    toValue: 0,
    delay,
    tension: 40,
    friction: 8,
    useNativeDriver: true,
  });
};

/**
 * Slide In From Top - Deslizar de cima
 */
export const slideInFromTop = (
  animatedValue: Animated.Value,
  duration: number = 600,
  delay: number = 0,
): Animated.CompositeAnimation => {
  return Animated.spring(animatedValue, {
    toValue: 0,
    delay,
    tension: 40,
    friction: 8,
    useNativeDriver: true,
  });
};

/**
 * Slide In From Left - Deslizar da esquerda
 */
export const slideInFromLeft = (
  animatedValue: Animated.Value,
  duration: number = 600,
  delay: number = 0,
): Animated.CompositeAnimation => {
  return Animated.spring(animatedValue, {
    toValue: 0,
    delay,
    tension: 40,
    friction: 8,
    useNativeDriver: true,
  });
};

/**
 * Slide In From Right - Deslizar da direita
 */
export const slideInFromRight = (
  animatedValue: Animated.Value,
  duration: number = 600,
  delay: number = 0,
): Animated.CompositeAnimation => {
  return Animated.spring(animatedValue, {
    toValue: 0,
    delay,
    tension: 40,
    friction: 8,
    useNativeDriver: true,
  });
};

/**
 * Rotate 360 - Girar 360 graus
 */
export const rotate360 = (
  animatedValue: Animated.Value,
  duration: number = 1000,
  loop: boolean = false,
): Animated.CompositeAnimation => {
  const animation = Animated.timing(animatedValue, {
    toValue: 1,
    duration,
    easing: Easing.linear,
    useNativeDriver: true,
  });

  return loop ? Animated.loop(animation) : animation;
};

/**
 * Shake - Balançar (erro/negação)
 */
export const shake = (
  animatedValue: Animated.Value,
  intensity: number = 10,
): Animated.CompositeAnimation => {
  return Animated.sequence([
    Animated.timing(animatedValue, {
      toValue: intensity,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: -intensity,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: intensity / 2,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }),
  ]);
};

/**
 * Wiggle - Balançar suavemente
 */
export const wiggle = (
  animatedValue: Animated.Value,
): Animated.CompositeAnimation => {
  return Animated.sequence([
    Animated.timing(animatedValue, {
      toValue: -3,
      duration: 100,
      easing: Easing.linear,
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: 3,
      duration: 100,
      easing: Easing.linear,
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: -3,
      duration: 100,
      easing: Easing.linear,
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 100,
      easing: Easing.linear,
      useNativeDriver: true,
    }),
  ]);
};

/**
 * Fade + Scale In - Aparecer e crescer
 */
export const fadeScaleIn = (
  opacityValue: Animated.Value,
  scaleValue: Animated.Value,
  duration: number = 600,
  delay: number = 0,
): Animated.CompositeAnimation => {
  return Animated.parallel([
    fadeIn(opacityValue, duration, delay),
    scaleIn(scaleValue, duration, delay),
  ]);
};

/**
 * Fade + Slide In - Aparecer e deslizar
 */
export const fadeSlideIn = (
  opacityValue: Animated.Value,
  translateValue: Animated.Value,
  duration: number = 600,
  delay: number = 0,
): Animated.CompositeAnimation => {
  return Animated.parallel([
    fadeIn(opacityValue, duration, delay),
    slideInFromBottom(translateValue, 100, duration, delay),
  ]);
};

/**
 * Scale + Rotate - Crescer e girar
 */
export const scaleRotate = (
  scaleValue: Animated.Value,
  rotateValue: Animated.Value,
  duration: number = 600,
): Animated.CompositeAnimation => {
  return Animated.parallel([
    scaleIn(scaleValue, duration),
    rotate360(rotateValue, duration),
  ]);
};

/**
 * Stagger Fade In - Múltiplos elementos aparecem em sequência
 */
export const staggerFadeIn = (
  animatedValues: Animated.Value[],
  staggerDelay: number = 100,
  duration: number = 400,
): Animated.CompositeAnimation => {
  const animations = animatedValues.map((value, index) =>
    fadeIn(value, duration, index * staggerDelay),
  );

  return Animated.parallel(animations);
};

/**
 * Stagger Slide In - Múltiplos elementos deslizam em sequência
 */
export const staggerSlideIn = (
  animatedValues: Animated.Value[],
  staggerDelay: number = 100,
  duration: number = 400,
): Animated.CompositeAnimation => {
  const animations = animatedValues.map((value, index) =>
    slideInFromBottom(value, 50, duration, index * staggerDelay),
  );

  return Animated.parallel(animations);
};

/**
 * Press Scale - Diminuir ao pressionar
 */
export const pressScale = (
  animatedValue: Animated.Value,
  scale: number = 0.95,
): {
  pressIn: () => void;
  pressOut: () => void;
} => {
  return {
    pressIn: () => {
      Animated.spring(animatedValue, {
        toValue: scale,
        speed: 50,
        useNativeDriver: true,
      }).start();
    },
    pressOut: () => {
      Animated.spring(animatedValue, {
        toValue: 1,
        speed: 50,
        useNativeDriver: true,
      }).start();
    },
  };
};

/**
 * Press Bounce - Efeito bounce ao pressionar
 */
export const pressBounce = (
  animatedValue: Animated.Value,
): {
  pressIn: () => void;
  pressOut: () => void;
} => {
  return {
    pressIn: () => {
      Animated.spring(animatedValue, {
        toValue: 0.9,
        speed: 50,
        bounciness: 20,
        useNativeDriver: true,
      }).start();
    },
    pressOut: () => {
      Animated.spring(animatedValue, {
        toValue: 1,
        speed: 50,
        bounciness: 20,
        useNativeDriver: true,
      }).start();
    },
  };
};

/**
 * Wave - Onda que se expande
 */
export const wave = (
  animatedValue: Animated.Value,
  duration: number = 2000,
): Animated.CompositeAnimation => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]),
  );
};

/**
 * Zoom In - Zoom dramático
 */
export const zoomIn = (
  animatedValue: Animated.Value,
  duration: number = 800,
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue: 1,
    duration,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  });
};

/**
 * Flip In - Virar carta
 */
export const flipIn = (
  animatedValue: Animated.Value,
  duration: number = 600,
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue: 1,
    duration,
    easing: Easing.out(Easing.back(1.7)),
    useNativeDriver: true,
  });
};

/**
 * Shimmer - Efeito de brilho/loading
 */
export const shimmer = (
  animatedValue: Animated.Value,
  duration: number = 1500,
): Animated.CompositeAnimation => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]),
  );
};

/**
 * Float - Flutuar (subir e descer)
 */
export const float = (
  animatedValue: Animated.Value,
  distance: number = 10,
  duration: number = 2000,
): Animated.CompositeAnimation => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: -distance,
        duration: duration / 2,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: duration / 2,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]),
  );
};

/**
 * Rubber Band - Efeito elástico
 */
export const rubberBand = (
  animatedValue: Animated.Value,
): Animated.CompositeAnimation => {
  return Animated.sequence([
    Animated.timing(animatedValue, {
      toValue: 1.25,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: 0.75,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: 1.15,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }),
  ]);
};

/**
 * Interpolar rotação (0 a 360 graus)
 */
export const interpolateRotation = (animatedValue: Animated.Value) => {
  return animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
};

/**
 * Interpolar cor (hex to hex)
 */
export const interpolateColor = (
  animatedValue: Animated.Value,
  fromColor: string,
  toColor: string,
) => {
  return animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [fromColor, toColor],
  });
};
