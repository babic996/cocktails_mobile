import React, { createContext, useState } from "react";
import Toast from "react-native-root-toast";

export const CocktailAppContext = createContext();

export const CocktailAppContextProvider = ({ children }) => {
  const [cocktailHomeData, setCocktailHomeData] = useState([]);
  const [favouriteCocktailsData, setFavouriteCocktailsData] = useState([]);
  const [popularCocktails, setPopularCocktails] = useState([]);
  const [userIngredientsData, setUserIngredientsData] = useState([]);
  const [filterCocktails, setFilterCocktails] = useState();

  const toggleCheckBox = (itemId) => {
    let isFavourite;
    const updatedItems = cocktailHomeData?.map((item) => {
      if (item?.filterDrinkProjection.drinkId == itemId) {
        isFavourite = !item.favouriteDrinkDto.favourite;
        return {
          ...item,
          favouriteDrinkDto: {
            ...item.favouriteDrinkDto,
            favourite: isFavourite,
          },
        };
      }
      return item;
    });
    setCocktailHomeData(updatedItems);
    const updatedPopularItems = popularCocktails?.map((item) => {
      if (item?.drinkId == itemId) {
        isFavourite = !item.favourite;
        return {
          ...item,
          favourite: !item.favourite,
        };
      }
      return item;
    });
    setPopularCocktails(updatedPopularItems);
    Toast.show(
      isFavourite
        ? "Cocktail added to favorites"
        : "Cocktail removed from favorites",
      {
        duration: 1000,
        position: Toast.positions.BOTTOM,
        backgroundColor: "#080808",
        textColor: "#FAFAFA",
        animation: true,
        hideOnPress: true,
      }
    );
  };

  return (
    <CocktailAppContext.Provider
      value={{
        cocktailHomeData,
        setCocktailHomeData,
        favouriteCocktailsData,
        setFavouriteCocktailsData,
        userIngredientsData,
        setUserIngredientsData,
        filterCocktails,
        setFilterCocktails,
        popularCocktails,
        setPopularCocktails,
        toggleCheckBox,
      }}
    >
      {children}
    </CocktailAppContext.Provider>
  );
};
