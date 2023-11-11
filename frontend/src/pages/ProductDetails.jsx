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
import ImageZoom from "js-image-zoom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";

import CartMessage from "../components/CartMessage";
import { addToCart } from "../redux/actions/cartActions";

export const fetchProduct = async (productId) => {
  try {
    const product = await axios.get("/api/products/product/" + productId);

    return product.data;
  } catch (error) {
    console.log(error);
  }
};

const options = {
  // width: 400,
  // zoomWidth: 500,
  // fillContainer: true,
  // zoomPosition: "bottom",
  scale: 2,
  offset: { vertical: 0, horizontal: 0 },
};

const ProductDetails = () => {
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [displayMessage, setDisplayMessage] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const getProduct = async (productId) => {
      const fetchedProduct = await fetchProduct(productId);

      setProduct(fetchedProduct);
    };

    getProduct(id);
  }, [id]);

  const addToCartHandler = () => {
    dispatch(addToCart(id, quantity));
    setDisplayMessage(true);
  };

  useEffect(() => {
    if (product.images) {
      for (let image of product.images) {
        new ImageZoom(document.getElementById(image._id), options);
      }
    }
  }, [product]);

  return (
    <Container>
      <CartMessage
        displayMessage={displayMessage}
        setDisplayMessage={setDisplayMessage}
      />
      <Row className="mt-5">
        <Col style={{ zIndex: 1 }} md={4}>
          {product.images &&
            product.images.map((image) => (
              <div key={image._id}>
                <div id={image._id}>
                  <Image crossOrigin="anonymous" fluid src={image.path} />
                </div>
                <br />
              </div>
            ))}
          <br />
        </Col>
        <Col md={8}>
          <Row>
            <Col md={8}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>{product.name}</h2>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating readonly size={20} initialValue={product.rating} /> (
                  {product.reviewsNumber})
                </ListGroup.Item>
                <ListGroup.Item>
                  Price:&nbsp;<span className="fw-bold">${product.price}</span>
                </ListGroup.Item>
                <ListGroup.Item>{product.description}</ListGroup.Item>
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
                  <Form.Select
                    value={quantity}
                    aria-label="Quantity"
                    onChange={(e) => setQuantity(e.target.value)}
                  >
                    {Array.from({ length: product.count }).map((_, idx) => (
                      <option key={idx} value={idx + 1}>
                        {idx + 1}
                      </option>
                    ))}
                  </Form.Select>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Button variant="danger" onClick={addToCartHandler}>
                    Add to cart
                  </Button>
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
