import { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Alert,
  ListGroup,
  Button,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "axios";
import { useParams } from "react-router-dom";

import CartItem from "../../components/CartItem";
import { fetchUserData } from "./UserProfile";
import loadPayPalScript from "../../utils/paypalPayment";

const fetchOrder = async (orderId) => {
  const order = await axios.get("/api/orders/user/" + orderId);

  return order.data;
};

const UserOrderDetails = () => {
  const { orderId } = useParams();
  const [user, setUser] = useState({});
  const [order, setOrder] = useState({
    orderTotal: {
      itemsCount: 0,
      cartSubtotal: 0,
    },
    cartItems: [],
    paymentMethod: "PayPal",
    isPaid: false,
    isDelivered: false,
  });
  const userId = useSelector((state) => state.user.userInfo._id);
  const paypalContainer = useRef();

  useEffect(() => {
    const getUserData = async (id) => {
      const fetchedUser = await fetchUserData(id);

      setUser(fetchedUser);
    };

    getUserData(userId);
  }, [userId]);

  useEffect(() => {
    const getUserOrder = async (id) => {
      const fetchedOrder = await fetchOrder(id);

      setOrder(fetchedOrder);
    };

    getUserOrder(orderId);
  }, [orderId, order.isPaid]);

  const paymentHandler = async () => {
    try {
      loadPayPalScript(
        order.orderTotal.cartSubtotal,
        order.cartItems,
        orderId,
        handlePaidOrder
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handlePaidOrder = () => {
    setOrder({ ...order, isPaid: true });
    paypalContainer.current.style = "display: none;";
  };

  return (
    <Container fluid>
      <Row className="mt-4">
        <h1>Order Details</h1>
        <Col md={8}>
          <br />
          <Row>
            <Col md={6}>
              <h2>Shipping</h2>
              <b>Name</b>: {`${user.firstName} ${user.lastName}`} <br />
              <b>Address</b>:{" "}
              {`${user.address}, ${user.city}, ${user.state} ${user.zipCode}, ${user.country}`}
              <br />
              <b>Phone</b>: {user.phoneNumber}
            </Col>
            <Col md={6}>
              <h2>Payment method</h2>
              <Form.Select disabled={true} value={order.paymentMethod}>
                <option value="PayPal">PayPal</option>
                <option value="cod">
                  Cash On Delivery (delivery may be delayed)
                </option>
              </Form.Select>
            </Col>
            <Row>
              <Col>
                <Alert
                  className="mt-3"
                  variant={order.isDelivered ? "success" : "danger"}
                >
                  {order.isDelivered
                    ? `Delivered on ${String(order.deliveredAt).slice(0, 10)}`
                    : "Not delivered"}
                </Alert>
              </Col>
              <Col>
                <Alert
                  className="mt-3"
                  variant={order.isPaid ? "success" : "danger"}
                >
                  {order.isPaid
                    ? `Paid on ${String(order.paidAt).slice(0, 10)}`
                    : "Not paid"}
                </Alert>
              </Col>
            </Row>
          </Row>
          <br />
          <h2>Order items</h2>
          <ListGroup variant="flush">
            {order.cartItems.map((item, idx) => (
              <CartItem key={idx} item={item} orderCompleted={true} />
            ))}
          </ListGroup>
        </Col>
        <Col md={4}>
          <ListGroup>
            <ListGroup.Item>
              <h3>Order summary</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              Items price (after tax):{" "}
              <span className="fw-bold">${order.orderTotal.cartSubtotal}</span>
            </ListGroup.Item>
            <ListGroup.Item>
              Shipping: <span className="fw-bold">Included</span>
            </ListGroup.Item>
            <ListGroup.Item>
              Tax: <span className="fw-bold">Included</span>
            </ListGroup.Item>
            <ListGroup.Item className="text-danger">
              Total price:{" "}
              <span className="fw-bold">${order.orderTotal.cartSubtotal}</span>
            </ListGroup.Item>
            <ListGroup.Item>
              <div className="d-grid gap-2">
                <Button
                  variant="danger"
                  type="button"
                  disabled={order.isPaid || order.paymentMethod !== "PayPal"}
                  onClick={paymentHandler}
                >
                  {order.isPaid
                    ? "Your order is finished"
                    : order.paymentMethod === "PayPal"
                    ? "Pay for the order"
                    : "Payment on delivery"}
                </Button>
                <div ref={paypalContainer} id="paypal-container"></div>
              </div>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default UserOrderDetails;
