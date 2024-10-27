import { StyleSheet, View, ActivityIndicator } from "react-native";
import React from "react";

const PageLoading = () => {
  // --------------------- RENDER ---------------------
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#00E8B1" />
    </View>
  );
};

export default PageLoading;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#151515",
  },
});
