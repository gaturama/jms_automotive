import { StyleSheet } from "react-native";

export const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    header: {
      backgroundColor: colors.accent,
      elevation: 8,
      shadowColor: colors.accent,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },

    mainInfo: {
      padding: 20,
    },

    carName: {
      fontSize: 32,
      fontWeight: "700",
      color: colors.textPrimary,
      marginBottom: 6,
      letterSpacing: -0.5,
    },

    carModel: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 20,
      fontWeight: "500",
    },

    priceContainer: {
      backgroundColor: colors.glassBackground,
      padding: 20,
      borderRadius: 16,
      marginTop: 8,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },

    priceLabel: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 6,
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: 1,
    },

    price: {
      fontSize: 28,
      fontWeight: "700",
      color: "#4CAF50",
      letterSpacing: 0.5,
    },

    section: {
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: colors.glassBorder,
    },

    sectionTitle: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.textPrimary,
      marginBottom: 16,
      letterSpacing: 0.3,
    },

    description: {
      fontSize: 15,
      color: colors.textSecondary,
      lineHeight: 24,
    },

    highlightsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },

    highlightCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      padding: 20,
      alignItems: "center",
      flex: 1,
      minWidth: "45%",
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },

    highlightValue: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.textPrimary,
      marginTop: 10,
      letterSpacing: 0.3,
    },

    highlightLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 6,
      textAlign: "center",
      fontWeight: "500",
    },

    specsContainer: {
      gap: 10,
    },

    specRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: colors.glassBackground,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },

    specLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      flex: 1,
    },

    specLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "500",
    },

    specValue: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.accentLight,
      letterSpacing: 0.3,
    },

    actionContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.accent,
      marginHorizontal: 20,
      marginTop: 8,
      borderRadius: 16,
      paddingVertical: 16,
      shadowColor: colors.accent,
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 8,
    },

    bottomSpacing: {
      height: 32,
    },
    actionsRow: {
      flexDirection: "row",
      paddingHorizontal: 16,
      paddingVertical: 8,
      gap: 12,
      marginTop: 16,
    },

    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.accent,
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 14,
      gap: 8,
      shadowColor: colors.accent,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 8,
    },

    actionButtonText: {
      fontSize: 15,
      fontWeight: "700",
      color: "#fff",
      letterSpacing: 0.3,
    },
  });
