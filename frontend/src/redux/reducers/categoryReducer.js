import { GET_CATEGORIES, ADD_ATTRIBUTE } from "../constants/categoryConstants";

const categoryReducer = (state = { categories: [] }, action) => {
  switch (action.type) {
    case GET_CATEGORIES: {
      return {
        ...state,
        categories: action.payload,
      };
    }
    case ADD_ATTRIBUTE: {
      return {
        ...state,
        categories: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

export default categoryReducer;
