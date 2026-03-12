import { StyleSheet } from "react-native";

export const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  backgroundParticles: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },

  particle: {
    position: "absolute",
    borderRadius: 999,
    opacity: 0.15,
  },

  particle1: {
    width: 300,
    height: 300,
    backgroundColor: colors.particleColor,
    top: "10%",
    left: "-20%",
    shadowColor: colors.particleColor,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 100,
    elevation: 10,
  },

  particle2: {
    width: 250,
    height: 250,
    backgroundColor: colors.particleColorSecondary,
    top: "60%",
    right: "-15%",
    shadowColor: colors.particleColorSecondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 80,
    elevation: 8,
  },

  particle3: {
    width: 200,
    height: 200,
    backgroundColor: colors.particleColor,
    bottom: "5%",
    left: "20%",
    shadowColor: colors.particleColor,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 90,
    elevation: 9,
  },

  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
  },

  logoContainer: {
    marginBottom: 10,
    alignItems: "center",
  },

  image: {
    width: 340,
    height: 220,
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

  input: {
    width: "100%",
    backgroundColor: colors.inputBackground,
    borderRadius: 16,
    padding: 18,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },

  passwordContainer: {
    position: "relative",
    width: "100%",
  },

  passwordInput: {
    paddingRight: 50,
  },

  eyeIcon: {
    position: "absolute",
    right: 16,
    top: "50%",
    transform: [{ translateY: -12 }],
    padding: 4,
  },

  eyeImage: {
    width: 24,
    height: 24,
  },

  button: {
    backgroundColor: colors.accent,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 8,
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

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.glassBorder,
  },

  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: colors.textTertiary,
    fontWeight: "500",
  },

  registerLink: {
    alignItems: "center",
  },

  textCadastro: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: "400",
  },

  textCadastroStrong: {
    color: colors.textPrimary,
    fontWeight: "700",
  },

  footerText: {
    marginTop: 32,
    fontSize: 13,
    color: colors.textTertiary,
    fontWeight: "500",
  },
});