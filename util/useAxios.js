import axios from "axios";
import { getToken } from "./useToken";
import Toast from "react-native-root-toast";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const req = axios.create({
  baseURL: apiUrl,
});

req.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (!error.response) {
      if (error.message.includes("Network Error") && !error.response) {
        Toast.show("No Internet", {
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
    }
    return Promise.reject(error);
  }
);

export const useRequest = async () => {
  const token = await getToken();
  if (token) {
    req.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
  return req;
};
