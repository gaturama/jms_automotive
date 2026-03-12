import { StyleSheet } from "react-native";

export const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingTop: 50,
      paddingBottom: 16,
      backgroundColor: colors.accent,
      shadowColor: colors.accent,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },

    backButton: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },

    headerTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: "#fff",
      letterSpacing: 0.5,
    },

    backgroundParticles: {
      position: "absolute",
      width: "100%",
      height: "100%",
    },

    particle: {
      position: "absolute",
      borderRadius: 999,
      opacity: 0.12,
    },

    particle1: {
      width: 280,
      height: 280,
      backgroundColor: colors.particleColor,
      top: "20%",
      left: "-25%",
    },

    particle2: {
      width: 220,
      height: 220,
      backgroundColor: colors.particleColorSecondary,
      top: "55%",
      right: "-20%",
    },

    particle3: {
      width: 180,
      height: 180,
      backgroundColor: colors.particleColor,
      bottom: "8%",
      left: "30%",
    },

    scrollContent: {
      flexGrow: 1,
      paddingBottom: 40,
    },

    contentContainer: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 30,
    },

    avatarContainer: {
      alignItems: "center",
      marginBottom: 12,
    },

    avatarGlass: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: colors.glassBackground,
      borderWidth: 3,
      borderColor: colors.accentLight,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: colors.accent,
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 10,
    },

    avatarText: {
      fontSize: 40,
      color: colors.accent,
      fontWeight: "700",
    },

    avatarEditButton: {
      position: "absolute",
      bottom: 0,
      right: "35%",
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.accent,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 3,
      borderColor: colors.background,
    },

    avatarLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 28,
      fontWeight: "500",
    },

    glassCard: {
      width: "100%",
      backgroundColor: colors.glassBackground,
      borderRadius: 28,
      padding: 24,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      shadowColor: colors.shadowColor,
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 15,
    },

    themeSection: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 16,
    },

    themeSectionLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },

    themeSectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.textPrimary,
    },

    themeSectionSubtitle: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 2,
    },

    divider: {
      height: 1,
      backgroundColor: colors.glassBorder,
      marginVertical: 20,
    },

    inputContainer: {
      marginBottom: 20,
    },

    inputLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
      marginBottom: 8,
      marginLeft: 4,
    },

    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.inputBackground,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      paddingHorizontal: 16,
    },

    inputIcon: {
      marginRight: 12,
    },

    input: {
      flex: 1,
      padding: 18,
      fontSize: 16,
      color: colors.textPrimary,
    },

    passwordInput: {
      paddingRight: 50,
    },

    eyeIcon: {
      padding: 8,
      position: "absolute",
      right: 12,
    },

    button: {
      backgroundColor: colors.accent,
      paddingVertical: 18,
      paddingHorizontal: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 8,
      flexDirection: "row",
      shadowColor: colors.accent,
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 8,
    },

    buttonText: {
      fontSize: 18,
      fontWeight: "700",
      color: "#fff",
      letterSpacing: 0.5,
    },

    optionsContainer: {
      marginTop: 28,
      paddingTop: 20,
      borderTopWidth: 1,
      borderTopColor: colors.glassBorder,
    },

    optionButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 16,
      paddingHorizontal: 4,
    },

    optionText: {
      flex: 1,
      fontSize: 16,
      color: colors.textPrimary,
      marginLeft: 12,
      fontWeight: "500",
    },

    logoutButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 16,
      marginTop: 12,
      borderRadius: 12,
      backgroundColor: colors.accentLight,
      borderWidth: 1,
      borderColor: colors.accent + "40",
    },

    logoutText: {
      fontSize: 16,
      color: colors.accent,
      fontWeight: "600",
      marginLeft: 8,
    },
  });
