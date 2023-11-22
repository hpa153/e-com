import axios from "axios";

import {
  GET_CATEGORIES,
  ADD_ATTRIBUTE,
  ADD_CATEGORY,
  DELETE_CATEGORY,
} from "../constants/categoryConstants";
import store from "../store";

export const getCategories = () => async (dispatch) => {
  try {
    const categories = await axios.get("/api/categories");

    dispatch({
      type: GET_CATEGORIES,
      payload: categories.data,
    });
  } catch (error) {
    console.log(error);
  }
};

export const saveAttrToDB =
  (key, value, chosenCategory) => async (dispatch) => {
    try {
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
    } catch (error) {
      console.log(error);
    }
  };

export const addNewCategory = (category) => async (dispatch) => {
  const allCategories = store.getState().categories.categories;

  try {
    const newCategory = await axios.post("/api/categories", { category });

    if (newCategory.data) {
      dispatch({
        type: ADD_CATEGORY,
        payload: [...allCategories, newCategory],
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteCategory = (category) => async (dispatch) => {
  const allCategories = store.getState().categories.categories;
  const updatedCategories = allCategories.filter(
    (cat) => cat.name !== category
  );

  try {
    const newCategories = await axios.delete(
      "/api/categories/" + encodeURIComponent(category)
    );

    if (newCategories.data) {
      dispatch({
        type: DELETE_CATEGORY,
        payload: [...updatedCategories],
      });
    }
  } catch (error) {
    console.log(error);
  }
};
