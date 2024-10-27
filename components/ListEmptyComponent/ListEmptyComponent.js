import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { height } from "../../util/const";

const ListEmptyComponent = ({ color, text }) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, color]}>{text}</Text>
    </View>
  );
};

export default ListEmptyComponent;

const marginTop = height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 14,
    marginTop: height / 3.5 - 100,
    textAlign: "center",
    fontFamily: "lexandDecaExtraLight",
  },
});
