import { useRequest } from "../util/useAxios";

export const getIngredients = async (cursor, search, pageSize) => {
  const request = await useRequest();
  var filterString = "";
  search?.inputText ? (filterString += `&searchText=${search?.inputText}`) : "";

  const result = await request({
    url: `/mobile/ingredient/find-all?pageNumber=${cursor}&pageSize=${pageSize}${filterString}`,
    method: "get",
  });

  return result?.data;
};

export const addOrRemoveMyBar = async (id) => {
  const request = await useRequest();

  const result = await request({
    url: `mobile/my-bar/save-or-delete?ingredientId=${id}`,
    method: "get",
  });

  return result?.data;
};

export const getMyBar = async () => {
  const request = await useRequest();

  const result = await request({
    url: `mobile/my-bar/find-all`,
    method: "get",
  });

  return result?.data;
};
