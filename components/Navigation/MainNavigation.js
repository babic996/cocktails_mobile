import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../../screens/Login";
import CocktailDetailScreen from "../../screens/CocktailDetailScreen";
import BottomNavigation from "./BottomNavigation";
import VerifyCode from "../../screens/VerifyCode";
import Toast from "react-native-root-toast";
import { getToken } from "../../util/useToken";
import PageLoading from "../PageLoading/PageLoading";

const Stack = createStackNavigator();

const MainNavigation = () => {
  const [hasToken, setHasToken] = useState(false);
  const [tokenFetched, setTokenFetched] = useState(false);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await getToken();
        if (token) {
          setHasToken(true);
        }
      } catch (error) {
        Toast.show(error.message, {
          duration: Toast.durations.LONG,
          position: Toast.positions.TOP,
          backgroundColor: "red",
          textColor: "white",
        });
      } finally {
        setTokenFetched(true);
      }
    };
    fetchToken();
  }, []);
  // --------------------- RENDER ---------------------
  if (!tokenFetched) {
    return <PageLoading />;
  }
  return (
    <Stack.Navigator initialRouteName={hasToken ? "CocktailsApp" : "Login"}>
      <Stack.Screen
        name="VerifyCode"
        component={VerifyCode}
        options={{ title: "Verify Code", headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ title: "Login", headerShown: false }}
      />
      <Stack.Screen
        name="Details"
        component={CocktailDetailScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="CocktailsApp"
        component={BottomNavigation}
        options={{
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigation;

const styles = StyleSheet.create({});
