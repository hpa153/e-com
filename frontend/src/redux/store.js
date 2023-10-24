import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

import cartReducer from "./reducers/cartReducer";
import userReducer from "./reducers/userReducer";

const reducer = combineReducers({ cart: cartReducer, user: userReducer });
const middleWares = [thunk];

const localUserInfo = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : sessionStorage.getItem("userInfo")
  ? JSON.parse(sessionStorage.getItem("userInfo"))
  : {};

const localCartItems = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : [];

const initialState = {
  cart: {
    cartItems: localCartItems,
    itemsCount:
      localCartItems.length > 0
        ? localCartItems.reduce((qty, item) => +item.quantity + qty, 0)
        : 0,
    cartSubtotal:
      localCartItems.length > 0
        ? localCartItems.reduce(
            (price, item) => +item.quantity * item.price + price,
            0
          )
        : 0,
  },
  user: {
    userInfo: localUserInfo,
  },
};

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleWares))
);

export default store;
