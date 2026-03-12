import React, { useEffect, useRef } from 'react';
import { View, Animated, ViewStyle, Easing } from 'react-native';
import { useTheme } from '../context/ThemeContext';

/**
 * 💀 Sistema de Skeleton Screens com Shimmer Effect
 * 
 * Componentes reutilizáveis para estados de loading elegantes
 */

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}) => {
  const { colors } = useTheme();
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300],
  });

  return (
    <View
      style={[
        {
          width: width as any,
          height: height as any,
          borderRadius,
          backgroundColor: colors.inputBackground,
          overflow: 'hidden',
        } as ViewStyle,
        style,
      ]}
    >
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          transform: [{ translateX }, { rotate: '20deg' }],
        }}
      />
    </View>
  );
};

interface SkeletonCircleProps {
  size?: number;
  style?: ViewStyle;
}

export const SkeletonCircle: React.FC<SkeletonCircleProps> = ({
  size = 40,
  style,
}) => {
  return (
    <Skeleton
      width={size}
      height={size}
      borderRadius={size / 2}
      style={style}
    />
  );
};

interface SkeletonTextProps {
  lines?: number;
  spacing?: number;
  lastLineWidth?: string;
  style?: ViewStyle;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 3,
  spacing = 8,
  lastLineWidth = '70%',
  style,
}) => {
  return (
    <View style={style}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          width={index === lines - 1 ? lastLineWidth : '100%'}
          height={16}
          borderRadius={4}
          style={{ marginBottom: index < lines - 1 ? spacing : 0 }}
        />
      ))}
    </View>
  );
};

export const SkeletonCarCard: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.glassBorder,
      }}
    >
      <Skeleton
        width="100%"
        height={200}
        borderRadius={12}
        style={{ marginBottom: 12 }}
      />

      <Skeleton
        width="70%"
        height={24}
        borderRadius={6}
        style={{ marginBottom: 8 }}
      />

      <Skeleton
        width="50%"
        height={16}
        borderRadius={4}
        style={{ marginBottom: 12 }}
      />

      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
        <Skeleton width={80} height={32} borderRadius={8} />
        <Skeleton width={80} height={32} borderRadius={8} />
        <Skeleton width={80} height={32} borderRadius={8} />
      </View>

      <Skeleton
        width="40%"
        height={28}
        borderRadius={6}
      />
    </View>
  );
};

export const SkeletonCardHorizontal: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.glassBorder,
      }}
    >
      <Skeleton
        width={100}
        height={80}
        borderRadius={12}
        style={{ marginRight: 12 }}
      />

      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View>
          <Skeleton width="80%" height={18} borderRadius={4} style={{ marginBottom: 6 }} />
          <Skeleton width="60%" height={14} borderRadius={4} />
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Skeleton width={60} height={24} borderRadius={6} />
          <Skeleton width={60} height={24} borderRadius={6} />
        </View>
      </View>
    </View>
  );
};

export const SkeletonStatCard: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.glassBorder,
      }}
    >
      <SkeletonCircle size={48} style={{ marginBottom: 12 }} />
      <Skeleton width={60} height={28} borderRadius={6} style={{ marginBottom: 8 }} />
      <Skeleton width="80%" height={14} borderRadius={4} />
    </View>
  );
};

export const SkeletonImageGallery: React.FC = () => {
  return (
    <View>
      <Skeleton
        width="100%"
        height={300}
        borderRadius={0}
        style={{ marginBottom: 16 }}
      />

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16 }}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton
            key={index}
            width="48%"
            height={150}
            borderRadius={12}
          />
        ))}
      </View>
    </View>
  );
};

export const SkeletonListItem: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: colors.glassBorder,
      }}
    >
      <SkeletonCircle size={32} style={{ marginRight: 12 }} />
      <View style={{ flex: 1 }}>
        <Skeleton width="70%" height={16} borderRadius={4} style={{ marginBottom: 6 }} />
        <Skeleton width="50%" height={12} borderRadius={4} />
      </View>
    </View>
  );
};

export const SkeletonHeader: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.accent,
        paddingTop: 50,
        paddingBottom: 16,
        paddingHorizontal: 16,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <SkeletonCircle size={40} />
        <Skeleton width={150} height={24} borderRadius={6} />
        <SkeletonCircle size={40} />
      </View>
    </View>
  );
};

export const SkeletonHighlightCard: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.glassBorder,
      }}
    >
      <SkeletonCircle size={56} style={{ marginBottom: 12 }} />
      <Skeleton width={80} height={24} borderRadius={6} style={{ marginBottom: 6 }} />
      <Skeleton width="90%" height={14} borderRadius={4} />
    </View>
  );
};

export const SkeletonAchievement: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.glassBorder,
      }}
    >
      <SkeletonCircle size={50} style={{ marginBottom: 8 }} />
      <Skeleton width="80%" height={16} borderRadius={4} style={{ marginBottom: 6 }} />
      <Skeleton width="90%" height={12} borderRadius={4} />
    </View>
  );
};

export const SkeletonChart: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.glassBorder,
      }}
    >
      <Skeleton width="60%" height={20} borderRadius={6} style={{ marginBottom: 16 }} />
      
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8, height: 150 }}>
        <Skeleton width="20%" height={100} borderRadius={8} />
        <Skeleton width="20%" height={130} borderRadius={8} />
        <Skeleton width="20%" height={80} borderRadius={8} />
        <Skeleton width="20%" height={120} borderRadius={8} />
      </View>
    </View>
  );
};

export const SkeletonProfileHeader: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.glassBorder,
      }}
    >
      <SkeletonCircle size={80} style={{ marginBottom: 12 }} />
      <Skeleton width={150} height={24} borderRadius={6} style={{ marginBottom: 8 }} />
      <Skeleton width={100} height={16} borderRadius={4} style={{ marginBottom: 16 }} />
      
      <View style={{ flexDirection: 'row', gap: 16 }}>
        <View style={{ alignItems: 'center' }}>
          <Skeleton width={40} height={24} borderRadius={6} style={{ marginBottom: 6 }} />
          <Skeleton width={60} height={12} borderRadius={4} />
        </View>
        <View style={{ alignItems: 'center' }}>
          <Skeleton width={40} height={24} borderRadius={6} style={{ marginBottom: 6 }} />
          <Skeleton width={60} height={12} borderRadius={4} />
        </View>
        <View style={{ alignItems: 'center' }}>
          <Skeleton width={40} height={24} borderRadius={6} style={{ marginBottom: 6 }} />
          <Skeleton width={60} height={12} borderRadius={4} />
        </View>
      </View>
    </View>
  );
};

export const SkeletonReview: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.glassBorder,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <SkeletonCircle size={40} style={{ marginRight: 12 }} />
        <View style={{ flex: 1 }}>
          <Skeleton width="60%" height={16} borderRadius={4} style={{ marginBottom: 6 }} />
          <Skeleton width="40%" height={12} borderRadius={4} />
        </View>
      </View>
      
      <SkeletonText lines={3} spacing={6} lastLineWidth="80%" />
    </View>
  );
};

export const SkeletonSearchBar: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
      <Skeleton
        width="100%"
        height={50}
        borderRadius={25}
      />
    </View>
  );
};

export const SkeletonFilterRow: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 16, marginBottom: 16 }}>
      <Skeleton width={100} height={40} borderRadius={20} />
      <Skeleton width={120} height={40} borderRadius={20} />
      <Skeleton width={100} height={40} borderRadius={20} />
    </View>
  );
};