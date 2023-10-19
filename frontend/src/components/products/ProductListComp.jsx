import { useState, useEffect } from "react";
import { Row, Col, Container, ListGroup, Button } from "react-bootstrap";

import PaginationComponent from "../Pagination";
import ProductForList from "../ProductForList";
import SortOptions from "../SortOptions";
import PriceFilter from "../filterQueryResultOptions/PriceFilter";
import RatingFilter from "../filterQueryResultOptions/RatingFilter";
import CategoryFilter from "../filterQueryResultOptions/CategoryFilter";
import AttributesFilter from "../filterQueryResultOptions/AttributeFilter";

const ProductListComp = ({ fetchProducts }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      const fetchedProducts = await fetchProducts();

      setProducts(fetchedProducts.products);
    };

    getProducts();
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item className="my-3">
              <SortOptions />
            </ListGroup.Item>
            <ListGroup.Item>
              <b>Price:</b> <br />
              <PriceFilter />
            </ListGroup.Item>
            <ListGroup.Item>
              <b>Rating:</b> <br />
              <RatingFilter />
            </ListGroup.Item>
            <ListGroup.Item>
              <b>Category:</b> <br />
              <CategoryFilter />
            </ListGroup.Item>
            <ListGroup.Item>
              <AttributesFilter />
            </ListGroup.Item>
            <ListGroup.Item>
              <Button variant="primary">Filter</Button>&nbsp;
              <Button variant="danger">Reset</Button>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={9}>
          {products.map((product) => (
            <ProductForList key={product._id} product={product} />
          ))}

          <PaginationComponent />
        </Col>
      </Row>
    </Container>
  );
};

export default ProductListComp;
