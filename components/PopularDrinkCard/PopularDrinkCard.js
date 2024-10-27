import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { Card } from "@rneui/themed";
import React from "react";
import { height, width } from "../../util/const";

const PopularDrinkCard = ({ item, navigation }) => {
  return (
    <Card containerStyle={styles.popularCardContainer}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          navigation.navigate("Details", {
            drinkId: item?.drinkId,
            favourite: item?.favourite,
          });
        }}
      >
        <Image
          source={{ uri: item?.imageLinks[0]?.imageLink }}
          style={styles.popularCardImage}
        />
      </TouchableOpacity>
      <View style={styles.popularCardTitleContainer}>
        <Text style={styles.popularCardTitleText}>
          {item.drinkName?.length > 7
            ? item.drinkName.substring(0, 7) + "..."
            : item.drinkName}
        </Text>
      </View>
    </Card>
  );
};

export default PopularDrinkCard;

const popularColumnWidth = (width - 220) / 2.45;

const cardHeight = height / 8;

const styles = StyleSheet.create({
  popularCardContainer: {
    margin: 5,
    borderRadius: 10,
    overflow: "hidden",
    width: popularColumnWidth,
    padding: 0,
    borderWidth: 0,
    backgroundColor: "black",
    shadowColor: "#AAA",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  popularCardImage: {
    height: cardHeight,
    width: "100%",
  },
  popularCardTitleContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 2,
  },
  popularCardTitleText: {
    fontSize: 10,
    fontFamily: "robotoSerifLight",
    color: "white",
    textAlign: "center",
    paddingBottom: 4,
  },
});
