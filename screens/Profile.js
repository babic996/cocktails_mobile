import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Ionicon from "react-native-vector-icons/Ionicons";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import { Dialog } from "@rneui/themed";
import React, { useContext, useEffect, useState } from "react";
import { width, height } from "../util/const";
import { removeToken } from "../util/useToken";
import { emailFromToken, userIdFromToken } from "../util/useToken";
import Toast from "react-native-root-toast";
import { deactivateAccount } from "../services/authService";
import { CocktailAppContext } from "../context/cocktailAppContext";

const Profile = ({ navigation }) => {
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
  const [deactivateDialogVisible, setDeactivateDialogVisible] = useState(false);
  const [email, setEmail] = useState();
  const [userId, setUserId] = useState();
  const { setFilterCocktails, userIngredientsData } =
    useContext(CocktailAppContext);

  // --------------------- LIFECYCLE ---------------------

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

    return () => {
      focusListener();
    };
  }, [navigation]);

  // --------------------- METHODS ---------------------

  const toggleLogoutDialog = () => {
    setLogoutDialogVisible(!logoutDialogVisible);
  };

  const toggleDeactivateDialog = () => {
    setDeactivateDialogVisible(!deactivateDialogVisible);
  };

  const logout = async () => {
    try {
      await removeToken();
      toggleLogoutDialog();
      navigation.navigate("Login");
    } catch (error) {
      Toast.show(error.message, {
        duration: Toast.durations.LONG,
        position: Toast.positions.TOP,
        backgroundColor: "red",
        textColor: "white",
        shadow: true,
        animation: true,
        hideOnPress: true,
        containerStyle: { marginTop: 25 },
      });
    }
  };

  const deactivate = async () => {
    try {
      await Promise.all([deactivateAccount({ userId: userId }), removeToken()]);
      toggleDeactivateDialog();
      navigation.navigate("Login");
    } catch (error) {
      Toast.show(error.message, {
        duration: Toast.durations.LONG,
        position: Toast.positions.TOP,
        backgroundColor: "red",
        textColor: "white",
        shadow: true,
        animation: true,
        hideOnPress: true,
        containerStyle: { marginTop: 25 },
      });
    }
  };

  // --------------------- LIFECYCLE ---------------------

  useEffect(() => {
    const fetchEmailAndUserIdFromToken = async () => {
      try {
        const [emailToken, userIdToken] = await Promise.all([
          emailFromToken(),
          userIdFromToken(),
        ]);
        setEmail(emailToken);
        setUserId(userIdToken);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchEmailAndUserIdFromToken();
  }, []);

  // --------------------- RENDER ---------------------
  return (
    <ImageBackground
      source={require("../assets/img/Background-var3.png")}
      style={styles.container}
    >
      <Dialog
        isVisible={logoutDialogVisible}
        onBackdropPress={toggleLogoutDialog}
        overlayStyle={{ backgroundColor: "#1F1F1F", borderRadius: 10 }}
      >
        <Dialog.Title title="Logout" titleStyle={styles.dialogTitle} />
        <Text style={styles.dialogText}>Are you sure you want to logout?</Text>
        <Dialog.Actions>
          <Dialog.Button
            title="No"
            onPress={toggleLogoutDialog}
            titleStyle={{ color: "#00E8B1" }}
          />
          <Dialog.Button
            title="Yes"
            onPress={logout}
            titleStyle={{ color: "#00E8B1" }}
          />
        </Dialog.Actions>
      </Dialog>
      <Dialog
        isVisible={deactivateDialogVisible}
        onBackdropPress={toggleDeactivateDialog}
        overlayStyle={{ backgroundColor: "#1F1F1F", borderRadius: 10 }}
      >
        <Dialog.Title
          title="Account deactivation"
          titleStyle={styles.dialogTitle}
        />
        <Text style={styles.dialogText}>
          Are you sure you want to deactivate the account?
        </Text>
        <Dialog.Actions>
          <Dialog.Button
            title="No"
            onPress={toggleDeactivateDialog}
            titleStyle={{ color: "#00E8B1" }}
          />
          <Dialog.Button
            title="Yes"
            onPress={deactivate}
            titleStyle={{ color: "#00E8B1" }}
          />
        </Dialog.Actions>
      </Dialog>
      <View style={styles.mainContainer}>
        <Icon name="user" size={40} color="#FAFAFA" />
        {email && <Text style={styles.imageText}>{email}</Text>}
      </View>
      <View style={{ marginLeft: 48, marginRight: 48 }}>
        <View style={styles.itemContainer}>
          <View style={styles.leftContainer}>
            <View style={{ marginLeft: 19 }}>
              <Ionicon
                name="information-circle-outline"
                size={20}
                color="#BA0064"
              />
            </View>
            <Text style={styles.text}>About Us</Text>
          </View>
        </View>
        <View style={styles.itemContainer}>
          <View style={styles.leftContainer}>
            <View style={{ marginLeft: 19 }}>
              <Icon name="book" size={20} color="#BA0064" />
            </View>
            <Text style={styles.text}>Terms & Conditions</Text>
          </View>
        </View>
        <View style={styles.itemContainer}>
          <View style={styles.leftContainer}>
            <View style={{ marginLeft: 19 }}>
              <Ionicon name="help-circle-outline" size={20} color="#BA0064" />
            </View>
            <Text style={styles.text}>Help</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={toggleDeactivateDialog}
          style={styles.itemContainer}
        >
          <View style={styles.leftContainer}>
            <View style={{ marginLeft: 19 }}>
              <AntDesignIcon name="deleteuser" size={15} color="#BA0064" />
            </View>
            <Text style={styles.text}>Deactivate Account</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={toggleLogoutDialog}
          style={styles.itemContainer}
        >
          <View style={styles.leftContainer}>
            <View style={{ marginLeft: 19 }}>
              <AntDesignIcon name="logout" size={15} color="#BA0064" />
            </View>
            <Text style={styles.text}>Logout</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: "cover",
  },
  imageText: {
    marginTop: 24,
    fontSize: 14,
    fontFamily: "lexandDecaLight",
    color: "#FAFAFA",
  },
  dialogText: {
    fontSize: 12,
    color: "#FAFAFA",
  },
  closeIcon: {
    position: "absolute",
    right: 10,
    top: 15,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: 46,
    backgroundColor: "#151515",
    borderRadius: 15,
    marginBottom: 16,
    shadowColor: "#FFF",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  text: {
    marginLeft: 10,
    color: "white",
    fontSize: 16,
    fontFamily: "lexandDecaExtraLight",
    textAlign: "center",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  mainContainer: {
    width: (width * 2) / 3,
    alignSelf: "center",
    alignItems: "center",
    marginTop: height / 6,
    marginBottom: height / 12,
  },
  dialogTitle: {
    color: "#FAFAFA",
    textAlign: "center",
  },
});
