import { Form } from "react-bootstrap";

const AttributesFilter = () => {
  return (
    <>
      <Form.Label>Color</Form.Label>
      <Form.Check type="checkbox" id="default-checkbox" label="green" />
    </>
  );
};

export default AttributesFilter;
