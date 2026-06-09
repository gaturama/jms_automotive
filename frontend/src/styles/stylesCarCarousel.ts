import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden",
  },
  
  image: {
    backgroundColor: "#1a1a1a",
  },
  
  pagination: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "center",
  },
  
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  
  dotActive: {
    width: 24,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#64748B",
    shadowColor: "#64748B",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 4,
  },
});