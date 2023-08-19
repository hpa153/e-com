import Carousel from "react-bootstrap/Carousel";
import { LinkContainer } from "react-router-bootstrap";

const ProductsCarousel = () => {
  return (
    <Carousel>
      <Carousel.Item>
        <img
          className="d-block w-100 carousel__image"
          src="/images/carousel/carousel-1.png"
          alt="First slide"
        />
        <Carousel.Caption>
          <LinkContainer
            className="carousel__subtitle-pointer"
            to="/product-details/abs"
          >
            <h3>Bestseller Laptops</h3>
          </LinkContainer>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100 carousel__image"
          src="/images/carousel/carousel-2.png"
          alt="Second slide"
        />
        <Carousel.Caption>
          <LinkContainer
            className="carousel__subtitle-pointer"
            to="/product-details/abs"
          >
            <h3>Bestseller Books</h3>
          </LinkContainer>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100 carousel__image"
          src="/images/carousel/carousel-3.png"
          alt="Third slide"
        />
        <Carousel.Caption>
          <LinkContainer
            className="carousel__subtitle-pointer"
            to="/product-details/abs"
          >
            <h3>Bestseller Cameras</h3>
          </LinkContainer>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default ProductsCarousel;
