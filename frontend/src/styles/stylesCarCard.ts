import { StyleSheet } from "react-native";

export const createStyles = (colors: any) =>StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 24,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.glassBorder,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },

  info: {
    padding: 20,
    backgroundColor: colors.glassBackground,
  },

  name: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 16,
    letterSpacing: 0.3,
  },

  specs: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  specItem: {
    flex: 1,
    alignItems: "flex-start",
  },

  specLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 6,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  specValue: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.accentLight,
    letterSpacing: 0.3,
  },

  badge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
});