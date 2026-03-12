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
    opacity: 0.1,
  },

  particle1: {
    width: 280,
    height: 280,
    backgroundColor: colors.particleColor,
    top: "15%",
    left: "-20%",
  },

  particle2: {
    width: 240,
    height: 240,
    backgroundColor: colors.particleColorSecondary,
    top: "60%",
    right: "-15%",
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
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },

  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
  },

  selectorsContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    alignItems: "center",
  },

  carSelector: {
    flex: 1,
    backgroundColor: colors.glassBackground,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    minHeight: 140,
    justifyContent: "center",
  },

  selectedCarContainer: {
    gap: 8,
  },

  selectedCarName: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.textPrimary,
  },

  selectedCarModel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "500",
  },

  quickStats: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },

  quickStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  quickStatValue: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textPrimary,
  },

  emptyCarContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },

  emptyCarText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textTertiary,
  },

  swapButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.glassBackground,
    borderWidth: 2,
    borderColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },

  chartsSection: {
    padding: 16,
  },

  specsSection: {
    padding: 16,
  },

  summarySection: {
    padding: 16,
    paddingBottom: 32,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 16,
    letterSpacing: 0.3,
  },

  comparisonTable: {
    backgroundColor: colors.glassBackground,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },

  categoryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.accentLight,
    marginTop: 16,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  comparisonRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.glassBorder,
  },

  comparisonCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
  },

  winnerCell: {
    backgroundColor: colors.accentLight,
  },

  comparisonValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
    textAlign: "center",
  },

  winnerText: {
    color: colors.accent,
    fontWeight: "700",
  },

  comparisonLabel: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  comparisonLabelText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
  },

  summaryCard: {
    backgroundColor: colors.glassBackground,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    gap: 12,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },

  summaryLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textSecondary,
  },

  summaryValue: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.accentLight,
    flex: 1,
    textAlign: "right",
  },

  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    paddingHorizontal: 40,
  },

  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: 20,
    marginBottom: 12,
  },

  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "flex-end",
  },

  modalContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: "80%",
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.glassBorder,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: 0.3,
  },

  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.inputBackground,
    alignItems: "center",
    justifyContent: "center",
  },

  modalCarItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.glassBorder,
  },

  modalCarName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
  },

  modalCarBrand: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "500",
  },

  modalCarStats: {
    alignItems: "flex-end",
    gap: 4,
  },

  modalCarStat: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.accentLight,
  },
});