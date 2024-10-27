import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import Ingredients from "../../screens/Ingredients";
import Home from "../../screens/Home";
import Favourites from "../../screens/Favourites";
import Profile from "../../screens/Profile";
import Icon from "react-native-vector-icons/FontAwesome";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome5";
import FontistoIcon from "react-native-vector-icons/Fontisto";

const Tab = createBottomTabNavigator();

const BottomNavigation = () => {
  // --------------------- RENDER ---------------------
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#00E8B1",
        tabBarInactiveTintColor: "#FAFAFA",
        tabBarStyle: {
          backgroundColor: "#1F1F1F",
          borderTopWidth: 0,
          paddingTop: 6,
          paddingBottom: 30,
          height: 80,
        },
        tabBarLabelStyle: {
          fontFamily: "lexandDecaExtraLight",
          fontSize: 12,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Cocktails"
        component={Home}
        options={{
          tabBarLabel: "Cocktails",
          tabBarIcon: ({ color, size }) => (
            <FontistoIcon name="cocktail" color={color} size={18} />
          ),
        }}
      />
      <Tab.Screen
        name="Ingredients"
        component={Ingredients}
        options={({ route }) => ({
          tabBarLabel: "My Bar",
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon name="wine-bottle" color={color} size={18} />
          ),
        })}
      />
      <Tab.Screen
        name="Favourites"
        component={Favourites}
        options={{
          tabBarLabel: "Favourites",
          tabBarIcon: ({ color, size }) => (
            <Icon name="star" color={color} size={18} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon name="user-alt" color={color} size={18} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigation;

const styles = StyleSheet.create({});
