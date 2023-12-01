import { useState, useEffect, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Row, Col, Container, ListGroup, Button } from "react-bootstrap";

import PaginationComponent from "../Pagination";
import ProductForList from "../ProductForList";
import SortOptions from "../SortOptions";
import PriceFilter from "../filterQueryResultOptions/PriceFilter";
import RatingFilter from "../filterQueryResultOptions/RatingFilter";
import CategoryFilter from "../filterQueryResultOptions/CategoryFilter";
import AttributesFilter from "../filterQueryResultOptions/AttributeFilter";

const getAttrsForCategory = (categories, categoryName, setAttrFilter) => {
  if (categoryName) {
    const categoryData = categories?.categories?.find(
      (category) => category.name === categoryName.replaceAll(",", "/")
    );

    if (categoryData) {
      setAttrFilter(categoryData.attrs);
    }
  }
};

const initialFilters = {
  price: 0,
  rating: {},
  categories: "",
  searchQuery: "",
  page: 1,
};

const ProductListComp = ({ fetchProducts }) => {
  const { categoryName } = useParams() || "";
  const { searchQuery } = useParams() || "";
  const [products, setProducts] = useState([]);
  const [attrFilter, setAttrFilter] = useState([]);
  const [allFilters, setAllFilters] = useState(initialFilters);
  const [selectedAttrs, setSelectedAttrs] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const categories = useSelector((state) => state.categories);

  const getProducts = useCallback(
    async (categoryName, sortOption, filters) => {
      const fetchedProducts = await fetchProducts(
        categoryName,
        sortOption,
        filters
      );

      setProducts(fetchedProducts);
    },
    [fetchProducts]
  );

  useEffect(() => {
    getAttrsForCategory(categories, categoryName, setAttrFilter);
    const productFilters = {
      page: allFilters?.page,
    };

    if (searchQuery) {
      productFilters.searchQuery = searchQuery;
    }

    getProducts(categoryName, sortOption, productFilters);
  }, [
    getProducts,
    categoryName,
    categories,
    sortOption,
    allFilters.page,
    searchQuery,
  ]);

  // Get attributes for selected filter category
  useEffect(() => {
    if (allFilters.categories) {
      getAttrsForCategory(
        categories,
        allFilters.categories.selectedMainCategory,
        setAttrFilter
      );
    } else {
      setAttrFilter([]);
    }
  }, [allFilters.categories, categories]);

  const handleFilter = () => {
    setAllFilters({
      ...allFilters,
      attrs: selectedAttrs,
      page: 1,
    });

    getProducts("", "", allFilters);
  };

  const resetFilter = () => {
    setAllFilters(initialFilters);
    setSelectedAttrs([]);
  };

  return (
    <Container fluid>
      <Row>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item className="my-3">
              <SortOptions
                sortOption={sortOption}
                setSortOption={setSortOption}
              />
            </ListGroup.Item>
            <ListGroup.Item>
              <b>Price:</b> <br />
              <PriceFilter
                allFilters={allFilters}
                setAllFilters={setAllFilters}
              />
            </ListGroup.Item>
            <ListGroup.Item>
              <b>Rating:</b> <br />
              <RatingFilter
                allFilters={allFilters}
                setAllFilters={setAllFilters}
              />
            </ListGroup.Item>
            <ListGroup.Item>
              <b>Category:</b> <br />
              <CategoryFilter
                categories={categories.categories}
                allFilters={allFilters}
                setAllFilters={setAllFilters}
              />
            </ListGroup.Item>
            <ListGroup.Item>
              <AttributesFilter
                attrFilter={attrFilter}
                setSelectedAttrs={setSelectedAttrs}
              />
            </ListGroup.Item>
            <ListGroup.Item>
              <Button variant="primary" onClick={handleFilter}>
                Filter
              </Button>
              &nbsp;
              <Button
                variant="danger"
                onClick={resetFilter}
                disabled={
                  selectedAttrs.length === 0 &&
                  Object.entries(allFilters.rating).length === 0 &&
                  allFilters.categories === categoryName
                }
              >
                Reset
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={9}>
          {products?.products?.length > 0 ? (
            products?.products?.map((product) => (
              <ProductForList key={product._id} product={product} />
            ))
          ) : (
            <h2>Sorry, no products available for this category!</h2>
          )}

          {products.totalPages > 1 && (
            <PaginationComponent
              categoryName={categoryName}
              searchParams={allFilters}
              totalPages={products.totalPages}
              setAllFilters={setAllFilters}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProductListComp;
