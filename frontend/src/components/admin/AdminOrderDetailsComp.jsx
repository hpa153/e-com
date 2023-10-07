import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
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

import CartItem from "../../components/CartItem";

const AdminOrderDetailsComp = ({ fetchOrderDetails }) => {
  const { id } = useParams();
  const [order, setOrder] = useState([]);
  const [user, setUser] = useState({});
  const [orderSubtotal, setOrderSubtotal] = useState({});
  const [cartItems, setCartItems] = useState([]);

  const getOrder = useCallback(async () => {
    const order = await fetchOrderDetails(id);
    setOrder(order);
    setUser(order.user);
    setOrderSubtotal(order.orderTotal);
    setCartItems(order.cartItems);
  }, [id]);

  const deliverOrder = useCallback(
    async (id) => {
      try {
        await axios.put(`/api/orders/delivery/${id}`);

        getOrder(id);
      } catch (error) {
        console.log(error);
      }
    },
    [id]
  );

  useEffect(() => {
    getOrder();
  }, []);

  return (
    <Container fluid>
      <Row className="mt-4">
        <h1>Order Details</h1>
        <Col md={8}>
          <br />
          <Row>
            <Col md={6}>
              <h2>Shipping</h2>
              <b>Name</b>: {user.firstName} {user.lastName}
              <br />
              <b>Address</b>: {user.address}, {user.city}, {user.state}{" "}
              {user.zipCode}
              <br />
              <b>Phone</b>: {user.phoneNumber}
            </Col>
            <Col md={6}>
              <h2>Payment method</h2>
              <Form.Select value={order.paymentMethod} disabled={true}>
                <option value="pp">PayPal</option>
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
                    ? `Delivered on ${order.deliveredAt}`
                    : "Not delivered"}
                </Alert>
              </Col>
              <Col>
                <Alert
                  className="mt-3"
                  variant={order.isPaid ? "success" : "danger"}
                >
                  {order.isPaid ? `{Paid on ${order.paidAt}` : "Not paid"}
                </Alert>
              </Col>
            </Row>
          </Row>
          <br />
          <h2>Order items</h2>
          <ListGroup variant="flush">
            {cartItems.map((item, idx) => (
              <CartItem key={idx} item={item} orderCompleted={order.isPaid} />
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
              <span className="fw-bold">${orderSubtotal.cartSubtotal}</span>
            </ListGroup.Item>
            <ListGroup.Item>
              Shipping: <span className="fw-bold">included</span>
            </ListGroup.Item>
            <ListGroup.Item>
              Tax: <span className="fw-bold">included</span>
            </ListGroup.Item>
            <ListGroup.Item className="text-danger">
              Total price:{" "}
              <span className="fw-bold">${orderSubtotal.cartSubtotal}</span>
            </ListGroup.Item>
            <ListGroup.Item>
              <div className="d-grid gap-2">
                <Button
                  size="lg"
                  variant="danger"
                  type="button"
                  disabled={order.isDelivered}
                  onClick={() => deliverOrder(id)}
                >
                  {order.isDelivered ? "Order completed" : "Mark as delivered"}
                </Button>
              </div>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminOrderDetailsComp;
