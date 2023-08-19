import { Row, Col, Container, ListGroup, Button } from "react-bootstrap";

import PaginationComponent from "../components/Pagination";
import ProductForList from "../components/ProductForList";
import SortOptions from "../components/SortOptions";
import PriceFilter from "../components/filterQueryResultOptions/PriceFilter";
import RatingFilter from "../components/filterQueryResultOptions/RatingFilter";
import CategoryFilter from "../components/filterQueryResultOptions/CategoryFilter";
import AttributesFilter from "../components/filterQueryResultOptions/AttributeFilter";

const ProductList = () => {
  return (
    <Container fluid>
      <Row>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <SortOptions />
            </ListGroup.Item>
            <ListGroup.Item>
              <PriceFilter />
            </ListGroup.Item>
            <ListGroup.Item>
              <RatingFilter />
            </ListGroup.Item>
            <ListGroup.Item>
              <CategoryFilter />
            </ListGroup.Item>
            <ListGroup.Item>
              <AttributesFilter />
            </ListGroup.Item>
            <ListGroup.Item>
              <Button variant="primary">Primary</Button>
              <Button variant="danger">Danger</Button>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={9}>
          <ProductForList />
          <PaginationComponent />
        </Col>
      </Row>
    </Container>
  );
};

export default ProductList;
