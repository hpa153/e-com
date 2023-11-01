import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Alert,
  ListGroup,
  Button,
} from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";

import CartItem from "../../components/CartItem";
import { fetchUserData } from "./UserProfile";

const UserCartDetails = () => {
  const [user, setUser] = useState({});
  const [disableButton, setDisableButton] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user.userInfo._id);
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    const getUserData = async (id) => {
      const fetchedUser = await fetchUserData(id);

      if (
        !fetchedUser.phoneNumber ||
        !fetchedUser.address ||
        !fetchedUser.city ||
        !fetchedUser.state ||
        !fetchedUser.country ||
        !fetchedUser.zipCode
      ) {
        setDisableButton(true);
      }

      setUser(fetchedUser);
    };

    getUserData(userId);
  }, [userId]);

  const orderHandler = async () => {
    const orderData = {
      orderTotal: {
        itemsCount: cart.itemsCount,
        cartSubtotal: cart.cartSubtotal,
      },
      cartItems: cart.cartItems,
      paymentMethod,
    };

    try {
      const order = await axios.post("/api/orders", orderData);

      navigate("/user/order-details/" + order.data._id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container fluid>
      <Row className="mt-4">
        <h1>Cart Details</h1>
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
              <Form.Select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="PayPal">PayPal</option>
                <option value="cod">
                  Cash On Delivery (delivery may be delayed)
                </option>
              </Form.Select>
            </Col>
          </Row>
          <br />
          <h2>Order items</h2>
          <ListGroup variant="flush">
            {cart.cartItems.map((item, idx) => (
              <CartItem key={idx} item={item} />
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
              <span className="fw-bold">${cart.cartSubtotal}</span>
            </ListGroup.Item>
            <ListGroup.Item>
              Shipping: <span className="fw-bold">Included</span>
            </ListGroup.Item>
            <ListGroup.Item>
              Tax: <span className="fw-bold">Included</span>
            </ListGroup.Item>
            <ListGroup.Item className="text-danger">
              Total price: <span className="fw-bold">${cart.cartSubtotal}</span>
            </ListGroup.Item>
            <ListGroup.Item>
              <div className="d-grid gap-2">
                <Button
                  variant="danger"
                  type="button"
                  disabled={disableButton}
                  onClick={orderHandler}
                >
                  Place Order
                </Button>
              </div>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default UserCartDetails;
