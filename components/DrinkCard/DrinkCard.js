import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { Card, CheckBox, Dialog } from "@rneui/themed";
import React from "react";
import { height, width } from "../../util/const";
import { useState } from "react";
import { useRef } from "react";
import { addOrRemoveFavouriteCocktails } from "../../services/cocktailService";
import { useContext } from "react";
import { CocktailAppContext } from "../../context/cocktailAppContext";

const DrinkCard = ({ handleOnPress, item, isFavoriteScreen }) => {
  const [removeFavouriteDialog, setRemoveFavouriteDialog] = useState(false);
  const selectedFavouriteCocktails = useRef();
  const { toggleCheckBox } = useContext(CocktailAppContext);

  // --------------------- METHODS ---------------------
  const toggleRemoveFavouriteDialog = () => {
    setRemoveFavouriteDialog(!removeFavouriteDialog);
  };

  // --------------------- RENDER ---------------------
  return (
    <Card containerStyle={styles.cardContainer}>
      <TouchableOpacity activeOpacity={0.7} onPress={handleOnPress}>
        <Image
          source={{
            uri: isFavoriteScreen
              ? item?.imageLinks[0].imageLink
              : item?.filterDrinkProjection.drinkCoverImage,
          }}
          style={styles.cardImage}
          resizeMode="cover"
        />
      </TouchableOpacity>
      <View style={styles.cardTitleContainer}>
        <Dialog
          isVisible={removeFavouriteDialog}
          onBackdropPress={toggleRemoveFavouriteDialog}
          overlayStyle={{ backgroundColor: "#1F1F1F", borderRadius: 10 }}
        >
          <Dialog.Title
            title="Removing from favorite cocktails"
            titleStyle={styles.dialogTitle}
          />
          <Text style={styles.dialogText}>
            Are you sure you want to remove the selected cocktail from your
            favorite cocktails?
          </Text>
          <Dialog.Actions>
            <Dialog.Button
              title="No"
              onPress={toggleRemoveFavouriteDialog}
              titleStyle={{ color: "#00E8B1" }}
            />
            <Dialog.Button
              title="Yes"
              titleStyle={{ color: "#00E8B1" }}
              onPress={() => {
                addOrRemoveFavouriteCocktails(
                  selectedFavouriteCocktails.current
                ).then(() => {
                  toggleCheckBox(selectedFavouriteCocktails.current);
                  toggleRemoveFavouriteDialog();
                });
              }}
            />
          </Dialog.Actions>
        </Dialog>
        <View style={styles.contentContainer}>
          <CheckBox
            checked={
              isFavoriteScreen ? true : item?.favouriteDrinkDto.favourite
            }
            checkedIcon="star"
            uncheckedIcon="star-o"
            checkedColor="#BA0064"
            uncheckedColor="#BA0064"
            size={20}
            containerStyle={{
              backgroundColor: "transparent",
              padding: 0,
              paddingTop: 5,
              marginBottom: 4,
              margin: 0,
            }}
            onPress={() => {
              if (isFavoriteScreen) {
                setRemoveFavouriteDialog(!removeFavouriteDialog);
                selectedFavouriteCocktails.current = item.drinkId;
              } else {
                toggleCheckBox(item?.filterDrinkProjection.drinkId);
                addOrRemoveFavouriteCocktails(
                  item?.filterDrinkProjection.drinkId
                )
                  .then()
                  .catch((e) =>
                    toggleCheckBox(item?.filterDrinkProjection.drinkId)
                  );
              }
            }}
          />
          <Text style={styles.cardTitleText}>
            {isFavoriteScreen
              ? item?.drinkName?.length >= 18
                ? item?.drinkName.slice(0, 15) + "..."
                : item?.drinkName
              : item?.filterDrinkProjection.drinkName?.length >= 18
              ? item?.filterDrinkProjection.drinkName.slice(0, 15) + "..."
              : item?.filterDrinkProjection.drinkName}
          </Text>
        </View>
      </View>
    </Card>
  );
};

export default React.memo(DrinkCard);

const cardHeight = height / 4;

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 20,
    marginBottom: 10,
    overflow: "hidden",
    width: width / 2 - 60,
    height: cardHeight,
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
  cardTitleContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 0,
  },
  contentContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 0,
  },
  cardTitleText: {
    fontSize: 12,
    fontFamily: "robotoSerifLight",
    color: "white",
    textAlign: "center",
    lineHeight: 16,
    paddingBottom: 6,
  },
  cardImage: {
    height: cardHeight,
    width: "100%",
    padding: 0,
  },
  dialogText: {
    fontSize: 12,
    color: "#FAFAFA",
  },
  dialogTitle: {
    color: "#FAFAFA",
    textAlign: "center",
  },
});
