import * as actionTypes from "../constants/cartConstants";

export const INITIAL_CART = {
  cartItems: [],
  itemsCount: 0,
  cartSubtotal: 0,
};

const cartReducer = (state = INITIAL_CART, action) => {
  switch (action.type) {
    case actionTypes.ADD_TO_CART: {
      const toBeAddedProduct = action.payload;
      const existingProduct = state.cartItems.find(
        (prod) => prod.productId === toBeAddedProduct.productId
      );

      const newCart = { ...state };
      if (existingProduct) {
        newCart.itemsCount = 0;
        newCart.cartSubtotal = 0;

        newCart.cartItems = state.cartItems.map((prod) => {
          if (prod.productId === toBeAddedProduct.productId) {
            newCart.itemsCount += toBeAddedProduct.quantity;
            newCart.cartSubtotal +=
              toBeAddedProduct.price * toBeAddedProduct.quantity;
          } else {
            newCart.itemsCount += prod.quantity;
            newCart.cartSubtotal += prod.price * prod.quantity;
          }

          return prod.productId === toBeAddedProduct.productId
            ? toBeAddedProduct
            : prod;
        });
      } else {
        newCart.itemsCount += toBeAddedProduct.quantity;
        newCart.cartSubtotal +=
          toBeAddedProduct.price * toBeAddedProduct.quantity;
        newCart.cartItems.push(toBeAddedProduct);
      }

      return newCart;
    }
    default: {
      return state;
    }
  }
};

export default cartReducer;
