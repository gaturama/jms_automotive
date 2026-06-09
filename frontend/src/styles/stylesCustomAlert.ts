import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.85)",
  },

  modalView: {
    margin: 20,
    backgroundColor: "rgba(30, 30, 30, 0.95)",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 15,
    width: "85%",
    maxWidth: 400,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },

  modalTitle: {
    marginBottom: 12,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },

  modalText: {
    marginBottom: 28,
    textAlign: "center",
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 24,
  },

  closeButton: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 32,
    minWidth: 120,
    backgroundColor: "#B8860B",
    shadowColor: "#B8860B",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },

  textStyle: {
    color: "#FFFFFF",
    fontWeight: "700",
    textAlign: "center",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});