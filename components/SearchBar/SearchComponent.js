import { StyleSheet } from "react-native";
import { SearchBar } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import { debounce } from "lodash";
const SearchComponent = ({
  placeholderText,
  placeHolderTextColor,
  textColor,
  inputText,
  setInputText,
  searchIcon,
  clearIcon,
  isRound,
  backgroundColor,
  shadowColor,
  disabled,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");

  // --------------------- METHODS ---------------------

  const debouncedSetState = debounce((value) => setDebouncedValue(value), 200);

  // --------------------- LIFECYCLE ---------------------

  useEffect(() => {
    debouncedSetState(inputValue);
  }, [inputValue]);

  useEffect(() => {
    setInputText((prevState) => ({
      ...prevState,
      inputText: debouncedValue,
    }));
  }, [debouncedValue]);

  // --------------------- RENDER ---------------------
  return (
    <SearchBar
      placeholder={placeholderText}
      disabled={disabled}
      onChangeText={(value) => setInputValue(value)}
      value={inputValue}
      containerStyle={[styles.flexibleSearchContainer, shadowColor]}
      inputContainerStyle={[styles.inputFilterContainerStyle, backgroundColor]}
      inputStyle={[styles.inputFilterStyle, textColor]}
      placeholderTextColor={placeHolderTextColor}
      searchIcon={searchIcon}
      clearIcon={inputValue?.length > 0 && clearIcon}
      round={isRound}
    />
  );
};

export default SearchComponent;

const styles = StyleSheet.create({
  flexibleSearchContainer: {
    flex: 1,
    backgroundColor: "transparent",
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
    padding: 0,
    borderRadius: 15,
    shadowColor: "#AAA",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
  inputFilterContainerStyle: {},
  inputFilterStyle: {
    fontFamily: "lexandDecaExtraLight",
  },
});
