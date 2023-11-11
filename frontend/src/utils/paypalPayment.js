import { loadScript } from "@paypal/paypal-js";
import axios from "axios";

const updateOrder = async (orderId) => {
  const order = await axios.put("/api/orders/paid/" + orderId);

  return order.data;
};

const paypalButtons = (cartSubtotal, cartItems, orderId, handlePaidOrder) => {
  return {
    createOrder: function (data, actions) {
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: cartSubtotal,
              breakdown: {
                item_total: {
                  currency_code: "USD",
                  value: cartSubtotal,
                },
              },
            },
            items: cartItems.map((product) => {
              return {
                name: product.name,
                unit_amount: {
                  currency_code: "USD",
                  value: product.price,
                },
                quantity: product.quantity,
              };
            }),
          },
        ],
      });
    },
    onCancel: onCancelHandler,
    onApprove: function (data, actions) {
      return actions.order.capture().then(async function (orderData) {
        const transaction = orderData.purchase_units[0].payments.captures[0];

        if (
          transaction.status === "COMPLETED" &&
          +transaction.amount.value === +cartSubtotal
        ) {
          try {
            const paidOrder = await updateOrder(orderId);

            if (paidOrder.isPaid) {
              handlePaidOrder();
            }
          } catch (error) {
            console.log(error);
          }
        }
      });
    },
    onError: onErrorHandler,
  };
};

const onCancelHandler = () => {};

const onErrorHandler = () => {};

const loadPayPalScript = async (
  cartSubtotal,
  cartItems,
  orderId,
  handlePaidOrder
) => {
  const paypal = await loadScript({
    "client-id": process.env.REACT_APP_PP_CLIENT_ID,
  });

  paypal
    .Buttons(paypalButtons(cartSubtotal, cartItems, orderId, handlePaidOrder))
    .render("#paypal-container");
};

export default loadPayPalScript;
