import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { LinkContainer } from "react-router-bootstrap";

const CategoryCard = ({ category }) => {
  return (
    <Card>
      <Card.Img crossOrigin="anonymous" variant="top" src={category.image} />
      <Card.Body>
        <Card.Title>{category.name}</Card.Title>
        <Card.Text>{category.description}</Card.Text>
        <LinkContainer to={"/product-list/category/" + category.name + "/1"}>
          <Button variant="primary">View Category</Button>
        </LinkContainer>
      </Card.Body>
    </Card>
  );
};

export default CategoryCard;
