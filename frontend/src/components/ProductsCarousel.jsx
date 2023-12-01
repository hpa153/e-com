import Carousel from "react-bootstrap/Carousel";
import { LinkContainer } from "react-router-bootstrap";

const ProductsCarousel = ({ bestsellers }) => {
  return bestsellers?.length > 0 ? (
    <Carousel>
      {bestsellers.map((prod, idx) => (
        <Carousel.Item key={idx}>
          <img
            crossOrigin="anonymous"
            className="d-block w-100 carousel__image"
            src={prod.images ? prod.images[0].path : null}
            alt={prod.name}
          />
          <Carousel.Caption>
            <LinkContainer
              className="carousel__subtitle-pointer"
              to={`/product-details/${prod._id}`}
            >
              <h3>Bestseller in {prod.category.split("/")[0]} category</h3>
            </LinkContainer>
            <p>{prod.description}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  ) : null;
};

export default ProductsCarousel;
