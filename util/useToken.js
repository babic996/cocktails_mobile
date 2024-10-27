import * as SecureStore from "expo-secure-store";
import { Buffer } from "buffer";

export const getToken = async () => {
  const keyToRetrieve = "cocktailapp-token";
  try {
    const token = await SecureStore.getItemAsync(keyToRetrieve);
    if (token) {
      return token;
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Greška prilikom dohvatanja tokena: ${error}`);
    throw error;
  }
};

export const removeToken = async () => {
  const keyToRemove = "cocktailapp-token";
  try {
    await SecureStore.deleteItemAsync(keyToRemove);
  } catch (exception) {
    console.log(exception);
  }
};

export const emailFromToken = async () => {
  try {
    const token = await SecureStore.getItemAsync("cocktailapp-token");
    if (token) {
      const parts = token
        ?.split(".")
        ?.map((part) =>
          Buffer.from(
            part.replace(/-/g, "+").replace(/_/g, "/"),
            "base64"
          ).toString()
        );
      const payload = JSON.parse(parts[1]);
      return payload.email;
    } else {
      console.log("Token not found");
    }
  } catch (error) {
    console.error("Failed to decode the token", error);
  }
};

export const userIdFromToken = async () => {
  try {
    const token = await SecureStore.getItemAsync("cocktailapp-token");
    if (token) {
      const parts = token
        ?.split(".")
        ?.map((part) =>
          Buffer.from(
            part.replace(/-/g, "+").replace(/_/g, "/"),
            "base64"
          ).toString()
        );
      const payload = JSON.parse(parts[1]);
      return payload.userId;
    } else {
      console.log("Token not found");
    }
  } catch (error) {
    console.error("Failed to decode the token", error);
  }
};
