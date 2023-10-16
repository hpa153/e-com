import * as actionTypes from "../constants/cartConstants";

const cartReducer = (state = { value: 0 }, action) => {
  switch (action.type) {
    case actionTypes.ADD_TO_CART: {
      return state;
    }
    default: {
      return state;
    }
  }
};

export default cartReducer;
