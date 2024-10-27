import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import { Input, Button } from "@rneui/themed";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { useRoute } from "@react-navigation/native";
import { verifyCode } from "../services/authService";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { verifyCodeValidationSchema } from "../validation/verifyCodeValidationSchema";
import { useEffect } from "react";
import Toast from "react-native-root-toast";
import * as SecureStore from "expo-secure-store";
import { height } from "../util/const";

const VerifyCode = ({ navigation }) => {
  const route = useRoute();
  const email = route.params?.email;

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(verifyCodeValidationSchema()) });
  const [submitLoading, setSubmitLoading] = useState(false);

  // --------------------- METHODS ---------------------

  const onSubmit = (data) => {
    setSubmitLoading(true);
    Keyboard.dismiss();
    verifyCode({
      email: data.email,
      verificationCode: data?.verificationCode,
    })
      .then((res) => {
        storeToken(res?.data?.jwt);
        navigation.navigate("CocktailsApp");
        setSubmitLoading(false);
      })
      .catch((error) => {
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
        setSubmitLoading(false);
      });
  };

  const storeToken = async (token) => {
    try {
      await SecureStore.setItemAsync("cocktailapp-token", token);
    } catch (error) {
      console.error("Greška pri spremanju tokena:", error);
    }
  };

  const handleSignInLink = () => {
    navigation.navigate("Login");
  };

  // --------------------- LIFECYCLE ---------------------

  useEffect(() => {
    setValue("email", email);
  }, [email]);

  // --------------------- RENDER ---------------------

  return (
    <ImageBackground
      source={require("../assets/img/background-var1.png")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Image source={require("../assets/img/logo.png")} style={styles.logo} />
        <Text style={styles.text}>Verify Code</Text>
        <View style={styles.inputContainer}>
          <Controller
            control={control}
            name="verificationCode"
            render={({ field: { onChange, onBlur } }) => (
              <KeyboardAvoidingView
                behavior={Platform.OS == "ios" ? "padding" : "height"}
              >
                <Input
                  placeholder="Code"
                  placeholderTextColor={"#FAFAFA"}
                  disabled={submitLoading}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  autoCapitalize="none"
                  inputStyle={{ color: "#FAFAFA" }}
                  errorStyle={{ color: "#D84654" }}
                  inputContainerStyle={styles.inputContainerStyle}
                  renderErrorMessage={true}
                  errorMessage={errors?.verificationCode?.message}
                  leftIcon={
                    <MaterialIcon name="verified" size={20} color="#BA0064" />
                  }
                />
              </KeyboardAvoidingView>
            )}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Back"
            titleStyle={{
              fontSize: 16,
              fontFamily: "lexandDecaLight",
              color: "#FAFAFA",
            }}
            buttonStyle={{
              borderWidth: 0,
              borderColor: "transparent",
              borderRadius: 10,
              backgroundColor: "#151515",
            }}
            icon={{
              name: "long-arrow-left",
              type: "font-awesome",
              size: 15,
              color: "#FAFAFA",
            }}
            onPress={handleSignInLink}
            iconContainerStyle={{ marginRight: 10 }}
          />
          <View style={styles.spacer} />
          <Button
            title="Sign in"
            titleStyle={{
              fontSize: 16,
              fontFamily: "lexandDecaLight",
              color: "#1A1A1A",
            }}
            buttonStyle={{
              borderWidth: 0,
              borderColor: "transparent",
              borderRadius: 10,
              backgroundColor: "#00E8B1",
            }}
            loading={submitLoading}
            loadingProps={{
              size: "small",
              color: "white",
            }}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

export default VerifyCode;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    marginTop: height / 5,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 48,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    color: "#df00df",
    fontWeight: "bold",
  },
  loginContainer: {
    alignItems: "center",
    marginTop: 15,
  },
  loginText: {
    alignItems: "center",
    marginTop: 20,
    color: "#df00df",
    textDecorationLine: "underline",
    fontSize: 16,
    textAlign: "center",
  },
  text: {
    fontSize: 20,
    marginBottom: 24,
    color: "#FAFAFA",
    fontFamily: "lexandDecaLight",
  },
  inputContainerStyle: {
    borderColor: "transparent",
    backgroundColor: "#151515",
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 0,
    shadowColor: "#FAFAFA",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  inputContainer: {
    width: "100%",
    paddingLeft: 30,
    paddingRight: 30,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 40,
  },
  spacer: {
    flex: 1,
  },
});
