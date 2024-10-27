import { useRequest } from "../util/useAxios";
import { DEFAULT_PAGE_SIZE } from "../util/const";
import { DEFAULT_FILTER_PAGE_SIZE } from "../util/const";

export const getCocktails = async (cursor, filter) => {
  const request = await useRequest();
  var filterString = "";

  filter?.inputText ? (filterString += `&searchText=${filter?.inputText}`) : "";
  filter?.ingredientIds
    ? (filterString += `&ingredientIds=${filter?.ingredientIds}`)
    : "";
  filter?.alcoholicCategoryId
    ? (filterString += `&alcoholicCategoryId=${filter?.alcoholicCategoryId}`)
    : "";
  filter?.drinkCategoryId
    ? (filterString += `&drinkCategoryId=${filter?.drinkCategoryId}`)
    : "";

  const result = await request({
    url: `mobile/drink/find-all?pageNumber=${cursor}&pageSize=${DEFAULT_PAGE_SIZE}${filterString}`,
    method: "get",
  });

  return result?.data;
};

export const getCocktail = async (id) => {
  const request = await useRequest();

  const result = await request({
    url: `mobile/drink/by-id?drinkId=${id}`,
    method: "get",
  });

  return result?.data;
};

export const getMostPopularCocktails = async () => {
  const request = await useRequest();

  const result = await request({
    url: "mobile/drink/most-popular",
    method: "get",
  });

  return result?.data;
};

export const getLanguage = async () => {
  const request = await useRequest();

  const result = await request({
    url: "mobile/language/find-all",
    method: "get",
  });

  return result?.data;
};

export const getFavouriteCocktails = async (cursor, filter) => {
  const request = await useRequest();
  var filterString = "";

  filter?.inputText ? (filterString += `&searchText=${filter?.inputText}`) : "";

  const result = await request({
    url: `mobile/drink/favourites?pageNumber=${cursor}&pageSize=${DEFAULT_PAGE_SIZE}${filterString}`,
    method: "get",
  });

  return result?.data;
};

export const addOrRemoveFavouriteCocktails = async (id) => {
  const request = await useRequest();

  const result = await request({
    url: `mobile/drink/add-or-remove-from-favourites?drinkId=${id}`,
    method: "get",
  });

  return result?.data;
};

export const getAlcoholicCategory = async (cursor) => {
  const request = await useRequest();

  const result = await request({
    url: `/mobile/alcoholic-category/find-all-pagination?pageNumber=${cursor}&pageSize=${DEFAULT_FILTER_PAGE_SIZE}`,
    method: "get",
  });

  return result?.data;
};

export const getDrinkCategory = async (cursor) => {
  const request = await useRequest();

  const result = await request({
    url: `/mobile/drink-category/find-all-pagination?pageNumber=${cursor}&pageSize=${DEFAULT_FILTER_PAGE_SIZE}`,
    method: "get",
  });

  return result?.data;
};
