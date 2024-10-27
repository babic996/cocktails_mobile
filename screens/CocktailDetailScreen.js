import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Linking,
  ImageBackground,
} from "react-native";
import { CheckBox } from "@rneui/themed";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  height,
  ingredientsTitleTranslations,
  instructionTitleTranslations,
  noTranslations,
  width,
} from "../util/const";
import { useRoute } from "@react-navigation/native";
import {
  addOrRemoveFavouriteCocktails,
  getCocktail,
  getLanguage,
} from "../services/cocktailService";
import PageLoading from "../components/PageLoading/PageLoading";
import { CocktailAppContext } from "../context/cocktailAppContext";
import IconAntd from "react-native-vector-icons/AntDesign";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import {
  InterstitialAd,
  AdEventType,
  TestIds,
  RewardedAd,
  RewardedAdEventType,
} from "react-native-google-mobile-ads";

const interstitialAdUnitId = TestIds.INTERSTITIAL;
const interstitial = InterstitialAd.createForAdRequest(interstitialAdUnitId, {
  requestNonPersonalizedAdsOnly: true,
});
const rewardAdUnitId = TestIds.REWARDED;
const rewarded = RewardedAd.createForAdRequest(rewardAdUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

const CocktailDetailScreen = ({ navigation }) => {
  const [index, setIndex] = useState(0);
  const [indexLanguage, setIndexLanguage] = useState(0);
  const [drink, setDrink] = useState();
  const [languages, setLanguages] = useState([]);
  const [language, setLanguage] = useState();
  const { toggleCheckBox, filterCocktails } = useContext(CocktailAppContext);
  const [interstitialAdLoaded, setInterstitialAdLoaded] = useState(false);
  const [rewardAdLoaded, setRewardAdLoaded] = useState(false);

  const route = useRoute();
  const { drinkId, favourite } = route.params;
  const [checked, setChecked] = useState();

  // --------------------- LIFECYCLE ---------------------
  useEffect(() => {
    getCocktail(drinkId).then((res) => setDrink(res));
    getLanguage().then((res) => {
      //ovo sam stavio jer nemamo uputstava na Franuskom i Spanskom. kada ih bude bilo vise odkomentarisati ovaj dio koda
      setLanguages(
        res?.filter((x) => x.languageCode != "FRA" && x.languageCode != "SPA")
      );
      setLanguage(res[0]);
    });
    setChecked(favourite);
  }, [drinkId, favourite]);

  const handleTabPress = (tabIndex) => {
    const selectedLanguage = languages[tabIndex];
    setLanguage(selectedLanguage);
    setIndexLanguage(tabIndex);
  };

  useEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitleAlign: "center",
      headerTitle: () => (
        <View style={{ marginHorizontal: 25 }}>
          <Text
            style={{
              fontSize: 20,
              textAlign: "center",
              fontFamily: "robotoSerifLight",
              color: "#FFFFFF",
            }}
            numberOfLines={2}
          >
            {drink?.drinkName.length >= 25
              ? `${drink?.drinkName.substring(0, 25)}...`
              : drink?.drinkName}
          </Text>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <IconAntd name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={styles.rightHeaderContainer}>
          <TouchableOpacity style={styles.favoriteButton}>
            <CheckBox
              checked={checked}
              checkedIcon="star"
              uncheckedIcon="star-o"
              checkedColor="#BA0064"
              uncheckedColor="#BA0064"
              containerStyle={{
                backgroundColor: "#151515",
                padding: 0,
                margin: 0,
              }}
              size={24}
              onPress={() => {
                setChecked((prev) => !prev);
                toggleCheckBox(drinkId);
                addOrRemoveFavouriteCocktails(drinkId)
                  .then()
                  .catch((e) => {
                    setChecked((prev) => !prev);
                    toggleCheckBox(drinkId);
                  });
              }}
            />
          </TouchableOpacity>
          {drink?.videoLinks.length > 0 && (
            <TouchableOpacity
              style={styles.videoButton}
              onPress={() => openYouTubePage(drink?.videoLinks[0].videoLink)}
            >
              <Icon name="youtube-play" size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>
      ),
    });
  }, [drink, checked]);

  useEffect(() => {
    const handleInterstitialLoaded = () => {
      setInterstitialAdLoaded(true);
    };
    const handleRewardedLoaded = () => {
      setRewardAdLoaded(true);
    };
    const handleEarnedReward = (reward) => {
      //ovdje mozemo dodati dio gdje mozemo usera nagraditi za nesto(za buduce verzije aplikacije)
      console.log("User earned reward of ", reward);
    };
    const unsubscribeInterstitial = interstitial.addAdEventListener(
      AdEventType.LOADED,
      handleInterstitialLoaded
    );
    const unsubscribeRewardedLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      handleRewardedLoaded
    );
    const unsubscribeEarnedReward = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      handleEarnedReward
    );
    interstitial.load();
    rewarded.load();
    return () => {
      unsubscribeInterstitial();
      unsubscribeRewardedLoaded();
      unsubscribeEarnedReward();
    };
  }, []);

  // --------------------- METHODS ---------------------

  const openYouTubePage = (link) => {
    Linking.openURL(link).catch((err) =>
      console.error("Could not open URL", err)
    );
  };

  const instructionTitle = (languageCode) => {
    const text = instructionTitleTranslations[languageCode];
    return text;
  };

  const ingredientTitle = (languageCode) => {
    const text = ingredientsTitleTranslations[languageCode];
    const numberOfFilterIngredients =
      filterCocktails?.ingredientIds?.length > 0
        ? "(" +
          drink?.ingredients
            ?.filter((ingredient) =>
              filterCocktails?.ingredientIds?.includes(
                ingredient.ingredient.ingredientId
              )
            )
            ?.length.toString() +
          "/" +
          drink?.ingredients?.length.toString() +
          ")"
        : "(0/" + drink?.ingredients?.length.toString() + ")";
    return (
      <Text>
        {text} {numberOfFilterIngredients}
      </Text>
    );
  };

  const handleSortIngredient = () => {
    if (filterCocktails?.ingredientIds?.length > 0) {
      let includedIngredients = drink?.ingredients?.filter((ingredient) =>
        filterCocktails?.ingredientIds.includes(
          ingredient.ingredient.ingredientId
        )
      );
      let excludedIngredients = drink?.ingredients?.filter(
        (ingredient) =>
          !filterCocktails?.ingredientIds.includes(
            ingredient.ingredient.ingredientId
          )
      );

      let sortedIngredients = [...includedIngredients, ...excludedIngredients];
      return sortedIngredients;
    } else {
      return drink?.ingredients;
    }
  };

  // --------------------- RENDER ---------------------
  const SplitSentence = ({ text }) => {
    const sentences = text?.split(". ");

    if (sentences?.length > 0) {
      return (
        <Text style={styles.instrucionText}>
          {sentences?.map((sentence, index) => (
            <React.Fragment key={index}>
              {index >= 0 && <Text>&bull;&nbsp;</Text>}
              {sentence}
              {"\n"}
            </React.Fragment>
          ))}
        </Text>
      );
    } else {
      return (
        <Text style={styles.instrucionText}>
          {noTranslations[language?.languageCode] || noTranslations.default}
        </Text>
      );
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.ingredientItem}>
      <View style={styles.ingredientInfo}>
        {filterCocktails?.ingredientIds?.some(
          (x) => x == item.ingredient.ingredientId
        ) ? (
          <View
            style={{
              backgroundColor: "#BA0064",
              width: 10,
              height: 10,
              borderRadius: 5,
              marginRight: 10,
            }}
          />
        ) : (
          <View
            style={{
              backgroundColor: "transparent",
              width: 10,
              height: 10,
              borderRadius: 5,
              borderColor: "#BA0064",
              borderWidth: 1,
              marginRight: 10,
            }}
          />
        )}
        <Text style={styles.ingredientName}>
          {item?.ingredient.ingredientName}
        </Text>
        <Text style={styles.ingredientQuantity}>{item?.measure}</Text>
      </View>
    </View>
  );

  if (!drink) {
    return <PageLoading />;
  }
  if (interstitialAdLoaded) {
    interstitial.show();
    setInterstitialAdLoaded(false);
  }
  return (
    <ImageBackground
      style={styles.container}
      source={require("../assets/img/Background-var3.png")}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: drink?.imageLinks[0].imageLink,
          }}
          style={styles.cocktailImage}
        />
      </View>
      <View style={styles.languageTabContainer}>
        {languages?.map((language, index) => (
          <TouchableOpacity
            key={language?.languageId}
            style={styles.tab}
            onPress={() => handleTabPress(index)}
            activeOpacity={0.5}
          >
            <View style={styles.tabContent}>
              <Text style={styles.languageTabTitle}>
                {language?.languageCode}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
        <View style={styles.indicatorContainer}>
          <View
            style={[styles.indicator, { left: `${indexLanguage * 33.3333}%` }]}
          />
        </View>
      </View>
      {(indexLanguage == 0 || indexLanguage == 1 || indexLanguage == 2) &&
        drink && (
          <>
            {index == 0 ? (
              <View style={styles.instructionContainer}>
                <Text style={styles.instructionTitle}>
                  {instructionTitle(language?.languageCode)}
                </Text>
                <ScrollView>
                  <Text>
                    <SplitSentence
                      text={
                        drink?.instructions.find(
                          (x) => x?.language.languageId == language?.languageId
                        )?.instructionText
                      }
                    />
                  </Text>
                </ScrollView>
              </View>
            ) : (
              <View
                style={[
                  styles.ingredientContentContainer,
                  { height: height / 2.8 },
                ]}
              >
                <Text style={styles.flatListTitle}>
                  {ingredientTitle(language?.languageCode)}
                </Text>
                <FlatList
                  data={handleSortIngredient()}
                  keyExtractor={(item) => item?.ingredient?.ingredientId}
                  renderItem={renderItem}
                  contentContainerStyle={[styles.flatListContainer]}
                />
              </View>
            )}
          </>
        )}
      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={() => setIndex(0)}>
          <View style={styles.iconContainer}>
            <IconMaterial
              name="clipboard-text-outline"
              size={22}
              color={index == 0 ? "#00E8B1" : "#FAFAFA"}
            />
            <Text
              style={[
                styles.iconLabel,
                index == 0 ? { color: "#00E8B1" } : { color: "#FAFAFA" },
              ]}
            >
              Instructions
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setIndex(1);
            if (rewardAdLoaded) {
              rewarded.show();
              setRewardAdLoaded(false);
            }
          }}
        >
          <View style={styles.iconContainer}>
            <Icon
              name="flask"
              size={22}
              color={index == 1 ? "#00E8B1" : "#FAFAFA"}
            />
            <Text
              style={[
                styles.iconLabel,
                index == 1 ? { color: "#00E8B1" } : { color: "#FAFAFA" },
              ]}
            >
              Ingredients
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const imageMarginTop = height / 6.5;

const marginHorizontalContainer = width / 12;

const styles = StyleSheet.create({
  backButton: {
    backgroundColor: "#151515",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 26,
  },
  rightHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 26,
  },
  favoriteButton: {
    backgroundColor: "#151515",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  videoButton: {
    backgroundColor: "#151515",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 5,
  },
  container: {
    flex: 1,
    resizeMode: "cover",
  },
  imageContainer: {
    marginTop: imageMarginTop,
    marginLeft: 110,
    marginRight: 110,
    marginBottom: 30,
  },
  cocktailImage: {
    width: "100%",
    aspectRatio: 0.75,
    borderRadius: 10,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  ingredientInfo: {
    flexDirection: "row",
    alignItems: "center",
    margin: 0,
  },
  ingredientName: {
    flex: 1,
    fontSize: 16,
    color: "#FAFAFA",
    padding: 5,
    fontFamily: "lexandDecaExtraLight",
  },
  ingredientQuantity: {
    fontSize: 16,
    color: "#FAFAFA",
    fontFamily: "lexandDecaExtraLight",
  },
  instructionContainer: {
    backgroundColor: "transparent",
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
    maxHeight: height / 2.8,
    width: width,
  },
  instructionTitle: {
    fontSize: 20,
    textAlign: "center",
    color: "#FAFAFA",
    fontFamily: "lexandDecaExtraLight",
    marginBottom: 16,
  },
  ingredientContentContainer: {
    backgroundColor: "transparent",
    width: "100%",
  },
  languageTabTitle: {
    fontSize: 10,
    fontFamily: "lexandDecaLight",
    color: "white",
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 80,
    backgroundColor: "#151515",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 30,
    paddingTop: 6,
  },
  iconContainer: {
    alignItems: "center",
  },
  iconLabel: {
    color: "#FAFAFA",
    fontSize: 12,
    fontFamily: "lexandDecaExtraLight",
  },
  instrucionText: {
    color: "#FAFAFA",
    fontFamily: "lexandDecaExtraLight",
    fontSize: 16,
  },
  flatListTitle: {
    textAlign: "center",
    fontSize: 20,
    fontFamily: "lexandDecaExtraLight",
    color: "white",
    marginTop: 24,
    marginBottom: 16,
  },
  flatListContainer: {
    marginLeft: marginHorizontalContainer,
    marginRight: marginHorizontalContainer,
  },
  languageTabContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "#151515",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden",
    height: 36,
    marginHorizontal: 14,
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  indicatorContainer: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    width: "100%",
    height: 2,
  },
  indicator: {
    position: "absolute",
    bottom: 0,
    height: "100%",
    width: "33.3333%",
    backgroundColor: "#BA0064",
  },
  tabContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
});

export default CocktailDetailScreen;
