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
import { useCallback, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import CartMessage from "../components/CartMessage";
import { addToCart } from "../redux/actions/cartActions";
import MetaComponent from "../components/MetaComponent";

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
  const user = useSelector((state) => state.user.userInfo);
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [displayMessage, setDisplayMessage] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  const pageEndRef = useRef(null);

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

  const handleReviewSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const form = e.currentTarget.elements;
      const formInput = {
        comment: form.comment.value,
        rating: form.rating.value,
      };

      if (e.currentTarget.checkValidity() === true) {
        try {
          const reviewedProduct = await axios.post(
            `/api/products/review/${id}`,
            formInput
          );

          setProduct(reviewedProduct.data);

          setTimeout(() => {
            pageEndRef.current.scrollIntoView({ behavior: "smooth" });
          }, 200);
        } catch (error) {
          console.log(error);
        }
      }
    },
    [id]
  );

  return (
    <>
      <MetaComponent title={product.name} description={product.description} />
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
                    <Rating readonly size={20} initialValue={product.rating} />{" "}
                    ({product.reviewsNumber})
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Price:&nbsp;
                    <span className="fw-bold">${product.price}</span>
                  </ListGroup.Item>
                  <ListGroup.Item>{product.description}</ListGroup.Item>
                </ListGroup>
              </Col>
              <Col md={4}>
                <ListGroup>
                  <ListGroup.Item>
                    Status:&nbsp;
                    <span className="fw-bold">
                      {product.count > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Price:&nbsp;
                    <span className="fw-bold">${product.price * quantity}</span>
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
                  {product.reviews &&
                    product.reviews.map((review, idx) => (
                      <ListGroup.Item key={idx}>
                        <div className="d-flex justify-content-between">
                          <span className="fw-bold">{review.user.name}</span>
                          <span>
                            {review.createdAt.toString().substr(0, 10)}
                          </span>
                        </div>
                        <Rating
                          readonly
                          size={20}
                          initialValue={review.rating}
                        />
                        <br />
                        {review.comment}
                      </ListGroup.Item>
                    ))}
                  <div ref={pageEndRef} />
                </ListGroup>
              </Col>
            </Row>
            <hr />
            {!user.firstName && (
              <Alert variant="danger">Login first to write a review</Alert>
            )}
            <Form onSubmit={handleReviewSubmit}>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlComment"
              >
                <Form.Label>Leave a review:</Form.Label>
                <Form.Control
                  name="comment"
                  as="textarea"
                  rows={3}
                  disabled={!user.firstName}
                />
              </Form.Group>
              <Form.Select
                aria-label="Product Rating"
                name="rating"
                disabled={!user.firstName}
              >
                <option>Your Rating</option>
                <option value="5">5 (Very good)</option>
                <option value="4">4 (Good)</option>
                <option value="3">3 (Normal)</option>
                <option value="2">2 (Bad)</option>
                <option value="1">1 (Very bad)</option>
              </Form.Select>
              <Button
                type="submit"
                className="my-3"
                variant="primary"
                disabled={!user.firstName}
              >
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ProductDetails;
