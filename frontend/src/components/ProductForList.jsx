import { Card, Button, Row, Col } from "react-bootstrap";
import { Rating } from "react-simple-star-rating";
import { LinkContainer } from "react-router-bootstrap";

const ProductForList = ({ product }) => {
  return (
    <Card style={{ marginTop: "1.5rem", marginBottom: "2.5rem" }}>
      <Row>
        <Col lg={5}>
          {product?.images[0] && (
            <Card.Img variant="top" src={product.images[0].path} />
          )}
        </Col>
        <Col lg={7}>
          <Card.Body>
            <Card.Title>{product.name}</Card.Title>
            <Card.Text>{product.description}</Card.Text>
            <Card.Text>
              <Rating readonly size={20} initialValue={product.rating} />
              &nbsp;({product.reviewsNumber})
            </Card.Text>
            <Card.Text>
              ${product.price}&nbsp;
              <LinkContainer to={`/product-details/${product._id}`}>
                <Button variant="danger">View Details</Button>
              </LinkContainer>
            </Card.Text>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

export default ProductForList;
