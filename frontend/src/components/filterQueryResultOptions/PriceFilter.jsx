import { Form } from "react-bootstrap";

const PriceFilter = ({ allFilters, setAllFilters }) => {
  return (
    <>
      <Form.Label>
        <span className="fw-bold">Price no greater than:</span> <br />$
        {allFilters.price}
      </Form.Label>
      <Form.Range
        min={0}
        max={5000}
        step={10}
        onChange={(e) =>
          setAllFilters({ ...allFilters, price: e.target.value })
        }
      />
    </>
  );
};

export default PriceFilter;
