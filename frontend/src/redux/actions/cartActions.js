import * as actionTypes from "../constants/cartConstants";
import axios from "axios";

export const addToCart =
  (productId, quantity) => async (dispatch, getState) => {
    const product = await axios.get("/api/products/product/" + productId);

    dispatch({
      type: actionTypes.ADD_TO_CART,
      payload: {
        productId,
        name: product.data.name,
        price: product.data.price,
        image: product.data.images[0] ?? null,
        count: product.data.count,
        quantity: +quantity,
      },
    });

    localStorage.setItem("cart", JSON.stringify(getState().cart.cartItems));
  };

export const removeFromCart =
  (productId, quantity, price) => async (dispatch, getState) => {
    const product = await axios.get("/api/products/product/" + productId);

    dispatch({
      type: actionTypes.REMOVE_FROM_CART,
      payload: {
        productId,
        price: +price,
        quantity: +quantity,
      },
    });

    localStorage.setItem("cart", JSON.stringify(getState().cart.cartItems));
  };
