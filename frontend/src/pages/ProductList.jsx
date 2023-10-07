import { Row, Col, Container, ListGroup, Button } from "react-bootstrap";
import axios from "axios";

import PaginationComponent from "../components/Pagination";
import ProductForList from "../components/ProductForList";
import SortOptions from "../components/SortOptions";
import PriceFilter from "../components/filterQueryResultOptions/PriceFilter";
import RatingFilter from "../components/filterQueryResultOptions/RatingFilter";
import CategoryFilter from "../components/filterQueryResultOptions/CategoryFilter";
import AttributesFilter from "../components/filterQueryResultOptions/AttributeFilter";

const ProductList = () => {
  axios.get("/api/products").then((res) => console.log(res));
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
          {Array.from({ length: 5 }).map((_, idx) => (
            <ProductForList
              key={idx}
              images={["games", "monitors", "tablets", "games", "monitors"]}
              idx={idx}
            />
          ))}

          <PaginationComponent />
        </Col>
      </Row>
    </Container>
  );
};

export default ProductList;
