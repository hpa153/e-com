import { Rating } from "react-simple-star-rating";
import { Form } from "react-bootstrap";

const RatingFilter = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, idx) => (
        <Form.Check key={idx} type="checkbox" id={`check-rating-${idx}`}>
          <Form.Check.Input type="checkbox" isValid />
          <Form.Check.Label style={{ cursor: "pointer" }}>
            <Rating readonly size={20} initialValue={5 - idx} />
          </Form.Check.Label>
        </Form.Check>
      ))}
    </>
  );
};

export default RatingFilter;
