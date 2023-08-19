import CategoryCard from "../components/CategoryCard";
import ProductsCarousel from "../components/ProductsCarousel";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

const Home = () => {
  const categories = ["Laptops", "Books", "Cameras", "Household", "Videos"];

  return (
    <>
      <ProductsCarousel />
      <Container>
        <Row xs={1} md={2} className="g-4 mt-3">
          {categories.map((category, idx) => (
            <CategoryCard key={idx} title={category} />
          ))}
        </Row>
      </Container>
    </>
  );
};

export default Home;
