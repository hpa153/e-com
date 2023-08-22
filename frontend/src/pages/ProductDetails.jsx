import {
  Row,
  Col,
  Container,
  Image,
  ListGroup,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { Rating } from "react-simple-star-rating";
import { useParams } from "react-router-dom";

import CartMessage from "../components/CartMessage";

const ProductDetails = () => {
  const { id } = useParams();

  return (
    <Container>
      <CartMessage />
      <Row className="mt-5">
        <Col md={4}>
          <Image fluid src="/images/games-category.png" />
          <Image fluid src="/images/monitors-category.png" />
          <Image fluid src="/images/tablets-category.png" />
          <Image fluid src="/images/games-category.png" />
        </Col>
        <Col md={8}>
          <Row>
            <Col md={8}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>Product name</h2>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating readonly size={20} initialValue={4} /> (1)
                </ListGroup.Item>
                <ListGroup.Item>
                  Price:&nbsp;<span className="fw-bold">$153</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  Porta ac consectetur ac Porta ac consectetur ac Porta ac
                  consectetur ac
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={4}>
              <ListGroup>
                <ListGroup.Item>
                  Status:&nbsp;<span className="fw-bold">In Stock</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  Price:&nbsp;<span className="fw-bold">$256</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  Quantity:
                  <Form.Select aria-label="Default select example">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </Form.Select>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Button variant="danger">Add to cart</Button>
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
          <Row>
            <Col className="mt-5">
              <h5>REVIEWS</h5>
              <ListGroup variant="flush">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <ListGroup.Item key={idx}>
                    <div className="d-flex justify-content-between">
                      <span className="fw-bold">Thomas</span>
                      <span>2023-08-21</span>
                    </div>
                    <Rating readonly size={20} initialValue={5} />
                    <br />
                    Cras justo odio
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
          </Row>
          <hr />
          <Alert variant="danger">Login first to write a review</Alert>
          <Form>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Leave a review:</Form.Label>
              <Form.Control as="textarea" rows={3} />
            </Form.Group>
            <Form.Select aria-label="Default select example">
              <option>Your Rating</option>
              <option value="5">5 (Very good)</option>
              <option value="4">4 (Good)</option>
              <option value="3">3 (Normal)</option>
              <option value="2">2 (Bad)</option>
              <option value="1">1 (Very bad)</option>
            </Form.Select>
            <Button className="my-3" variant="primary">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetails;
