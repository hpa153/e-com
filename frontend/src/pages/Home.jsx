import CategoryCard from "../components/CategoryCard";
import ProductsCarousel from "../components/ProductsCarousel";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const { categories } = useSelector((state) => state.categories);
  const [mainCategories, setMainCategories] = useState([]);
  const [bestsellers, setBestsellers] = useState({});

  useEffect(() => {
    const getBestsellers = async () => {
      try {
        const products = await axios.get("/api/products/best-sellers");
        setBestsellers(products.data);
      } catch (error) {
        console.log(error);
      }
    };

    getBestsellers();
  }, []);

  useEffect(() => {
    setMainCategories((prev) =>
      categories?.filter((category) => !category.name.includes("/"))
    );
  }, [categories]);

  return (
    <>
      <ProductsCarousel bestsellers={bestsellers} />
      <Container>
        <Row xs={1} md={2} className="g-4 mt-3">
          {mainCategories?.map((category, idx) => (
            <CategoryCard key={idx} category={category} />
          ))}
        </Row>
      </Container>
    </>
  );
};

export default Home;
