import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import * as Font from "expo-font";
import MainNavigation from "./components/Navigation/MainNavigation";
import * as SplashScreen from "expo-splash-screen";
import { Asset } from "expo-asset";
import { useEffect, useState } from "react";
import { CocktailAppContextProvider } from "./context/cocktailAppContext";
// import mobileAds from "react-native-google-mobile-ads";
import { Platform } from "react-native";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";

export default function App() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  // --------------------- METHODS ---------------------

  const checkAppTrackingPermission = async () => {
    if (Platform.OS === "ios") {
      const result = await check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
      if (result === RESULTS.DENIED) {
        // The permission has not been requested, so request it.
        await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
      }
    }
  };

  const initializeMobileAds = async () => {
    // Add the permission check before initializing mobile ads
    await checkAppTrackingPermission();

    // Initialize mobile ads
    // const adapterStatuses = await mobileAds().initialize();
    // // Handle the mobile ads initialization result as needed
    // console.log("Mobile ads initialization result:", adapterStatuses);
  };

  // --------------------- LIFECYCLE ---------------------
  useEffect(() => {
    const loadResourcesAndDataAsync = async () => {
      try {
        SplashScreen.preventAutoHideAsync();

        const images = [
          require("./assets/img/background-var1.png"),
          require("./assets/img/logo.png"),
          require("./assets/img/Background-var3.png"),
        ];
        const cacheImages = images.map((image) => {
          return Asset.fromModule(image).downloadAsync();
        });

        const fonts = {
          lexandDecaExtraLight: require("./assets/fonts/LexendDeca-ExtraLight.ttf"),
          lexandDecaLight: require("./assets/fonts/LexendDeca-Light.ttf"),
          robotoSerifLight: require("./assets/fonts/RobotoSerif-Light.ttf"),
        };
        const cacheFonts = Font.loadAsync(fonts);

        await Promise.all([...cacheImages, cacheFonts]);
      } catch (e) {
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    };

    loadResourcesAndDataAsync();
    initializeMobileAds();
  }, []);

  // --------------------- RENDER ---------------------
  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <NavigationContainer>
          <CocktailAppContextProvider>
            <MainNavigation />
          </CocktailAppContextProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    );
  }
}
