import { Form } from "react-bootstrap";

const SortOptions = ({ sortOption, setSortOption }) => {
  return (
    <Form.Select
      aria-label="Sort option selector"
      onChange={(e) => setSortOption(e.target.value)}
    >
      <option>Sort By</option>
      <option value="price_1">Price: Low to High</option>
      <option value="price_-1">Price: High to Low</option>
      <option value="rating_-1">Customer Ratings</option>
      <option value="name_1">Name: A-Z</option>
      <option value="name_-1">Name: Z-A</option>
    </Form.Select>
  );
};

export default SortOptions;
