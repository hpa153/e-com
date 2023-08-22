import { Form } from "react-bootstrap";

const CategoryFilter = () => {
  return (
    <Form>
      {Array.from({ length: 5 }).map((_, idx) => (
        <div key={idx} className="mb-3">
          <Form.Check type="checkbox" id={`check-category-${idx}`}>
            <Form.Check.Input type="checkbox" isValid />
            <Form.Check.Label
              style={{ cursor: "pointer" }}
            >{`Category ${idx}`}</Form.Check.Label>
          </Form.Check>
        </div>
      ))}
    </Form>
  );
};

export default CategoryFilter;
