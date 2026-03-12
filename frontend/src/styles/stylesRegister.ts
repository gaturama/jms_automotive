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
      top: "15%",
      right: "-20%",
      shadowColor: colors.particleColor,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 100,
      elevation: 10,
    },

    particle2: {
      width: 220,
      height: 220,
      backgroundColor: colors.particleColorSecondary,
      top: "50%",
      left: "-15%",
      shadowColor: colors.particleColorSecondary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 80,
      elevation: 8,
    },

    particle3: {
      width: 180,
      height: 180,
      backgroundColor: colors.particleColor,
      bottom: "10%",
      right: "25%",
      shadowColor: colors.particleColor,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.7,
      shadowRadius: 90,
      elevation: 9,
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

    titleContainer: {
      marginBottom: 32,
    },

    title: {
      fontSize: 32,
      fontWeight: "700",
      color: colors.textPrimary,
      marginBottom: 8,
      letterSpacing: -0.5,
    },

    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      fontWeight: "400",
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
      shadowOpacity: 0.5,
      shadowRadius: 20,
      elevation: 15,
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
      gap: 8,
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

    loginLink: {
      alignItems: "center",
      marginTop: 20,
    },

    textLogin: {
      fontSize: 15,
      color: colors.textSecondary,
      fontWeight: "400",
    },

    textLoginStrong: {
      color: colors.accentLight,
      fontWeight: "700",
    },
    errorHint: {
      fontSize: 12,
      color: "#FF6B6B",
      marginTop: 4,
      marginLeft: 4,
    },
  });
