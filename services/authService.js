import { useRequest } from "../util/useAxios";

export const login = async (data) => {
  const request = await useRequest();
  return request({
    url: "user/register",
    method: "post",
    data: data,
    headers: null,
  });
};

export const verifyCode = async (data) => {
  const request = await useRequest();

  return request({
    url: "user/verify-code",
    method: "post",
    data: data,
    headers: null,
  });
};

export const deactivateAccount = async (data) => {
  const request = await useRequest();

  return request({ url: "mobile/user/deactivate", method: "post", data: data });
};
