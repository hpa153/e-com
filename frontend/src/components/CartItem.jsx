import { Row, Col, Image, ListGroup, Form, Button } from "react-bootstrap";

const CartItem = ({ item, orderCompleted = false }) => {
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
              onChange={() => {}}
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
              onClick={() => window.confirm("Are you sure?")}
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
