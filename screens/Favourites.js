import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  ImageBackground,
  Text,
} from "react-native";
import React, { useEffect, useRef, useContext } from "react";
import SearchComponent from "../components/SearchBar/SearchComponent";
import { useState } from "react";
import DrinkCard from "../components/DrinkCard/DrinkCard";
import { getFavouriteCocktails } from "../services/cocktailService";
import useUpdateEffect from "../util/useUpdateEffect";
import PageLoading from "../components/PageLoading/PageLoading";
import { CocktailAppContext } from "../context/cocktailAppContext";
import { DEFAULT_PAGE_SIZE } from "../util/const";
import ListEmptyComponent from "../components/ListEmptyComponent/ListEmptyComponent";
import { Avatar } from "@rneui/themed";

const Favourites = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [flatLoading, setFlatLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState(0);
  const currentPageRef = useRef(cursor);
  const {
    favouriteCocktailsData,
    setFavouriteCocktailsData,
    setCocktailHomeData,
    filterCocktails,
    setFilterCocktails,
    cocktailHomeData,
    userIngredientsData,
  } = useContext(CocktailAppContext);

  // --------------------- LIFECYCLE ---------------------

  useEffect(() => {
    if (currentPageRef.current == cursor) {
      getFavouriteCocktails(cursor, search).then((result) => {
        setFavouriteCocktailsData(result?.content);
        setLoading(false);
      });
    } else {
      getFavouriteCocktails(cursor, search).then((result) => {
        setFavouriteCocktailsData((prev) => [...prev, ...result?.content]);
        setFlatLoading(false);
      });
    }
  }, [cursor, search, cocktailHomeData]);

  useUpdateEffect(() => {
    setCursor(0);
  }, [search]);

  useEffect(() => {
    const focusListener = navigation.addListener("focus", () => {
      // Ovdje stavite kod koji želite da se izvrši kada se ekran fokusira
      setFilterCocktails((prevState) => ({
        ...prevState,
        inputText: "",
        ingredientIds: userIngredientsData?.map((item) => item.ingredientId),
        alcoholicCategoryId: null,
        drinkCategoryId: null,
      }));
    });

    const blurListener = navigation.addListener("blur", () => {
      // Ovdje stavite kod koji želite da se izvrši kada se ekran napusti
      setSearch("");
      setCursor(0);
    });

    return () => {
      focusListener();
      blurListener();
    };
  }, [navigation]);

  // --------------------- METHODS ---------------------
  const toggleCheckBox = (itemId) => {
    setFavouriteCocktailsData((prev) =>
      prev?.filter((x) => x.drinkId != itemId)
    );
    setCocktailHomeData((prevDrinks) =>
      prevDrinks?.map((drink) => {
        if (drink.filterDrinkProjection.drinkId == itemId) {
          return { ...drink, favourite: false };
        }
        return drink;
      })
    );
  };
  const nextPage = () => {
    if (favouriteCocktailsData?.length >= DEFAULT_PAGE_SIZE) {
      setCursor((prev) => prev + 1);
      setFlatLoading(true);
    }
  };
  // --------------------- RENDER ---------------------
  const renderItem = ({ item }) => {
    if (item == null) {
      return <View style={styles.oddItem} />;
    } else {
      return (
        <DrinkCard
          item={item}
          handleOnPress={() => {
            navigation.navigate("Details", {
              drinkId: item?.drinkId,
              filter: filterCocktails,
              favourite: item?.favourite,
            });
          }}
          handleCheckbox={toggleCheckBox}
          isFavoriteScreen={true}
        />
      );
    }
  };

  if (favouriteCocktailsData?.length % 2 != 0) {
    favouriteCocktailsData.push(null);
  }

  return loading == true ? (
    <PageLoading />
  ) : (
    <ImageBackground
      source={require("../assets/img/Background-var3.png")}
      style={styles.container}
    >
      <View style={styles.searchContainer}>
        <Avatar
          source={require("../assets/img/logosearch.png")}
          containerStyle={{
            marginRight: 15,
            height: 40,
            width: 30,
          }}
        />
        <SearchComponent
          placeholderText="Search..."
          setInputText={setSearch}
          inputText={search}
          backgroundColor={{ backgroundColor: "#1F1F1F" }}
          textColor={{ color: "white" }}
          placeHolderTextColor="white"
          searchIcon={{ color: "#00E8B1" }}
          clearIcon={{ color: "#FAFAFA" }}
          isRound={true}
        />
      </View>
      <View style={styles.flatListContainer}>
        <FlatList
          data={favouriteCocktailsData}
          keyExtractor={(item, index) => item?.drinkId || index.toString()}
          renderItem={renderItem}
          numColumns={2}
          onEndReached={nextPage}
          ListEmptyComponent={() => (
            <ListEmptyComponent color={{ color: "white" }} />
          )}
          ListFooterComponent={() =>
            flatLoading ? (
              <ActivityIndicator size="large" color="#00E8B1" />
            ) : null
          }
          onEndReachedThreshold={0.1}
          ListHeaderComponent={() => {
            return <Text style={styles.flatListTitle}>Favorite Cocktails</Text>;
          }}
        />
      </View>
    </ImageBackground>
  );
};

export default Favourites;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 45,
    backgroundColor: "transparent",
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
    marginHorizontal: 15,
  },
  flatListContainer: {
    flex: 1,
    marginTop: 24,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  flatListTitle: {
    textAlign: "center",
    fontSize: 20,
    fontFamily: "lexandDecaExtraLight",
    color: "white",
  },
  oddItem: {
    flex: 1,
  },
});
