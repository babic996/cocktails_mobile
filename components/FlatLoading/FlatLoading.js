import { StyleSheet, View, ActivityIndicator } from "react-native";
import React from "react";

const FlatLoading = () => {
  // --------------------- RENDER ---------------------
  return (
    <View style={styles.flatLoading}>
      <ActivityIndicator size="small" color="#007AFF" />
    </View>
  );
};

export default FlatLoading;

const styles = StyleSheet.create({
  flatLoading: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
