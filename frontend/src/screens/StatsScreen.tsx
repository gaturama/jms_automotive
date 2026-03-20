import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Animated,
  Alert,
} from "react-native";
import {
  FadeInView,
  SlideInView,
  ScaleInView,
  PulseView,
  AnimatedPressable,
} from "../components/AnimatedComponents";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useStats } from "../context/StatsContext";
import { carService } from "../service/car.service";
import { Car } from "../navigation/car";

export default function StatsScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { stats, getStatsReport, resetStats } = useStats();
  const [mostViewedCar, setMostViewedCar] = useState<Car | null>(null);

  const report = getStatsReport();

  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(progressAnim, {
      toValue: report.nextLevelProgress,
      tension: 40,
      friction: 8,
      useNativeDriver: false,
    }).start();
  }, [report.nextLevelProgress]);

  useEffect(() => {
    const fetchMostViewedCar = async () => {
      if (report.mostViewedCar?.id) {
        try {
          const car = await carService.getCarById(report.mostViewedCar.id);
          setMostViewedCar(car);
        } catch {
          console.error("Erro ao buscar carro mais visto");
        }
      }
    };
    fetchMostViewedCar();
  }, [report.mostViewedCar?.id]);

  const handleResetStats = () => {
    Alert.alert(
      "🗑️ Resetar Estatísticas",
      "Tem certeza? Isso apagará todas as suas estatísticas e conquistas.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Resetar",
          style: "destructive",
          onPress: () => {
            resetStats();
            Alert.alert("✅ Pronto!", "Estatísticas resetadas.");
          },
        },
      ],
    );
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar
        barStyle={colors.statusBarStyle}
        backgroundColor={colors.accent}
      />

      <SlideInView direction="top" duration={500}>
        <View
          style={{
            backgroundColor: colors.accent,
            paddingTop: 50,
            paddingBottom: 20,
            paddingHorizontal: 16,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <AnimatedPressable
              onPress={() => navigation.goBack()}
              scaleEffect="scale"
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </AnimatedPressable>

            <Text style={{ fontSize: 20, fontWeight: "700", color: "#fff" }}>
              📊 Suas Estatísticas
            </Text>

            <AnimatedPressable onPress={handleResetStats} scaleEffect="scale">
              <Ionicons name="refresh" size={24} color="#fff" />
            </AnimatedPressable>
          </View>
        </View>
      </SlideInView>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ padding: 16 }}>
          <ScaleInView duration={600} delay={200}>
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 20,
                padding: 20,
                marginBottom: 20,
                borderWidth: 1,
                borderColor: colors.glassBorder,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <PulseView minOpacity={0.7} maxOpacity={1} duration={1500}>
                    <View
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: colors.accent,
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 12,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 28,
                          fontWeight: "800",
                          color: "#fff",
                        }}
                      >
                        {report.level}
                      </Text>
                    </View>
                  </PulseView>
                  <View>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "700",
                        color: colors.textPrimary,
                      }}
                    >
                      Level {report.level}
                    </Text>
                    <Text style={{ fontSize: 13, color: colors.textSecondary }}>
                      Entusiasta de Carros
                    </Text>
                  </View>
                </View>
                <Ionicons name="trophy" size={32} color="#FFD700" />
              </View>

              <View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                    Progresso para Level {report.level + 1}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "700",
                      color: colors.accent,
                    }}
                  >
                    {report.nextLevelProgress}%
                  </Text>
                </View>
                <View
                  style={{
                    height: 10,
                    backgroundColor: colors.inputBackground,
                    borderRadius: 5,
                    overflow: "hidden",
                  }}
                >
                  <Animated.View
                    style={{
                      height: "100%",
                      backgroundColor: colors.accent,
                      width: progressWidth,
                      borderRadius: 5,
                    }}
                  />
                </View>
              </View>
            </View>
          </ScaleInView>

          <FadeInView duration={600} delay={300}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: colors.textPrimary,
                marginBottom: 12,
              }}
            >
              ⏱️ Tempo de Uso
            </Text>
          </FadeInView>

          <View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
            <SlideInView
              direction="left"
              duration={500}
              delay={400}
              style={{ flex: 1 }}
            >
              <View
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 16,
                  padding: 16,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: colors.glassBorder,
                }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: `${colors.accent}20`,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 8,
                  }}
                >
                  <Ionicons name="time" size={24} color={colors.accent} />
                </View>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "700",
                    color: colors.textPrimary,
                  }}
                >
                  {report.totalTime}
                </Text>
                <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                  Tempo Total
                </Text>
              </View>
            </SlideInView>

            <SlideInView
              direction="right"
              duration={500}
              delay={500}
              style={{ flex: 1 }}
            >
              <View
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 16,
                  padding: 16,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: colors.glassBorder,
                }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: `#4CAF5020`,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 8,
                  }}
                >
                  <Ionicons name="calendar" size={24} color="#4CAF50" />
                </View>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "700",
                    color: colors.textPrimary,
                  }}
                >
                  {report.daysActive}
                </Text>
                <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                  Dias Ativos
                </Text>
              </View>
            </SlideInView>
          </View>

          <SlideInView direction="bottom" duration={500} delay={600}>
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 16,
                padding: 16,
                marginBottom: 20,
                borderWidth: 1,
                borderColor: colors.glassBorder,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.textSecondary,
                      marginBottom: 4,
                    }}
                  >
                    Sessões
                  </Text>
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "700",
                      color: colors.textPrimary,
                    }}
                  >
                    {stats.sessionCount}
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.textSecondary,
                      marginBottom: 4,
                    }}
                  >
                    Tempo Médio
                  </Text>
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "700",
                      color: colors.accent,
                    }}
                  >
                    {report.averageSessionTime}
                  </Text>
                </View>
              </View>
            </View>
          </SlideInView>

          <FadeInView duration={600} delay={700}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: colors.textPrimary,
                marginBottom: 12,
              }}
            >
              📊 Atividades
            </Text>
          </FadeInView>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 20,
            }}
          >
            {[
              {
                icon: "eye",
                label: "Visualizações",
                value: stats.totalCarViews,
                color: "#2196F3",
                delay: 800,
              },
              {
                icon: "heart",
                label: "Favoritos",
                value: stats.totalFavorites,
                color: "#E91E63",
                delay: 850,
              },
              {
                icon: "git-compare",
                label: "Comparações",
                value: stats.totalComparisons,
                color: "#9C27B0",
                delay: 900,
              },
              {
                icon: "star",
                label: "Avaliações",
                value: stats.totalReviews,
                color: "#FF9800",
                delay: 950,
              },
              {
                icon: "search",
                label: "Buscas",
                value: stats.totalSearches,
                color: "#00BCD4",
                delay: 1000,
              },
              {
                icon: "share-social",
                label: "Compartilhados",
                value: stats.shareCount,
                color: "#4CAF50",
                delay: 1050,
              },
            ].map((stat, index) => (
              <ScaleInView
                key={stat.label}
                duration={400}
                delay={stat.delay}
                style={{ flex: 1, minWidth: "48%" }}
              >
                <View
                  style={{
                    backgroundColor: colors.surface,
                    borderRadius: 16,
                    padding: 16,
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: colors.glassBorder,
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: `${stat.color}20`,
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 8,
                    }}
                  >
                    <Ionicons
                      name={stat.icon as any}
                      size={20}
                      color={stat.color}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "700",
                      color: colors.textPrimary,
                    }}
                  >
                    {stat.value}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      color: colors.textSecondary,
                      textAlign: "center",
                    }}
                  >
                    {stat.label}
                  </Text>
                </View>
              </ScaleInView>
            ))}
          </View>

          {report.mostViewedCar && (
            <SlideInView direction="left" duration={500} delay={1100}>
              <View
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 20,
                  borderWidth: 2,
                  borderColor: colors.accent,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <Ionicons
                    name="trophy"
                    size={20}
                    color="#FFD700"
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: colors.textPrimary,
                    }}
                  >
                    Carro Mais Visto
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: colors.textPrimary,
                    marginBottom: 4,
                  }}
                >
                  {mostViewedCar?.name || "Carregando..."}
                </Text>
                {mostViewedCar && (
                  <Text
                    style={{
                      fontSize: 13,
                      color: colors.textSecondary,
                      marginBottom: 8,
                    }}
                  >
                    {mostViewedCar.brand} • {mostViewedCar.year}
                  </Text>
                )}
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: colors.accent,
                  }}
                >
                  {report.mostViewedCar.views} visualizações
                </Text>
              </View>
            </SlideInView>
          )}

          {report.topSearches.length > 0 && (
            <>
              <FadeInView duration={600} delay={1200}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: colors.textPrimary,
                    marginBottom: 12,
                  }}
                >
                  🔍 Top Buscas
                </Text>
              </FadeInView>

              {report.topSearches.map((search, index) => (
                <SlideInView
                  key={search.term}
                  direction="right"
                  duration={400}
                  delay={1250 + index * 50}
                >
                  <View
                    style={{
                      backgroundColor: colors.surface,
                      borderRadius: 12,
                      padding: 12,
                      marginBottom: 8,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderWidth: 1,
                      borderColor: colors.glassBorder,
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <View
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 14,
                          backgroundColor: colors.accent,
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: 12,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: "700",
                            color: "#fff",
                          }}
                        >
                          {index + 1}
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "600",
                          color: colors.textPrimary,
                        }}
                      >
                        {search.term}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "700",
                        color: colors.textSecondary,
                      }}
                    >
                      {search.count}x
                    </Text>
                  </View>
                </SlideInView>
              ))}
            </>
          )}

          <FadeInView duration={600} delay={1500}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: colors.textPrimary,
                marginTop: 20,
                marginBottom: 12,
              }}
            >
              🏆 Conquistas ({report.achievements.length}/10)
            </Text>
          </FadeInView>

          {report.achievements.length === 0 ? (
            <SlideInView direction="bottom" duration={500} delay={1600}>
              <View
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 16,
                  padding: 24,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: colors.glassBorder,
                }}
              >
                <Ionicons
                  name="trophy-outline"
                  size={60}
                  color={colors.textTertiary}
                />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: colors.textPrimary,
                    marginTop: 12,
                  }}
                >
                  Nenhuma conquista ainda
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: colors.textSecondary,
                    textAlign: "center",
                    marginTop: 4,
                  }}
                >
                  Continue explorando para desbloquear!
                </Text>
              </View>
            </SlideInView>
          ) : (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
              {report.achievements.map((achievement, index) => (
                <ScaleInView
                  key={achievement.id}
                  duration={400}
                  delay={1600 + index * 100}
                  style={{ flex: 1, minWidth: "48%" }}
                >
                  <PulseView minOpacity={0.9} maxOpacity={1} duration={2000}>
                    <View
                      style={{
                        backgroundColor: colors.surface,
                        borderRadius: 16,
                        padding: 16,
                        alignItems: "center",
                        borderWidth: 2,
                        borderColor: "#FFD700",
                      }}
                    >
                      <View
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 25,
                          backgroundColor: "#FFD70030",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: 8,
                        }}
                      >
                        <Ionicons
                          name={achievement.icon as any}
                          size={28}
                          color="#FFD700"
                        />
                      </View>
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "700",
                          color: colors.textPrimary,
                          textAlign: "center",
                          marginBottom: 4,
                        }}
                      >
                        {achievement.title}
                      </Text>
                      <Text
                        style={{
                          fontSize: 10,
                          color: colors.textSecondary,
                          textAlign: "center",
                        }}
                      >
                        {achievement.description}
                      </Text>
                    </View>
                  </PulseView>
                </ScaleInView>
              ))}
            </View>
          )}

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </View>
  );
}
