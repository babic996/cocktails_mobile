import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { CheckBox, Button } from "@rneui/themed";
import SearchComponent from "../SearchBar/SearchComponent";
import React, { useContext, useEffect, useState } from "react";
import Icon from "react-native-vector-icons/AntDesign";
import { getIngredients } from "../../services/ingredientsService";
import useUpdateEffect from "../../util/useUpdateEffect";
import Toast from "react-native-root-toast";
import {
  getAlcoholicCategory,
  getDrinkCategory,
} from "../../services/cocktailService";
import { DEFAULT_FILTER_PAGE_SIZE } from "../../util/const";
import { CocktailAppContext } from "../../context/cocktailAppContext";

const FilterComponent = ({ toggleModal, heightModal }) => {
  const [cursor, setCursor] = useState(0);
  const [cursorAlcoholic, setCursorAlcoholic] = useState(0);
  const [cursorDrink, setCursorDrink] = useState(0);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [alcoholicCategory, setAlcoholicCategory] = useState([]);
  const [drinkCategory, setDrinkCategory] = useState([]);
  const { userIngredientsData, filterCocktails, setFilterCocktails } =
    useContext(CocktailAppContext);
  const filterTypes = [
    { id: 1, name: "Ingredients" },
    { id: 2, name: "Drink categories" },
    { id: 2, name: "Alcoholic categories" },
  ];
  const [index, setIndex] = useState(0);

  // --------------------- LIFECYCLE ---------------------
  useEffect(() => {
    getIngredients(cursor, search, DEFAULT_FILTER_PAGE_SIZE).then((result) => {
      setData(result?.content);
    });
  }, [cursor, search]);

  useUpdateEffect(() => {
    setCursor(0);
  }, [search]);

  useEffect(() => {
    getAlcoholicCategory(cursorAlcoholic).then((res) =>
      setAlcoholicCategory(res?.content)
    );
  }, [cursorAlcoholic]);

  useEffect(() => {
    getDrinkCategory(cursorDrink).then((res) => setDrinkCategory(res?.content));
  }, [cursorDrink]);

  // --------------------- METHODS ---------------------
  const nextPage = () => {
    if (data?.length == 9) {
      setCursor((prev) => prev + 1);
    }
  };

  const previousPage = () => {
    setCursor((prev) => (prev == 0 ? 0 : prev - 1));
  };

  const nextPageAlcoholic = () => {
    if (alcoholicCategory?.length == 9) {
      setCursorAlcoholic((prev) => prev + 1);
    }
  };

  const previousPageAlcoholic = () => {
    setCursorAlcoholic((prev) => (prev == 0 ? 0 : prev - 1));
  };

  const nextPageDrink = () => {
    if (drinkCategory?.length == 9) {
      setCursorDrink((prev) => prev + 1);
    }
  };

  const previousPageDrink = () => {
    setCursorDrink((prev) => (prev == 0 ? 0 : prev - 1));
  };

  const toggleCheckBox = (itemId) => {
    const exist = userIngredientsData?.some(
      (item) => item.ingredientId == itemId
    );
    if (exist) {
      Toast.show(
        "You cannot remove ingredients from the filter that are in your bar.",
        {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
          backgroundColor: "red",
          textColor: "white",
          shadow: true,
          animation: true,
          hideOnPress: true,
        }
      );
    } else {
      const item = filterCocktails?.ingredientIds?.find((x) => x == itemId);
      if (!item) {
        setFilterCocktails((prevState) => ({
          ...prevState,
          ingredientIds: [...(prevState?.ingredientIds || []), itemId],
        }));
      } else {
        setFilterCocktails((prevState) => ({
          ...prevState,
          ingredientIds: (prevState?.ingredientIds || []).filter(
            (x) => x !== itemId
          ),
        }));
      }
    }
  };

  // --------------------- RENDER ---------------------
  const RenderFilterItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => toggleCheckBox(item?.ingredientId)}
      style={{
        width: "33%",
        height: 80,
        alignItems: "center",
      }}
    >
      <View style={{ alignItems: "center" }}>
        <CheckBox
          size={16}
          checked={filterCocktails?.ingredientIds?.some(
            (x) => x == item?.ingredientId
          )}
          containerStyle={{
            marginBottom: -8,
            backgroundColor: "#151515",
          }}
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          uncheckedColor="#BA0064"
          checkedColor="#BA0064"
          pointerEvents="none"
        />
        <Text style={styles.filterItemTitle} numberOfLines={2}>
          {item.ingredientName}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const RenderDrinkCategoryFilterItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setFilterCocktails((prevState) => ({
          ...prevState,
          drinkCategoryId:
            filterCocktails?.drinkCategoryId == item?.drinkCategoryId
              ? 0
              : item?.drinkCategoryId,
        }));
      }}
      style={{
        width: "33%",
        height: 80,
        alignItems: "center",
      }}
    >
      <View style={styles.checkboxContainer}>
        <CheckBox
          size={16}
          checked={filterCocktails?.drinkCategoryId == item?.drinkCategoryId}
          containerStyle={{
            marginBottom: -10,
            backgroundColor: "#151515",
          }}
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          uncheckedColor="#BA0064"
          checkedColor="#BA0064"
        />
      </View>
      <Text style={styles.filterItemTitle} numberOfLines={2}>
        {item.drinkCategoryName}
      </Text>
    </TouchableOpacity>
  );

  const RenderAlcoholicCategoryFilterItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setFilterCocktails((prevState) => ({
          ...prevState,
          alcoholicCategoryId:
            filterCocktails?.alcoholicCategoryId == item?.alcoholicCategoryId
              ? 0
              : item?.alcoholicCategoryId,
        }));
      }}
      style={{
        width: "33%",
        height: 80,
        alignItems: "center",
      }}
    >
      <View style={styles.checkboxContainer}>
        <CheckBox
          size={16}
          checked={
            filterCocktails?.alcoholicCategoryId == item?.alcoholicCategoryId
          }
          containerStyle={{
            marginBottom: -10,
            backgroundColor: "#151515",
          }}
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          uncheckedColor="#BA0064"
          checkedColor="#BA0064"
        />
      </View>
      <Text style={styles.filterItemTitle} numberOfLines={2}>
        {item.alcoholicCategoryName}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.modalContent, heightModal]}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalHeaderText}>Filters</Text>
        <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
          <Icon name="close" size={16} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchFilterContainer}>
        <SearchComponent
          placeholderText="Search..."
          disabled={index != 0 && true}
          setInputText={setSearch}
          inputText={search}
          backgroundColor={{ backgroundColor: "#0A0A0A" }}
          textColor={{ color: "white" }}
          placeHolderTextColor="white"
          searchIcon={{ color: "#00E8B1" }}
          clearIcon={{ color: "white" }}
          isRound={true}
          shadowColor={{
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.23,
            shadowRadius: 2.62,
            elevation: 4,
          }}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 12,
        }}
      >
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={() => {
            setIndex((prev) => (prev == 0 ? 2 : prev - 1));
            setSearch("");
          }}
        >
          <Icon name="left" size={16} color="white" />
        </TouchableOpacity>
        <Text style={styles.filterTypeTitle}>{filterTypes[index].name}</Text>
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={() => {
            setIndex((prev) => (prev == 2 ? 0 : prev + 1));
            setSearch("");
          }}
        >
          <Icon name="right" size={16} color="white" />
        </TouchableOpacity>
      </View>
      {index == 0 && (
        <>
          <View style={styles.filterTypeContainer}>
            {data?.map((x) => (
              <RenderFilterItem item={x} key={x.ingredientId} />
            ))}
          </View>
          <View style={styles.paginationContainer}>
            <TouchableOpacity style={styles.arrowButton} onPress={previousPage}>
              <Icon name="up" size={16} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.arrowButton} onPress={nextPage}>
              <Icon name="down" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </>
      )}
      {index == 1 && (
        <>
          <View style={styles.filterTypeContainer}>
            {drinkCategory?.map((x) => (
              <RenderDrinkCategoryFilterItem item={x} key={x.drinkCategoryId} />
            ))}
          </View>
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              style={styles.arrowButton}
              onPress={previousPageDrink}
            >
              <Icon name="up" size={16} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.arrowButton}
              onPress={nextPageDrink}
            >
              <Icon name="down" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </>
      )}
      {index == 2 && (
        <>
          <View style={styles.filterTypeContainer}>
            {alcoholicCategory?.map((x) => (
              <RenderAlcoholicCategoryFilterItem
                item={x}
                key={x.alcoholicCategoryId}
              />
            ))}
          </View>
          {/* odkomentarisati ako bude vise alkoholnih kategorija */}
          {/* <View style={styles.paginationContainer}>
            <TouchableOpacity
              style={styles.arrowButton}
              onPress={previousPageAlcoholic}
            >
              <Icon name="up" size={16} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.arrowButton}
              onPress={nextPageAlcoholic}
            >
              <Icon name="down" size={16} color="white" />
            </TouchableOpacity>
          </View> */}
        </>
      )}
      <View style={styles.resetButtonContainer}>
        <Button
          title="Reset"
          type="clear"
          titleStyle={{
            color: "#00E8B1",
            fontFamily: "lexandDecaLight",
          }}
          onPress={() => {
            setFilterCocktails((prevState) => ({
              ...prevState,
              ingredientIds: userIngredientsData?.map((x) => x.ingredientId),
              alcoholicCategoryId: null,
              drinkCategoryId: null,
            }));
          }}
        />
      </View>
    </View>
  );
};

export default FilterComponent;

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: 16,
    marginLeft: 10,
    marginRight: 10,
    height: 470,
    backgroundColor: "#151515",
  },
  modalHeader: {
    backgroundColor: "#151515",
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: "center",
    position: "relative",
  },
  modalHeaderText: {
    fontSize: 18,
    fontFamily: "lexandDecaExtraLight",
    color: "white",
    textAlign: "center",
  },
  searchFilterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginLeft: 16,
    marginRight: 16,
    backgroundColor: "transparent",
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
  },
  checkboxContainer: {
    alignSelf: "center",
  },
  filterItemTitle: {
    fontFamily: "lexandDecaExtraLight",
    fontSize: 13,
    color: "#FFFFFF",
    textAlign: "center",
    width: 100,
  },
  resetButtonContainer: {
    width: 100,
    alignSelf: "center",
    marginTop: 12,
  },
  closeButton: {
    position: "absolute",
    right: 12,
    top: 12,
    backgroundColor: "#0A0A0A",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 15,
    marginRight: 10,
    shadowColor: "#FFF",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  arrowButton: {
    backgroundColor: "#0A0A0A",
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 15,
    marginRight: 10,
    shadowColor: "#FFF",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  filterTypeContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginHorizontal: 10,
    marginTop: 8,
  },
  filterTypeTitle: {
    textAlign: "center",
    color: "#fff",
    fontFamily: "lexandDecaExtraLight",
    fontSize: 16,
    marginLeft: 16,
    marginRight: 14,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
