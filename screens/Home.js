import React, { useEffect, useRef, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import Modal from "react-native-modal";
import SearchComponent from "../components/SearchBar/SearchComponent";
import FilterComponent from "../components/Filter/FilterComponent";
import {
  getCocktails,
  getMostPopularCocktails,
} from "../services/cocktailService";
import DrinkCard from "../components/DrinkCard/DrinkCard";
import useUpdateEffect from "../util/useUpdateEffect";
import PageLoading from "../components/PageLoading/PageLoading";
import Octicon from "react-native-vector-icons/Octicons";
import PopularDrinkCard from "../components/PopularDrinkCard/PopularDrinkCard";
import { width, height } from "../util/const";
import { CocktailAppContext } from "../context/cocktailAppContext";
import { getMyBar } from "../services/ingredientsService";
import ListEmptyComponent from "../components/ListEmptyComponent/ListEmptyComponent";
import { DEFAULT_PAGE_SIZE } from "../util/const";
import { Avatar } from "@rneui/themed";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

const Home = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [cursor, setCursor] = useState(0);
  const currentPageRef = useRef(cursor);
  const [loading, setLoading] = useState(true);
  const [flatLoading, setFlatLoading] = useState(false);
  const CARD_WIDTH = width / 3;
  const SPACER_SIZE = (width - CARD_WIDTH) / 1.72;
  const flatListRef = useRef();
  const scrollX = useRef(new Animated.Value(0)).current;
  const {
    cocktailHomeData,
    setCocktailHomeData,
    filterCocktails,
    setFilterCocktails,
    setUserIngredientsData,
    popularCocktails,
    setPopularCocktails,
  } = useContext(CocktailAppContext);

  // --------------------- LIFECYCLE ---------------------
  useEffect(() => {
    getMostPopularCocktails().then((res) =>
      setPopularCocktails([
        { drinkId: "left-spacer" },
        ...res.content,
        { drinkId: "right-spacer" },
      ])
    );
    getMyBar().then((result) => {
      setUserIngredientsData(result?.content);
      setFilterCocktails((prevState) => ({
        ...prevState,
        inputText: "",
        ingredientIds: result?.content?.map((item) => item.ingredientId),
        alcoholicCategoryId: null,
        drinkCategoryId: null,
      }));
    });
  }, []);

  useEffect(() => {
    if (currentPageRef.current == cursor) {
      getCocktails(cursor, filterCocktails).then((result) => {
        setCocktailHomeData(result?.content);
        setLoading(false);
        setFlatLoading(false);
      });
    } else {
      getCocktails(cursor, filterCocktails).then((result) => {
        setCocktailHomeData((prev) => [...prev, ...result?.content]);
        setFlatLoading(false);
      });
    }
  }, [cursor, filterCocktails]);

  useUpdateEffect(() => {
    setCursor(0);
  }, [filterCocktails]);

  // --------------------- METHODS ---------------------

  const nextPage = () => {
    if (cocktailHomeData?.length >= DEFAULT_PAGE_SIZE) {
      setCursor((prev) => prev + 1);
      setFlatLoading(true);
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  // --------------------- RENDER ---------------------

  const renderItem = ({ item }) => {
    if (item == null) {
      return <View style={styles.oddItem} />;
    } else {
      return (
        <DrinkCard
          handleOnPress={() => {
            navigation.navigate("Details", {
              drinkId: item?.filterDrinkProjection.drinkId,
              favourite: item?.favouriteDrinkDto?.favourite,
            });
          }}
          item={item}
          isFavoriteScreen={false}
        />
      );
    }
  };

  if (cocktailHomeData?.length % 2 != 0) {
    cocktailHomeData.push(null);
  }

  return loading ? (
    <PageLoading />
  ) : (
    <ImageBackground
      source={require("../assets/img/Background-var3.png")}
      style={styles.container}
    >
      <Modal
        isVisible={isModalVisible}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        backdropOpacity={0.5}
        onBackdropPress={toggleModal}
        style={styles.modalStyle}
      >
        <FilterComponent toggleModal={toggleModal} />
      </Modal>
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
          setInputText={setFilterCocktails}
          inputText={filterCocktails}
          backgroundColor={{ backgroundColor: "#1F1F1F" }}
          textColor={{ color: "white" }}
          placeHolderTextColor="white"
          searchIcon={{ color: "#00E8B1" }}
          clearIcon={{ color: "#FAFAFA" }}
          isRound={true}
        />
        <TouchableOpacity style={styles.filterButton} onPress={toggleModal}>
          <Octicon name="filter" size={16} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.popularCocktailsContainer}>
        <Text style={styles.popularCocktailsTitle}>Popular Cocktails</Text>
        <Animated.FlatList
          data={popularCocktails}
          ref={flatListRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          initialScrollIndex={1}
          getItemLayout={(data, index) => ({
            length: CARD_WIDTH,
            offset: CARD_WIDTH * index,
            index,
          })}
          keyExtractor={(item) => item.drinkId}
          renderItem={({ item, index }) => {
            if (
              item.drinkId === "left-spacer" ||
              item.drinkId === "right-spacer"
            ) {
              return <View style={{ width: SPACER_SIZE }} />;
            }

            const inputRange = [
              (index - 2) * CARD_WIDTH,
              (index - 1) * CARD_WIDTH,
              index * CARD_WIDTH,
            ];

            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [1, 1.22, 1],
              extrapolate: "clamp",
            });
            return (
              <Animated.View
                style={{
                  transform: [{ scale }],
                  width: CARD_WIDTH,
                  marginTop: 12,
                }}
              >
                <PopularDrinkCard item={item} navigation={navigation} />
              </Animated.View>
            );
          }}
        />
      </View>
      <View style={styles.flatListContainer}>
        <FlatList
          data={cocktailHomeData}
          keyExtractor={(item, index) =>
            item?.filterDrinkProjection.drinkId || index.toString()
          }
          renderItem={renderItem}
          numColumns={2}
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
            return <Text style={styles.flatListTitle}>Discover</Text>;
          }}
        />
      </View>
      <BannerAd
        unitId={TestIds.ADAPTIVE_BANNER}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      />
    </ImageBackground>
  );
};

export default Home;
const popularContainerHeight = height / 4.25;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: "cover",
  },
  searchBarContainer: {
    marginTop: 30,
    marginBottom: 10,
    backgroundColor: "transparent",
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
    shadowColor: "#FFFFFF",
  },
  buttonContainer: {
    position: "absolute",
    top: 30,
    right: 10,
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
  filterButton: {
    backgroundColor: "#1F1F1F",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 15,
    shadowColor: "#FFF",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
  columnContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 5,
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  checkboxText: {
    marginTop: 5,
  },
  modalStyle: {
    margin: 0,
    justifyContent: "flex-start",
    marginTop: height / 14,
    marginBottom: 0,
  },
  popularCocktailsContainer: {
    padding: 5,
    paddingBottom: 0,
    alignItems: "center",
    height: popularContainerHeight,
  },
  popularCocktailsTitle: {
    fontSize: 20,
    fontFamily: "lexandDecaExtraLight",
    color: "white",
    marginBottom: 8,
  },
  flatListContainer: {
    flex: 1,
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
