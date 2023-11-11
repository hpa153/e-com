import axios from "axios";

import { GET_CATEGORIES, ADD_ATTRIBUTE } from "../constants/categoryConstants";

export const getCategories = () => async (dispatch) => {
  const categories = await axios.get("/api/categories");

  dispatch({
    type: GET_CATEGORIES,
    payload: categories.data,
  });
};

export const saveAttrToDB =
  (key, value, chosenCategory) => async (dispatch) => {
    const categories = await axios.post("/api/categories/add-attr", {
      key,
      value,
      chosenCategory,
    });

    if (categories.data.categoryUpdated) {
      dispatch({
        type: ADD_ATTRIBUTE,
        payload: [...categories.data.categoryUpdated],
      });
    }
  };
