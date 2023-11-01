import { Row, Col, Image, ListGroup, Form, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";

import { addToCart, removeFromCart } from "../redux/actions/cartActions";

const CartItem = ({ item, orderCompleted = false }) => {
  const dispatch = useDispatch();

  const removeItemHandler = (productId, quantity, price) => {
    if (window.confirm("Are you sure?")) {
      dispatch(removeFromCart(productId, quantity, price));
    }
  };

  return (
    <>
      <ListGroup.Item>
        <Row>
          <Col md={2}>
            <Image crossOrigin="anonymous" src={item.image.path} fluid />
          </Col>
          <Col md={2}>{item.name}</Col>
          <Col md={2}>
            <b>${item.price}</b>
          </Col>
          <Col md={3}>
            <Form.Select
              value={item.quantity}
              onChange={(e) => {
                dispatch(addToCart(item.productId, e.target.value));
              }}
              disabled={orderCompleted}
            >
              {[...Array(item.count).keys()].map((x) => (
                <option key={x} value={x + 1}>
                  {x + 1}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Button
              type="button"
              variant="secondary"
              disabled={orderCompleted}
              onClick={() =>
                removeItemHandler(item.productId, item.quantity, item.price)
              }
            >
              <i className="bi bi-trash"></i>
            </Button>
          </Col>
        </Row>
      </ListGroup.Item>
      <br />
    </>
  );
};

export default CartItem;
