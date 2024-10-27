import {
  StyleSheet,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import React, { useState, useContext, useRef } from "react";
import SearchComponent from "../components/SearchBar/SearchComponent";
import { DEFAULT_MY_BAR_INGREDIENT_PAGE_SIZE } from "../util/const";
import { getIngredients } from "../services/ingredientsService";
import { useEffect } from "react";
import PageLoading from "../components/PageLoading/PageLoading";
import { CocktailAppContext } from "../context/cocktailAppContext";
import ListEmptyComponent from "../components/ListEmptyComponent/ListEmptyComponent";
import { Avatar } from "@rneui/themed";
import { addOrRemoveMyBar } from "../services/ingredientsService";
import useUpdateEffect from "../util/useUpdateEffect";

const Ingredients = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { userIngredientsData, setUserIngredientsData, setFilterCocktails } =
    useContext(CocktailAppContext);
  const [cursor, setCursor] = useState(0);
  const [data, setData] = useState([]);
  const currentPageRef = useRef(cursor);
  const [flatLoading, setFlatLoading] = useState(false);

  // --------------------- LIFECYCLE ---------------------

  useEffect(() => {
    if (currentPageRef.current == cursor) {
      getIngredients(cursor, search, DEFAULT_MY_BAR_INGREDIENT_PAGE_SIZE).then(
        (result) => {
          setData(result?.content);
          setLoading(false);
        }
      );
      setFlatLoading(false);
    } else {
      setFlatLoading(true);
      getIngredients(cursor, search, DEFAULT_MY_BAR_INGREDIENT_PAGE_SIZE).then(
        (result) => {
          setData((prev) => [...prev, ...result?.content]);
          setFlatLoading(false);
        }
      );
    }
  }, [cursor, search]);

  useUpdateEffect(() => {
    setCursor(0);
  }, [search]);

  useEffect(() => {
    const handleIngreditentFilter = () => {
      setFilterCocktails((prevState) => ({
        ...prevState,
        inputText: "",
        ingredientIds: userIngredientsData?.map((item) => item.ingredientId),
        alcoholicCategoryId: null,
        drinkCategoryId: null,
      }));
    };

    const focusListener = navigation.addListener(
      "focus",
      handleIngreditentFilter
    );

    const blurListener = navigation.addListener("blur", () => {
      handleIngreditentFilter();
      setSearch("");
      setCursor(0);
    });

    return () => {
      focusListener();
      blurListener();
    };
  }, [navigation, userIngredientsData]);

  // --------------------- METHODS ---------------------

  const addOrRemoveIngredient = (itemId) => {
    const item = data?.find((x) => x?.ingredientId == itemId);
    const existInUserIngredients = userIngredientsData?.some(
      (x) => x.ingredientId == itemId
    );
    if (existInUserIngredients) {
      setUserIngredientsData((prevState) =>
        prevState?.filter((x) => x?.ingredientId != itemId)
      );
      addOrRemoveMyBar(itemId)
        .then()
        .catch((e) =>
          setUserIngredientsData((prevState) => [...prevState, item])
        );
    } else {
      setUserIngredientsData((prevState) => [...prevState, item]);
      addOrRemoveMyBar(itemId)
        .then()
        .catch((e) =>
          setUserIngredientsData((prevState) =>
            prevState?.filter((x) => x?.ingredientId != itemId)
          )
        );
    }
  };

  const nextPage = () => {
    if (data?.length >= DEFAULT_MY_BAR_INGREDIENT_PAGE_SIZE) {
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
        <TouchableOpacity
          style={[
            styles.item,
            userIngredientsData?.some(
              (x) => x.ingredientId == item.ingredientId
            ) && styles.itemWithBorder,
          ]}
          onPress={() => addOrRemoveIngredient(item.ingredientId)}
        >
          <Text style={styles.text}>{item.ingredientName}</Text>
        </TouchableOpacity>
      );
    }
  };

  if (data?.length % 3 == 1 || data?.length % 3 == 2) {
    if (data?.length % 3 == 1) {
      data.push(null, null);
    } else if (data?.length % 3 == 2) {
      data.push(null);
    }
  }

  return loading ? (
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

      <FlatList
        data={data}
        keyExtractor={(item, index) => item?.ingredientId || index.toString()}
        renderItem={renderItem}
        numColumns={3}
        onEndReached={nextPage}
        ListEmptyComponent={() => (
          <ListEmptyComponent color={{ color: "white" }} text="No Data" />
        )}
        ListFooterComponent={() =>
          flatLoading ? (
            <ActivityIndicator size="large" color="#00E8B1" />
          ) : null
        }
        onEndReachedThreshold={0.1}
        ListHeaderComponent={() => {
          return (
            <Text
              style={{
                textAlign: "center",
                fontSize: 20,
                fontFamily: "lexandDecaExtraLight",
                color: "white",
                marginBottom: 24,
              }}
            >
              Ingredients
            </Text>
          );
        }}
      />
    </ImageBackground>
  );
};

export default Ingredients;

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
    marginBottom: 24,
    marginHorizontal: 15,
  },
  text: {
    color: "white",
    fontSize: 10,
    fontFamily: "lexandDecaExtraLight",
    textAlign: "center",
  },
  item: {
    flex: 1,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
    height: 44,
    backgroundColor: "#151515",
    shadowColor: "#FFF",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    borderRadius: 15,
    elevation: 4,
  },
  itemWithBorder: {
    borderColor: "#BA0064",
    borderWidth: 1,
  },
  oddItem: {
    flex: 1,
  },
});
