import { Container, Row, Col, Alert, ListGroup, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector } from "react-redux";

import CartItem from "../components/CartItem";

const CartPage = () => {
  const cart = useSelector((state) => state.cart);

  return (
    <Container fluid>
      <Row className="mt-4">
        <Col md={8}>
          <h1>Shopping Cart</h1>
          {cart.cartItems.length > 0 ? (
            <ListGroup variant="flush">
              {cart.cartItems.map((item, idx) => (
                <CartItem key={idx} item={item} />
              ))}
            </ListGroup>
          ) : (
            <Alert variant="info">Your cart is empty</Alert>
          )}
        </Col>
        <Col md={4}>
          <ListGroup>
            <ListGroup.Item>
              <h3>
                Subtotal ({cart.itemsCount} Item
                {cart.itemsCount === 1 ? "" : "s"})
              </h3>
            </ListGroup.Item>
            <ListGroup.Item>
              Price: <span className="fw-bold">${cart.cartSubtotal}</span>
            </ListGroup.Item>
            <ListGroup.Item>
              <LinkContainer to="/user/cart">
                <Button type="button" disabled={cart.itemsCount === 0}>
                  Proceed To Checkout
                </Button>
              </LinkContainer>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;
