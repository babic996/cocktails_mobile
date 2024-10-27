import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  ImageBackground,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import { Input, Button } from "@rneui/themed";
import { login } from "../services/authService";
import Toast from "react-native-root-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginValidationSchema } from "../validation/loginValidationSchema";
import { useForm, Controller } from "react-hook-form";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { height } from "../util/const";

const Login = ({ navigation }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(loginValidationSchema()) });
  const [submitLoading, setSubmitLoading] = useState(false);

  // --------------------- METHODS ---------------------

  const onSubmit = (data) => {
    setSubmitLoading(true);
    Keyboard.dismiss();
    login({ email: data.email })
      .then(() => {
        navigation.navigate("VerifyCode", {
          email: data.email,
        });
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

  // --------------------- RENDER ---------------------

  return (
    <ImageBackground
      source={require("../assets/img/background-var1.png")}
      style={styles.backgroundImage}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <View style={styles.container}>
          <Image
            style={styles.logo}
            source={require("../assets/img/logo.png")}
          />
          <Text style={styles.text}>Sign in</Text>
          <View style={styles.inputContainer}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur } }) => (
                <Input
                  placeholder="Email"
                  placeholderTextColor={"#FAFAFA"}
                  disabled={submitLoading}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  autoCapitalize="none"
                  inputStyle={{ color: "#FAFAFA" }}
                  errorStyle={{ color: "#D84654" }}
                  inputContainerStyle={styles.inputContainerStyle}
                  renderErrorMessage={true}
                  errorMessage={errors?.email?.message}
                  leftIcon={
                    <MaterialIcon name="email" size={20} color="#BA0064" />
                  }
                />
              )}
            />
          </View>
          <View style={styles.buttonContainer}>
            <View style={styles.spacer} />
            <Button
              title="Next"
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
              icon={{
                name: "long-arrow-right",
                type: "font-awesome",
                size: 15,
                color: "black",
              }}
              iconRight
              iconContainerStyle={{ marginLeft: 10 }}
              onPress={handleSubmit(onSubmit)}
              loading={submitLoading}
              loadingProps={{
                size: "small",
                color: "white",
              }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default Login;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    // flex: 1,
    marginTop: height / 5,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 48,
  },
  text: {
    fontSize: 20,
    marginBottom: 24,
    color: "#FAFAFA",
    fontFamily: "lexandDecaLight",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: "80%",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    marginHorizontal: 40,
  },
  inputContainer: {
    width: "100%",
    paddingLeft: 30,
    paddingRight: 30,
    marginBottom: 10,
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
  spacer: {
    flex: 1,
  },
});
